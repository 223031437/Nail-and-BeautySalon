package za.ac.cput.nailbeautysalon.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import za.ac.cput.nailbeautysalon.domain.Subject;

public record InquiryRequest(
        @NotBlank(message = "Name is required") @Size(max = 100, message = "Name is too long") String fullName,
        @NotBlank(message = "Email is required") @Size(max = 150, message = "Email is too long") String email,
        @NotBlank(message = "Phone number is required") String phoneNumber,
        @NotNull(message = "Please choose a subject") Subject subject,
        @NotBlank(message = "Message is required") @Size(max = 2000, message = "Message is too long (maximum 2000 characters)") String message) {
}
