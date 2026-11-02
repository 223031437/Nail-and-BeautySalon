package za.ac.cput.nailbeautysalon.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CustomerUpdateRequest(
        @NotBlank(message = "First name is required") @Size(max = 60, message = "First name is too long") String firstName,
        @NotBlank(message = "Last name is required") @Size(max = 60, message = "Last name is too long") String lastName,
        @NotBlank(message = "Cell number is required") String cellNumber) {
}
