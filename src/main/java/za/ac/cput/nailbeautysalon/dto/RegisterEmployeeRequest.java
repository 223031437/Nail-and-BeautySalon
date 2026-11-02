package za.ac.cput.nailbeautysalon.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterEmployeeRequest(
        @NotBlank(message = "First name is required") @Size(max = 60, message = "First name is too long") String firstName,
        @NotBlank(message = "Last name is required") @Size(max = 60, message = "Last name is too long") String lastName,
        @NotBlank(message = "Email is required") String email,
        @NotBlank(message = "Cell number is required") String cellNumber,
        @NotBlank(message = "Role is required") String employeeRole,
        @NotBlank(message = "Password is required") @Size(min = 8, max = 72, message = "Password must be 8 to 72 characters") String password) {
}
