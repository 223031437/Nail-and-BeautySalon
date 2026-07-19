package za.ac.cput.nailbeautysalon.controller;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.ResponseEntity;
import za.ac.cput.nailbeautysalon.domain.Address;
import za.ac.cput.nailbeautysalon.domain.Contact;
import za.ac.cput.nailbeautysalon.factory.AddressFactory;
import za.ac.cput.nailbeautysalon.factory.ContactFactory;
import za.ac.cput.nailbeautysalon.service.ContactService;

import java.time.LocalTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestMethodOrder(MethodOrderer.MethodName.class)
class ContactControllerTest {

    @Autowired
    private TestRestTemplate restTemplate;
    @Autowired
    private ContactService service;

    static Contact contact1;
    static Contact contact2;

    private static final String base_url = "http://localhost:8080/nail-beautysalon/contact";

    @BeforeAll
    static void setUp() {
        Address address1 = AddressFactory.createAddress("10", "Main Road", "Bellville", "Cape Town", "Western Cape", 7530
        );

        Address address2 = AddressFactory.createAddress("20", "Long Street", "CBD", "Cape Town", "Western Cape", 8000
        );

        contact1 = ContactFactory.createContact(address1, "0821234567", "info@beauty.co.za", LocalTime.of(8, 0)
        );

        contact2 = ContactFactory.createContact(address2, "0839876543", "info@beauty.co.za", LocalTime.of(9, 30)
        );

    }

    @Test
    void create() {
        String url = base_url + "/create";
        ResponseEntity<Contact> postResponse = restTemplate.postForEntity(url, contact1, Contact.class);
        assertNotNull(postResponse);
        assertNotNull(postResponse.getBody());
        System.out.println(postResponse.getBody());

    }

    @Test
    void read() {
        String url = base_url + "/read" + "/" + contact1.getAddress();
        ResponseEntity<Contact> postResponse = restTemplate.getForEntity(url, Contact.class);
        assertNotNull(postResponse);
        assertNotNull(postResponse.getBody());
        System.out.println(postResponse.getBody());
    }

    @Test
    void update() {
        String url = base_url + "/update";
        Contact updatedEmployee = new Contact.Builder().copy(contact2)
                .setHours(LocalTime.of(17, 0))
                .build();

        ResponseEntity<Contact> postResponse = restTemplate.postForEntity(url, updatedEmployee, Contact.class);
        assertNotNull(postResponse);
        assertNotNull(postResponse.getBody());
        System.out.println(postResponse.getBody());
    }

    @Test
    void delete() {
        String url = base_url + "/delete" + contact1.getAddress();
        restTemplate.delete(url);
    }
}