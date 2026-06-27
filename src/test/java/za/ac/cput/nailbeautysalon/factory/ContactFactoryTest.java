package za.ac.cput.nailbeautysalon.factory;

import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import za.ac.cput.nailbeautysalon.domain.Address;
import za.ac.cput.nailbeautysalon.domain.Contact;

import java.time.LocalTime;

import static org.junit.jupiter.api.Assertions.*;
@TestMethodOrder(MethodOrderer.MethodName.class)
class ContactFactoryTest {

    private Address getValidAddress() {
        return AddressFactory.createAddress("10", "Main Street", "Cape Town", "Gardens", "Western Cape", 8001);
    }

    @Test
    void B_createContact() {
        Contact contact = ContactFactory.createContact(getValidAddress(), "0712345678", "test@example.com", LocalTime.of(8, 30));
        assertNotNull(contact);
        System.out.println(contact);
    }

    @Test
    void testCreateContact_InvalidPhoneNumber() {
        Contact contact = ContactFactory.createContact(getValidAddress(), "12345", "mbalihlabao67@gmail.com", LocalTime.of(8, 30) );
        assertNull(contact);
        System.out.println(contact);
    }
}