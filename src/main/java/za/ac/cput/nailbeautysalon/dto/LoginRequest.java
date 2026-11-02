package za.ac.cput.nailbeautysalon.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "Email is required") String username,
        @NotBlank(message = "Password is required") String password) {
}
