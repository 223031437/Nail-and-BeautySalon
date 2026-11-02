package za.ac.cput.nailbeautysalon.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record RescheduleRequest(@NotNull(message = "Please select a new date and time") LocalDateTime dateTime) {
}
