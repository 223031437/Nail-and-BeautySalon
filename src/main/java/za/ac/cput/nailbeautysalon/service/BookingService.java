package za.ac.cput.nailbeautysalon.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;
import za.ac.cput.nailbeautysalon.domain.*;
import za.ac.cput.nailbeautysalon.dto.*;
import za.ac.cput.nailbeautysalon.exception.ApiException;
import za.ac.cput.nailbeautysalon.repository.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * All booking rules live here: which time slots exist, which are free, creating a booking
 * (with its payment record), rescheduling and cancelling.
 *
 * Opening hours (same as the Contact page): Mon-Fri 10:00-18:00, Sat 08:00-16:00, Sun closed.
 * Slots are one hour long; app.booking.capacity says how many bookings one slot can hold.
 */
@Service
public class BookingService {

    public static final String CONFIRMED = "Confirmed";
    public static final String CANCELLED = "Cancelled";
    public static final String COMPLETED = "Completed";

    private static final DateTimeFormatter TIME = DateTimeFormatter.ofPattern("HH:mm");

    private final AppointmentRepository appointmentRepository;
    private final AddressRepository addressRepository;
    private final PaymentRepository paymentRepository;
    private final ServiceRepository serviceRepository;
    private final CustomerRepository customerRepository;
    private final EmailService emailService;
    private final TransactionTemplate tx;

    /** Serialises booking changes so two customers can never grab the same slot at the same moment. */
    private final Object lock = new Object();

    @Value("${app.timezone:Africa/Johannesburg}")
    private String timezone;

    @Value("${app.booking.capacity:1}")
    private int capacity;

    @Autowired
    public BookingService(AppointmentRepository appointmentRepository,
                          AddressRepository addressRepository,
                          PaymentRepository paymentRepository,
                          ServiceRepository serviceRepository,
                          CustomerRepository customerRepository,
                          EmailService emailService,
                          PlatformTransactionManager transactionManager) {
        this.appointmentRepository = appointmentRepository;
        this.addressRepository = addressRepository;
        this.paymentRepository = paymentRepository;
        this.serviceRepository = serviceRepository;
        this.customerRepository = customerRepository;
        this.emailService = emailService;
        this.tx = new TransactionTemplate(transactionManager);
    }

    // ============================== time slots ==============================

    public List<LocalTime> slotTimes(LocalDate date) {
        DayOfWeek day = date.getDayOfWeek();
        int open;
        int close;
        if (day == DayOfWeek.SUNDAY) {
            return List.of();
        } else if (day == DayOfWeek.SATURDAY) {
            open = 8;
            close = 16;
        } else {
            open = 10;
            close = 18;
        }
        List<LocalTime> times = new ArrayList<>();
        for (int hour = open; hour < close; hour++) {
            times.add(LocalTime.of(hour, 0));
        }
        return times;
    }

    private LocalDateTime now() {
        return LocalDateTime.now(ZoneId.of(timezone));
    }

    /** Every slot of the given day and whether it can still be booked. */
    public List<SlotResponse> availability(LocalDate date) {
        List<Appointment> taken = appointmentRepository.findByDateTimeBetweenAndStatusNot(
                date.atStartOfDay(), date.plusDays(1).atStartOfDay(), CANCELLED);
        Map<LocalDateTime, Long> usage = taken.stream()
                .collect(Collectors.groupingBy(Appointment::getDateTime, Collectors.counting()));
        LocalDateTime now = now();

        List<SlotResponse> slots = new ArrayList<>();
        for (LocalTime time : slotTimes(date)) {
            LocalDateTime dateTime = date.atTime(time);
            boolean free = dateTime.isAfter(now) && usage.getOrDefault(dateTime, 0L) < capacity;
            slots.add(new SlotResponse(dateTime, time.format(TIME), free));
        }
        return slots;
    }

