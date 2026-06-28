package za.ac.cput.nailbeautysalon.factory;

/* CustomerFactoryTest.java
   Customer Factory Test class
   Author: Chris Kabangu
   Student Number: 220296693
   Date: 28 June 2026
*/

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import za.ac.cput.nailbeautysalon.domain.Customer;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.MethodName.class)
class CustomerFactoryTest {

    @Test
    void a_createCustomer() {
        Customer customer = CustomerFactory.createCustomer(
                "221188932",
                "Chris",
                "Kabangu",
                "chris@gmail.com",
                "0712345678",
                "C001"
        );

        Assertions.assertNotNull(customer);
        System.out.println(customer);
    }

    @Test
    void b_createCustomerThatFails() {
        Customer customer = CustomerFactory.createCustomer(
                "221188932",
                "Chris",
                "Kabangu",
                "chrisgmail.com",
                "12345",
                ""
        );

        Assertions.assertNull(customer);
        System.out.println(customer);
    }
}