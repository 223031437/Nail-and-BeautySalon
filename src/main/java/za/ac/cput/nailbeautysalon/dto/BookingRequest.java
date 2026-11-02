package za.ac.cput.nailbeautysalon.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record BookingRequest(
        @NotNull(message = "Please select a date and time") LocalDateTime dateTime,
        @NotBlank(message = "Please select a service") String serviceSelected,
        @NotNull(message = "Address is required") @Valid AddressDto address,
        @Size(max = 1000, message = "Notes are too long (maximum 1000 characters)") String notes,
        @NotBlank(message = "Please select a payment method") String paymentMethod) {
}
