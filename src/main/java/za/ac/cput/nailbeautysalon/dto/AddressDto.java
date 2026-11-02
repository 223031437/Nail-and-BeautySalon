package za.ac.cput.nailbeautysalon.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AddressDto(
        @NotBlank(message = "Street number is required") @Size(max = 20, message = "Street number is too long") String streetNumber,
        @NotBlank(message = "Street name is required") @Size(max = 100, message = "Street name is too long") String streetName,
        @NotBlank(message = "Suburb is required") @Size(max = 80, message = "Suburb is too long") String suburb,
        @NotBlank(message = "City is required") @Size(max = 80, message = "City is too long") String city,
        @NotBlank(message = "Province is required") @Size(max = 60, message = "Province is too long") String province,
        @NotBlank(message = "Postal code is required") @Pattern(regexp = "\\d{4}", message = "Postal code must be 4 digits") String postalCode) {
}
