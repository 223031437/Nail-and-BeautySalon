package za.ac.cput.nailbeautysalon.dto;

import java.time.LocalDateTime;

/** One bookable time of a day and whether it is still free. */
public record SlotResponse(LocalDateTime dateTime, String time, boolean available) {
}
