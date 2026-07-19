package za.ac.cput.nailbeautysalon.controller;

/*
 * EmployeeControllerTest.java
 * Author: Vincent Kanzi (221188932)
 * Date: 19 July 2026
 */

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import static org.junit.jupiter.api.Assertions.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.*;

import za.ac.cput.nailbeautysalon.domain.Employee;
import za.ac.cput.nailbeautysalon.factory.EmployeeFactory;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestMethodOrder(MethodOrderer.MethodName.class)
class EmployeeControllerTest {

    @Autowired
    private TestRestTemplate restTemplate;

    private static Employee employee;

    private static final String BASE_URL = "/employee";

    @BeforeAll
    static void setUp() {

        employee = EmployeeFactory.createEmployee("202220", "Vinny", "Kanzi", "vinny@cput.ac.za", "021558963", "221188932", "Junior Fullstack");

        //assertNotNull(employee);
    }

    @Test
    void a_create() {

        String url = BASE_URL + "/create";

        ResponseEntity<Employee> response = restTemplate.postForEntity(url, employee, Employee.class);
        assertNotNull(response.getBody());

        employee = response.getBody();

        assertEquals("202220", employee.getUserId());

        System.out.println(employee);
    }

    @Test
    void b_read() {

        String url = BASE_URL + "/read/" + employee.getUserId();

        ResponseEntity<Employee> response = restTemplate.getForEntity(url, Employee.class);

        assertNotNull(response.getBody());
        assertEquals(employee.getUserId(), response.getBody().getUserId());

        System.out.println("Read: " + response.getBody());
    }

    @Test
    void c_update() {

        Employee updatedEmployee = new Employee.Builder()
                .copy(employee)
                .setEmail("vinny@gmail.com")
                .build();

        String url = BASE_URL + "/update";

        restTemplate.put(url, updatedEmployee);

        ResponseEntity<Employee> response = restTemplate.getForEntity(BASE_URL + "/read/" + employee.getUserId(), Employee.class);

        assertNotNull(response.getBody());
        assertEquals("vinny@gmail.com", response.getBody().getEmail());

        System.out.println("Updated: " + response.getBody());
    }

    @Test
    void d_delete() {

        String url = BASE_URL + "/delete/" + employee.getUserId();

        restTemplate.delete(url);

        HttpEntity<Void> request = new HttpEntity<>(new HttpHeaders());

        ResponseEntity<Employee> response = restTemplate.exchange(BASE_URL + "/read/" + employee.getUserId(), HttpMethod.POST, request, Employee.class);

        assertNull(response.getBody() == null);

        System.out.println("Employee deleted" + response);
    }

    @Test
    void e_getAll() {

        ResponseEntity<Employee[]> response = restTemplate.getForEntity(BASE_URL + "/getAll", Employee[].class);
        assertNotNull(response.getBody());

        for (Employee emp : response.getBody()) {
            System.out.println(emp);
        }
    }
}