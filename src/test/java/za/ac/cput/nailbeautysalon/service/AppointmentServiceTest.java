package za.ac.cput.nailbeautysalon.service;
/* Appointment.java
Appointment model class
Author: Tshephiso Kekana (240264681)
Date: 05 July 2026
*/
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import za.ac.cput.nailbeautysalon.domain.Address;
import za.ac.cput.nailbeautysalon.domain.Appointment;
import za.ac.cput.nailbeautysalon.factory.AppointmentFactory;

import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.*;



@SpringBootTest
@TestMethodOrder(MethodOrderer.MethodName.class)
class AppointmentServiceTest {

    @Autowired
    private AppointmentService service;


    Address address = new Address.Builder()
                .setStreetNumber("12")
                .setStreetName("Main Road")
                .setSuburb("Sea Point")
                .setCity("Cape Town")
                .setProvince("Western Cape")
                .setPostalCode(8001)
                .build();

    private Appointment appointment = AppointmentFactory.createAppointment(
            "A001",LocalDateTime.now(),"Gel Nails",address,"French Tips","Booked");


@Test
void a_create() {
    Appointment created = service.create(appointment);
    assertNotNull(created);
    System.out.println(created);
}

@Test
void b_read() {
    Appointment read = service.read(appointment.getAppointmentId());
    assertNotNull(read);
    System.out.println(read);
}

@Test
void c_update() {
    Appointment newAppointment = new Appointment.Builder().copy(appointment).setAppointmentId("A003").build();
    Appointment update = service.update(newAppointment);
    assertNotNull(update);
    System.out.println(update);
}

@Test
@Disabled
void d_delete() {
    String appointmentId = appointment.getAppointmentId();
    boolean delete = service.delete(appointmentId);
    assertTrue(delete);
    System.out.println("Deletion status: " + delete);
}

@Test
void e_getAll() {
    System.out.println(service.getAll());
}
}
