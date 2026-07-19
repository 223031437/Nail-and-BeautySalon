package za.ac.cput.nailbeautysalon.controller;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import za.ac.cput.nailbeautysalon.domain.Inquiry;
import za.ac.cput.nailbeautysalon.factory.InquiryFactory;
import za.ac.cput.nailbeautysalon.service.ContactService;

import static org.junit.jupiter.api.Assertions.*;
import static za.ac.cput.nailbeautysalon.domain.Subject.Technical_Support;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestMethodOrder(MethodOrderer.MethodName.class)
class InquiryControllerTest {

    @Autowired
    private TestRestTemplate restTemplate;
    @Autowired
    private ContactService service;

    private static Inquiry inquiry;
    private static String email;

    private static final String BASE_URL = "http://localhost:8080/nail-beautysalon/inquiry";

    @BeforeAll
    static void setUp() {
        inquiry = InquiryFactory.createInquiry("mbalihlaba067@gmail.com", "Mbali Hlaba", "0677390691", Technical_Support, "I'm having issues with this application. the like button is not doing what its supposed to do.");
        System.out.println(inquiry);
    }

    @Test
    void a_create() {
            ResponseEntity<Inquiry> response = restTemplate.postForEntity(BASE_URL + "/create", inquiry, Inquiry.class);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        email = response.getBody().getEmail();
        assertNotNull(email);
        System.out.println("Created: " + response.getBody());
    }

    @Test
    void b_read() {
            ResponseEntity<Inquiry> response = restTemplate.getForEntity(BASE_URL + "/read/" + email, Inquiry.class);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        System.out.println("Read: " + response.getBody());
    }

    @Test
    void c_delete() {
        ResponseEntity<Void> deleteResponse = restTemplate.exchange(BASE_URL + "/delete/" + email, HttpMethod.DELETE, null, Void.class);
        assertEquals(HttpStatus.NO_CONTENT, deleteResponse.getStatusCode());
        ResponseEntity<Inquiry> response = restTemplate.getForEntity(BASE_URL + "/read/" + email, Inquiry.class);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        System.out.println("Deleted product with ID: " + email);
    }
}
