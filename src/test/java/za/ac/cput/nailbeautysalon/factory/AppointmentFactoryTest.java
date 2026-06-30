package za.ac.cput.nailbeautysalon.factory;

import org.junit.jupiter.api.Test;
import za.ac.cput.nailbeautysalon.domain.Address;
import za.ac.cput.nailbeautysalon.domain.Appointment;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class AppointmentFactoryTest {

    @Test
    void createAppointment() {

        // Create an Address object
        Address address = new Address.Builder()
                .setStreetNumber("12")
                .setStreetName("Main Road")
                .setCity("Cape Town")
                .setPostalCode(8001)
                .build();

        Appointment appointment = AppointmentFactory.createAppointment(
                "A001",
                LocalDateTime.now(),
                "Gel Nails",
                address,
                "Customer prefers pink polish.",
                "Booked"
        );

        assertNotNull(appointment);
        assertEquals("A001", appointment.getAppointmentId());
        assertEquals("Gel Nails", appointment.getServiceSelected());
        assertEquals("Booked", appointment.getStatus());
        assertEquals(address, appointment.getAddress());
    }

    @Test
    void createAppointmentWithNullId() {

        Address address = new Address.Builder()
                .setStreetNumber("12")
                .setStreetName("Main Road")
                .setCity("Cape Town")
                .setPostalCode(8001)
                .build();

        Appointment appointment = AppointmentFactory.createAppointment(
                null,
                LocalDateTime.now(),
                "Gel Nails",
                address,
                "Customer prefers pink polish.",
                "Booked"
        );

        assertNull(appointment);
    }

    @Test
    void createAppointmentWithEmptyService() {

        Address address = new Address.Builder()
                .setStreetNumber("12")
                .setStreetName("Main Road")
                .setCity("Cape Town")
                .setPostalCode(8001)
                .build();

        Appointment appointment = AppointmentFactory.createAppointment(
                "A001",
                LocalDateTime.now(),
                "",
                address,
                "Customer prefers pink polish.",
                "Booked"
        );

        assertNull(appointment);
    }
}