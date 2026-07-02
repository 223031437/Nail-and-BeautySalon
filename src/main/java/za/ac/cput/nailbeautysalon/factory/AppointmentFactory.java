package za.ac.cput.nailbeautysalon.factory;

import java.time.LocalDateTime;
/* Appointment.java
AppointmentFactory class
Author: Tshephiso Kekana (240264681)
Date: 22 June 2026
*/
import za.ac.cput.nailbeautysalon.util.Helper;
import za.ac.cput.nailbeautysalon.domain.Address;
import za.ac.cput.nailbeautysalon.domain.Appointment;

public class AppointmentFactory {

    public static Appointment createAppointment(
            String appointmentId,
            LocalDateTime dateTime,
            String serviceSelected,
            Address address,
            String notes,
            String status) {

        if (Helper.isNullOrEmpty(appointmentId)
                || Helper.isNullOrEmpty(serviceSelected)
                || Helper.isNullOrEmpty(notes)
                || Helper.isNullOrEmpty(status)) {
            return null;
        }

        return new Appointment.Builder()
                .setAppointmentId(appointmentId)
                .setLocalDateTime(dateTime)
                .setServiceSelected(serviceSelected)
                .setAddress(address)
                .setNotes(notes)
                .setStatus(status)
                .build();
    }
}