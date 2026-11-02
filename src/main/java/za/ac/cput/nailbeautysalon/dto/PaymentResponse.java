package za.ac.cput.nailbeautysalon.dto;

import java.time.LocalDateTime;

public record PaymentResponse(
        String paymentId,
        String appointmentId,
        String customerName,
        String customerEmail,
        String serviceSelected,
        LocalDateTime appointmentDateTime,
        String appointmentStatus,
        double amount,
        String method,
        String status,
        LocalDateTime createdAt,
        LocalDateTime paidAt) {
}
