package za.ac.cput.nailbeautysalon.controller;

/*
 * CustomerControllerTest.java
 * CustomerController Test class
 * Author: Chris Kabangu (220296693)
 * Date: 17 August 2026
 */

import org.junit.jupiter.api.*;

import static org.junit.jupiter.api.Assertions.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.*;

import za.ac.cput.nailbeautysalon.domain.Customer;
import za.ac.cput.nailbeautysalon.factory.CustomerFactory;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@org.junit.jupiter.api.Disabled("Written before JWT security was added (calls endpoints without a token). Replaced by BookingFlowIntegrationTest.")
@TestMethodOrder(MethodOrderer.MethodName.class)
class CustomerControllerTest {

    @Autowired
    private TestRestTemplate restTemplate;

    private static Customer customer;

    private static final String BASE_URL = "/customer";

    @BeforeAll
    static void setUp() {

        // NOTE: CustomerService.read()/delete() call repository.findById(),
        // and Customer's JPA @Id is userId (inherited from User), not customerId.
        // So even though the /read and /delete endpoints name their path
        // variable "customerId", they must be called with the userId value.
        customer = CustomerFactory.createCustomer("221188932", "Chris", "Kabangu", "chris@gmail.com", "0712345678", "C001");

        assertNotNull(customer);
    }

    @Test
    void a_create() {

        String url = BASE_URL + "/create";

        ResponseEntity<Customer> response = restTemplate.postForEntity(url, customer, Customer.class);
        assertNotNull(response.getBody());

        customer = response.getBody();

        assertEquals("221188932", customer.getUserId());

        System.out.println(customer);
    }

    @Test
    void b_read() {

        String url = BASE_URL + "/read/" + customer.getUserId();

        ResponseEntity<Customer> response = restTemplate.getForEntity(url, Customer.class);

        assertNotNull(response.getBody());
        assertEquals(customer.getUserId(), response.getBody().getUserId());
        assertEquals(customer.getCustomerId(), response.getBody().getCustomerId());

        System.out.println("Read: " + response.getBody());
    }

    @Test
    void c_update() {

        Customer updatedCustomer = new Customer.Builder()
                .copy(customer)
                .setCellNumber("0798765432")
                .build();

        String url = BASE_URL + "/update";

        restTemplate.put(url, updatedCustomer);

        ResponseEntity<Customer> response = restTemplate.getForEntity(BASE_URL + "/read/" + customer.getUserId(), Customer.class);

        assertNotNull(response.getBody());
        assertEquals("0798765432", response.getBody().getCellNumber());

        System.out.println("Updated: " + response.getBody());
    }

    @Test
    @Disabled
    void d_delete() {

        String url = BASE_URL + "/delete/" + customer.getUserId();

        restTemplate.delete(url);

        ResponseEntity<Customer> response = restTemplate.getForEntity(BASE_URL + "/read/" + customer.getUserId(), Customer.class);

        assertNull(response.getBody());

        System.out.println("Customer deleted: " + response);
    }

    @Test
    void e_getAll() {

        ResponseEntity<Customer[]> response = restTemplate.getForEntity(BASE_URL + "/getAll", Customer[].class);
        assertNotNull(response.getBody());

        for (Customer c : response.getBody()) {
            System.out.println(c);
        }
    }
}