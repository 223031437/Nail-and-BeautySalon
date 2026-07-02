package za.ac.cput.nailbeautysalon.service;
/* EmployeeServiceTest.java
Employee Service Test class
Author: Vincent Kanzi(221188932)
Date: 02 July 2026
*/
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import za.ac.cput.nailbeautysalon.domain.Employee;
import za.ac.cput.nailbeautysalon.factory.EmployeeFactory;

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest
@TestMethodOrder(MethodOrderer.MethodName.class)
class EmployeeServiceTest {
    @Autowired
    private EmployeeService service;

    private Employee employee = EmployeeFactory.createEmployee("221188932", "Vee", "Kanzi", "vee@mycput.ac.za", "021556894", "2258", "Developer");

    @Test
    void a_create() {
        Employee created = service.create(employee);
        assertNotNull(created);
        System.out.println(created);
    }

    @Test
    void b_read() {
        Employee read = service.read(employee.getUserId());
        assertNotNull(read);
        System.out.println(read);
    }

    @Test
    void c_update() {
        Employee newEmployee = new Employee.Builder().copy(employee).setRole("Software Engineer").build();
        Employee update = service.update(newEmployee);
        assertNotNull(update);
        System.out.println(update);
    }

    @Test
    @Disabled
    void d_delete() {
        String userId = employee.getUserId();
        boolean delete = service.delete(userId);
        assertTrue(delete);
        System.out.println("Deletion status: " + delete);
    }

    @Test
    void e_getAll() {
        System.out.println(service.getAll());
    }
}