    /** Throws a 400/409 with a friendly message unless the slot exists, is in the future and is free. */
    private void validateSlot(LocalDateTime dateTime, String ignoreAppointmentId) {
        if (dateTime == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Please select a date and time.");
        }
        if (!slotTimes(dateTime.toLocalDate()).contains(dateTime.toLocalTime())) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                    "Please choose one of the available time slots (Mon-Fri 10:00-18:00, Sat 08:00-16:00, closed on Sundays).");
        }
        if (!dateTime.isAfter(now())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Please select a future date and time.");
        }
        long used = appointmentRepository.findByDateTimeAndStatusNot(dateTime, CANCELLED).stream()
                .filter(a -> !a.getAppointmentId().equals(ignoreAppointmentId))
                .count();
        if (used >= capacity) {
            throw new ApiException(HttpStatus.CONFLICT,
                    "That time slot is no longer available. Please choose another available slot.");
        }
    }

    // ============================== create ==============================

    public AppointmentResponse create(Account account, BookingRequest request) {
        AppointmentResponse response;
        synchronized (lock) {
            response = tx.execute(status -> doCreate(account, request));
        }
        emailService.sendBookingConfirmed(response);
        return response;
    }

    private AppointmentResponse doCreate(Account account, BookingRequest request) {
        Customer customer = account.getUserId() == null ? null
                : customerRepository.findById(account.getUserId()).orElse(null);
        if (customer == null) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only registered customers can book appointments.");
        }

        validateSlot(request.dateTime(), null);

        List<za.ac.cput.nailbeautysalon.domain.Service> matches =
                serviceRepository.findByServiceNameIgnoreCase(request.serviceSelected().trim());
        if (matches.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "The selected service is not available. Please choose another service.");
        }
        double price = matches.get(0).getPrice();

        AddressDto a = request.address();
        Address address = new Address.Builder()
                .setStreetNumber(a.streetNumber().trim())
                .setStreetName(a.streetName().trim())
                .setSuburb(a.suburb().trim())
                .setCity(a.city().trim())
                .setProvince(a.province().trim())
                .setPostalCode(Integer.parseInt(a.postalCode().trim()))
                .build();
        addressRepository.save(address);

        String appointmentId = "APT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Appointment appointment = new Appointment.Builder()
                .setAppointmentId(appointmentId)
                .setLocalDateTime(request.dateTime())
                .setServiceSelected(matches.get(0).getServiceName())
                .setAddress(address)
                .setNotes(request.notes() == null ? "" : request.notes().trim())
                .setStatus(CONFIRMED)
                .setCustomerId(customer.getUserId())
                .build();
        appointmentRepository.save(appointment);

        Payment payment = new Payment("PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(),
                appointmentId, customer.getUserId(), price, request.paymentMethod().trim(), Payment.PENDING);
        paymentRepository.save(payment);

        return toResponse(appointment, customer, payment);
    }

    // ============================== reschedule / cancel ==============================

    private record Rescheduled(AppointmentResponse response, LocalDateTime previous) {}

    public AppointmentResponse reschedule(Account account, String appointmentId, LocalDateTime newDateTime) {
        Rescheduled result;
        synchronized (lock) {
            result = tx.execute(status -> {
                Appointment existing = findAuthorised(account, appointmentId);
                ensureChangeable(existing, account);
                if (newDateTime != null && newDateTime.equals(existing.getDateTime())) {
                    throw new ApiException(HttpStatus.BAD_REQUEST, "That is already the time of this booking. Please choose a different slot.");
                }
                validateSlot(newDateTime, existing.getAppointmentId());

                Appointment updated = new Appointment.Builder().copy(existing)
                        .setLocalDateTime(newDateTime)
                        .setStatus(CONFIRMED)
                        .build();
                appointmentRepository.save(updated);
                return new Rescheduled(toResponse(updated), existing.getDateTime());
            });
        }
        emailService.sendBookingRescheduled(result.response(), result.previous());
        return result.response();
    }

    public AppointmentResponse cancel(Account account, String appointmentId) {
        AppointmentResponse response;
        synchronized (lock) {
            response = tx.execute(status -> {
                Appointment existing = findAuthorised(account, appointmentId);
                if (CANCELLED.equals(existing.getStatus())) {
                    throw new ApiException(HttpStatus.CONFLICT, "This booking is already cancelled.");
                }
                if (COMPLETED.equals(existing.getStatus())) {
                    throw new ApiException(HttpStatus.CONFLICT, "A completed booking cannot be cancelled.");
                }
                Appointment updated = new Appointment.Builder().copy(existing).setStatus(CANCELLED).build();
                appointmentRepository.save(updated);

                for (Payment p : paymentRepository.findByAppointmentId(appointmentId)) {
                    if (Payment.PAID.equals(p.getStatus())) {
                        p.setStatus(Payment.REFUND_DUE);
                    } else if (Payment.PENDING.equals(p.getStatus())) {
                        p.setStatus(Payment.CANCELLED);
                    }
                    paymentRepository.save(p);
                }
                return toResponse(updated);
            });
        }
        emailService.sendBookingCancelled(response);
        return response;
    }

    /** Staff only: mark a booking Completed (or back to Confirmed). */
    public AppointmentResponse setStatus(String appointmentId, String newStatus) {
        if (!COMPLETED.equals(newStatus) && !CONFIRMED.equals(newStatus)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Status must be Confirmed or Completed. Use cancel to cancel a booking.");
        }
        synchronized (lock) {
            return tx.execute(status -> {
                Appointment existing = appointmentRepository.findById(appointmentId)
                        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Booking not found."));
                if (CANCELLED.equals(existing.getStatus())) {
                    throw new ApiException(HttpStatus.CONFLICT, "A cancelled booking cannot be reopened. Ask the customer to book again.");
                }
                Appointment updated = new Appointment.Builder().copy(existing).setStatus(newStatus).build();
                appointmentRepository.save(updated);
                return toResponse(updated);
            });
        }
    }

    // ============================== queries ==============================

    public List<AppointmentResponse> getAll() {
        return toResponses(appointmentRepository.findAllByOrderByDateTimeAsc());
    }

    public List<AppointmentResponse> getForCustomer(String customerId) {
        return toResponses(appointmentRepository.findByCustomerIdOrderByDateTimeAsc(customerId));
    }

    public AppointmentResponse get(Account account, String appointmentId) {
        return toResponse(findAuthorised(account, appointmentId));
    }

    // ============================== helpers ==============================

    private boolean isStaff(Account account) {
        return account.getRole() == Role.ROLE_ADMIN || account.getRole() == Role.ROLE_EMPLOYEE;
    }

    private Appointment findAuthorised(Account account, String appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Booking not found."));
        if (!isStaff(account) && !Objects.equals(appointment.getCustomerId(), account.getUserId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You can only manage your own bookings.");
        }
        return appointment;
    }

    private void ensureChangeable(Appointment appointment, Account account) {
        if (CANCELLED.equals(appointment.getStatus())) {
            throw new ApiException(HttpStatus.CONFLICT, "A cancelled booking cannot be changed. Please make a new booking.");
        }
        if (COMPLETED.equals(appointment.getStatus())) {
            throw new ApiException(HttpStatus.CONFLICT, "A completed booking cannot be changed.");
        }
        if (!isStaff(account) && appointment.getDateTime() != null && !appointment.getDateTime().isAfter(now())) {
            throw new ApiException(HttpStatus.CONFLICT, "This appointment is in the past and can no longer be changed.");
        }
    }

    private AppointmentResponse toResponse(Appointment appointment) {
        Customer customer = appointment.getCustomerId() == null ? null
                : customerRepository.findById(appointment.getCustomerId()).orElse(null);
        List<Payment> payments = paymentRepository.findByAppointmentId(appointment.getAppointmentId());
        return toResponse(appointment, customer, payments.isEmpty() ? null : payments.get(0));
    }

    private List<AppointmentResponse> toResponses(List<Appointment> appointments) {
        Set<String> customerIds = appointments.stream()
                .map(Appointment::getCustomerId).filter(Objects::nonNull).collect(Collectors.toSet());
        Map<String, Customer> customers = new HashMap<>();
        for (Customer c : customerRepository.findAllById(customerIds)) {
            customers.put(c.getUserId(), c);
        }
        Map<String, Payment> payments = new HashMap<>();
        for (Payment p : paymentRepository.findAll()) {
            payments.putIfAbsent(p.getAppointmentId(), p);
        }
        return appointments.stream()
                .map(a -> toResponse(a, customers.get(a.getCustomerId()), payments.get(a.getAppointmentId())))
                .collect(Collectors.toList());
    }

    AppointmentResponse toResponse(Appointment a, Customer c, Payment p) {
        AddressDto address = null;
        if (a.getAddress() != null) {
            Address ad = a.getAddress();
            address = new AddressDto(ad.getStreetNumber(), ad.getStreetName(), ad.getSuburb(),
                    ad.getCity(), ad.getProvince(), String.valueOf(ad.getPostalCode()));
        }
        String name = c == null ? "Unknown customer" : (c.getFirstName() + " " + c.getLastName()).trim();
        return new AppointmentResponse(
                a.getAppointmentId(), a.getDateTime(), a.getServiceSelected(), address, a.getNotes(),
                a.getStatus(), a.getCustomerId(), name,
                c == null ? null : c.getEmail(), c == null ? null : c.getCellNumber(),
                p == null ? null : p.getPaymentId(), p == null ? null : p.getStatus(),
                p == null ? null : p.getMethod(), p == null ? null : p.getAmount());
    }
}
