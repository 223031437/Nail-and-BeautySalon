package za.ac.cput.nailbeautysalon.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import za.ac.cput.nailbeautysalon.domain.Employee;
import za.ac.cput.nailbeautysalon.domain.Inquiry;
import za.ac.cput.nailbeautysalon.dto.AppointmentResponse;
import za.ac.cput.nailbeautysalon.repository.EmployeeRepository;

import java.time.format.DateTimeFormatter;
import java.util.LinkedHashSet;
import java.util.Set;

/**
 * Sends the booking and contact-form e-mails.
 *
 * E-mails go out in the background (@Async) so a slow or broken mail server can never make a
 * booking fail. If app.mail.enabled=false (the default until SMTP is configured) the e-mail is
 * written to the log instead, so you can see exactly what would have been sent.
 */
@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private static final DateTimeFormatter WHEN = DateTimeFormatter.ofPattern("EEEE, d MMMM yyyy 'at' HH:mm");

    private final ObjectProvider<JavaMailSender> senderProvider;
    private final EmployeeRepository employeeRepository;

    @Value("${app.mail.enabled:false}")
    private boolean enabled;

    @Value("${app.mail.from:}")
    private String from;

    @Value("${app.mail.staff-inbox:}")
    private String staffInbox;

    @Value("${app.salon.name:Nail & Beauty Salon}")
    private String salonName;

    public EmailService(ObjectProvider<JavaMailSender> senderProvider, EmployeeRepository employeeRepository) {
        this.senderProvider = senderProvider;
        this.employeeRepository = employeeRepository;
    }

    // ===================== Bookings =====================

    @Async
    public void sendBookingConfirmed(AppointmentResponse a) {
        String when = a.dateTime().format(WHEN);
        String details = bookingDetails(a);

        send(a.customerEmail(), "Your booking is confirmed - " + a.appointmentId(),
                "Hi " + a.customerName() + ",\n\n"
                        + "Thank you for booking with " + salonName + ". Your appointment is confirmed for " + when + ".\n\n"
                        + details
                        + "\nNeed to change the time? Log in and open \"My Bookings\" to pick another available time slot or cancel.\n\n"
                        + "See you soon,\n" + salonName);

        sendToStaff("New booking " + a.appointmentId() + " - " + a.serviceSelected(),
                "A new booking has been made and confirmed.\n\n" + details);
    }

    @Async
    public void sendBookingRescheduled(AppointmentResponse a, java.time.LocalDateTime previous) {
        String details = bookingDetails(a);
        String was = previous == null ? "" : "Previous time: " + previous.format(WHEN) + "\n";

        send(a.customerEmail(), "Your booking was rescheduled - " + a.appointmentId(),
                "Hi " + a.customerName() + ",\n\n"
                        + "Your appointment is now on " + a.dateTime().format(WHEN) + ".\n" + was + "\n"
                        + details + "\nRegards,\n" + salonName);

        sendToStaff("Booking rescheduled " + a.appointmentId(),
                "A booking was moved to a new time slot.\n" + was + "\n" + details);
    }

    @Async
    public void sendBookingCancelled(AppointmentResponse a) {
        String details = bookingDetails(a);

        send(a.customerEmail(), "Your booking was cancelled - " + a.appointmentId(),
                "Hi " + a.customerName() + ",\n\n"
                        + "Your appointment for " + a.dateTime().format(WHEN) + " has been cancelled.\n\n"
                        + details + "\nYou are welcome to book another time at any point.\n\n"
                        + "Regards,\n" + salonName);

        sendToStaff("Booking cancelled " + a.appointmentId(),
                "A booking was cancelled.\n\n" + details);
    }

    private String bookingDetails(AppointmentResponse a) {
        StringBuilder sb = new StringBuilder();
        sb.append("Reference: ").append(a.appointmentId()).append('\n');
        sb.append("Service:   ").append(a.serviceSelected()).append('\n');
        sb.append("When:      ").append(a.dateTime().format(WHEN)).append('\n');
        sb.append("Status:    ").append(a.status()).append('\n');
        if (a.amount() != null) {
            sb.append("Amount:    R").append(String.format("%.2f", a.amount()))
              .append(" (").append(a.paymentMethod()).append(", ").append(a.paymentStatus()).append(")\n");
        }
        sb.append("Customer:  ").append(a.customerName()).append(" | ").append(a.customerEmail())
          .append(" | ").append(a.customerCell()).append('\n');
        if (a.address() != null) {
            sb.append("Address:   ").append(a.address().streetNumber()).append(' ').append(a.address().streetName())
              .append(", ").append(a.address().suburb()).append(", ").append(a.address().city())
              .append(", ").append(a.address().province()).append(' ').append(a.address().postalCode()).append('\n');
        }
        if (a.notes() != null && !a.notes().isBlank()) {
            sb.append("Notes:     ").append(a.notes()).append('\n');
        }
        return sb.toString();
    }

    // ===================== Contact form =====================

    @Async
    public void sendInquiryReceived(Inquiry i) {
        send(i.getEmail(), "We received your message",
                "Hi " + i.getFullName() + ",\n\n"
                        + "Thank you for contacting " + salonName + ". We have received your message and one of our "
                        + "team will reply by e-mail or phone shortly.\n\n"
                        + "Your message:\n" + i.getMessage() + "\n\nRegards,\n" + salonName);

        sendToStaff("New message from " + i.getFullName() + " (" + i.getSubject() + ")",
                "A customer sent a message through the Contact page.\n\n"
                        + "Name:    " + i.getFullName() + "\n"
                        + "Email:   " + i.getEmail() + "\n"
                        + "Phone:   " + i.getPhoneNumber() + "\n"
                        + "Subject: " + i.getSubject() + "\n\n"
                        + i.getMessage() + "\n\n"
                        + "Log in to the employee portal > Messages to respond (by e-mail or phone).");
    }

    @Async
    public void sendInquiryReply(Inquiry i) {
        send(i.getEmail(), "Re: your message to " + salonName,
                "Hi " + i.getFullName() + ",\n\n" + i.getResponse()
                        + "\n\n--- Your original message ---\n" + i.getMessage()
                        + "\n\nRegards,\n" + (i.getRespondedBy() != null ? i.getRespondedBy() + "\n" : "") + salonName);
    }

    // ===================== plumbing =====================

    private void sendToStaff(String subject, String body) {
        Set<String> recipients = new LinkedHashSet<>();
        if (staffInbox != null && !staffInbox.isBlank()) {
            for (String address : staffInbox.split(",")) {
                if (!address.isBlank()) recipients.add(address.trim());
            }
        }
        try {
            for (Employee e : employeeRepository.findAll()) {
                if (e.getEmail() != null && !e.getEmail().isBlank()) recipients.add(e.getEmail().trim());
            }
        } catch (Exception ex) {
            log.warn("Could not load employee e-mail addresses: {}", ex.getMessage());
        }
        if (recipients.isEmpty()) {
            log.warn("No employee e-mail addresses registered and app.mail.staff-inbox not set - staff e-mail '{}' not sent", subject);
            return;
        }
        for (String to : recipients) {
            send(to, subject, body);
        }
    }

    private void send(String to, String subject, String body) {
        if (to == null || to.isBlank()) {
            return;
        }
        JavaMailSender sender = senderProvider.getIfAvailable();
        if (!enabled || sender == null) {
            log.info("[E-MAIL not sent - app.mail.enabled=false] To: {} | Subject: {}\n{}", to, subject, body);
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            if (from != null && !from.isBlank()) {
                message.setFrom(from);
            }
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            sender.send(message);
            log.info("E-mail sent to {} ({})", to, subject);
        } catch (Exception ex) {
            log.error("Failed to send e-mail to {} ({}): {}", to, subject, ex.getMessage());
        }
    }
}
