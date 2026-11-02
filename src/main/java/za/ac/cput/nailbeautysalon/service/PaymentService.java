package za.ac.cput.nailbeautysalon.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import za.ac.cput.nailbeautysalon.domain.Appointment;
import za.ac.cput.nailbeautysalon.domain.Customer;
import za.ac.cput.nailbeautysalon.domain.Payment;
import za.ac.cput.nailbeautysalon.dto.PaymentResponse;
import za.ac.cput.nailbeautysalon.exception.ApiException;
import za.ac.cput.nailbeautysalon.repository.AppointmentRepository;
import za.ac.cput.nailbeautysalon.repository.CustomerRepository;
import za.ac.cput.nailbeautysalon.repository.PaymentRepository;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private static final Set<String> STATUSES = Set.of(
            Payment.PENDING, Payment.PAID, Payment.CANCELLED, Payment.REFUNDED, Payment.REFUND_DUE);

    private final PaymentRepository paymentRepository;
    private final AppointmentRepository appointmentRepository;
    private final CustomerRepository customerRepository;

    @Autowired
    public PaymentService(PaymentRepository paymentRepository,
                          AppointmentRepository appointmentRepository,
                          CustomerRepository customerRepository) {
        this.paymentRepository = paymentRepository;
        this.appointmentRepository = appointmentRepository;
        this.customerRepository = customerRepository;
    }

    public List<PaymentResponse> getAll() {
        List<Payment> payments = paymentRepository.findAll();

        Map<String, Appointment> appointments = new HashMap<>();
        for (Appointment a : appointmentRepository.findAllById(
                payments.stream().map(Payment::getAppointmentId).collect(Collectors.toSet()))) {
            appointments.put(a.getAppointmentId(), a);
        }
        Map<String, Customer> customers = new HashMap<>();
        for (Customer c : customerRepository.findAllById(
                payments.stream().map(Payment::getCustomerId).filter(Objects::nonNull).collect(Collectors.toSet()))) {
            customers.put(c.getUserId(), c);
        }

        return payments.stream()
                .sorted(Comparator.comparing(Payment::getCreatedAt, Comparator.nullsLast(Comparator.<LocalDateTime>reverseOrder())))
                .map(p -> toResponse(p, appointments.get(p.getAppointmentId()), customers.get(p.getCustomerId())))
                .collect(Collectors.toList());
    }

    public PaymentResponse updateStatus(String paymentId, String status) {
        if (status == null || !STATUSES.contains(status)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Payment status must be one of: " + String.join(", ", new TreeSet<>(STATUSES)));
        }
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Payment not found."));
        payment.setStatus(status);
        payment.setPaidAt(Payment.PAID.equals(status) ? LocalDateTime.now() : null);
        paymentRepository.save(payment);

        return toResponse(payment,
                appointmentRepository.findById(payment.getAppointmentId()).orElse(null),
                payment.getCustomerId() == null ? null : customerRepository.findById(payment.getCustomerId()).orElse(null));
    }

    private PaymentResponse toResponse(Payment p, Appointment a, Customer c) {
        return new PaymentResponse(
                p.getPaymentId(), p.getAppointmentId(),
                c == null ? "Unknown customer" : (c.getFirstName() + " " + c.getLastName()).trim(),
                c == null ? null : c.getEmail(),
                a == null ? null : a.getServiceSelected(),
                a == null ? null : a.getDateTime(),
                a == null ? null : a.getStatus(),
                p.getAmount(), p.getMethod(), p.getStatus(), p.getCreatedAt(), p.getPaidAt());
    }
}
