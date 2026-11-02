package za.ac.cput.nailbeautysalon.dto;

import java.time.LocalDateTime;

/** A booking together with the customer and payment details the dashboards need. */
public record AppointmentResponse(
        String appointmentId,
        LocalDateTime dateTime,
        String serviceSelected,
        AddressDto address,
        String notes,
        String status,
        String customerId,
        String customerName,
        String customerEmail,
        String customerCell,
        String paymentId,
        String paymentStatus,
        String paymentMethod,
        Double amount) {
}
