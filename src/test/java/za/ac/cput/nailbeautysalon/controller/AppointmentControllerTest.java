package za.ac.cput.nailbeautysalon.controller;
/* Appointment.java
Appointment model class
Author: Tshephiso Kekana (240264681)
Date: 25 July 2026
*/

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import za.ac.cput.nailbeautysalon.domain.Address;
import za.ac.cput.nailbeautysalon.domain.Appointment;
import za.ac.cput.nailbeautysalon.factory.AppointmentFactory;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@org.junit.jupiter.api.Disabled("Written before JWT security was added (calls endpoints without a token). Replaced by BookingFlowIntegrationTest.")
@TestMethodOrder(MethodOrderer.MethodName.class)
class AppointmentControllerTest {

    @Autowired
    private TestRestTemplate restTemplate;

    private static Appointment appointment;

    private static final String BASE_URL = "/appointment";

    @BeforeAll
    static void setUp() {
        Address address = new Address.Builder()
                .setStreetNumber("12")
                .setStreetName("Main Road")
                .setCity("Cape Town")
                .setPostalCode(8001)
                .build();

        appointment = AppointmentFactory.createAppointment(
                "A006", LocalDateTime.now(),"Massage", address, "full body massage","Booked");
    }

    @Test
    void create() {
        String url = BASE_URL + "/create";

        ResponseEntity<Appointment> response = restTemplate.postForEntity(url, appointment, Appointment.class);
        assertNotNull(response.getBody());

        appointment = response.getBody();

        assertEquals("A006",appointment .getAppointmentId());

        System.out.println(appointment);
    }

    @Test
    void read() {
        String url = BASE_URL + "/read/" + appointment.getAppointmentId();

        ResponseEntity<Appointment> response = restTemplate.getForEntity(url, Appointment.class);

        assertNotNull(response.getBody());
        assertEquals(appointment.getAppointmentId(), response.getBody().getAppointmentId());

        System.out.println("Read: " + response.getBody());

    }

    @Test
    void update() {
        Appointment updatedAppoinment= new Appointment.Builder()
                .copy(appointment)
                .setNotes("Foot massage")
                .build();

        String url = BASE_URL + "/update";

        restTemplate.put(url, updatedAppoinment);

        ResponseEntity<Appointment> response = restTemplate.getForEntity(BASE_URL + "/read/" + appointment.getAppointmentId(), Appointment.class);

        assertNotNull(response.getBody());
        assertEquals("Foot massage", response.getBody().getNotes());

        System.out.println("Updated: " + response.getBody());

    }

    @Test
    @Disabled
    void delete() {
        String url = BASE_URL + "/delete/" + appointment.getAppointmentId();

        restTemplate.delete(url);

        HttpEntity<Void> request = new HttpEntity<>(new HttpHeaders());

        ResponseEntity<Appointment> response = restTemplate.exchange(BASE_URL + "/read/" + appointment.getAppointmentId(), HttpMethod.POST, request, Appointment.class);

        assertNull(response.getBody() == null);

        System.out.println("Appointment deleted" + response);
    }

    @Test
    void getAll() {
        ResponseEntity<Appointment[]> response = restTemplate.getForEntity(BASE_URL + "/getAll", Appointment[].class);
        assertNotNull(response.getBody());

        for (Appointment appointment1 : response.getBody()) {
            System.out.println(appointment1);
        }
    }
}