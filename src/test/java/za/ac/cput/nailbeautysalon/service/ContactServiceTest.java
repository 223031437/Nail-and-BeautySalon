package za.ac.cput.nailbeautysalon.service;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import za.ac.cput.nailbeautysalon.domain.Address;
import za.ac.cput.nailbeautysalon.domain.Contact;
import za.ac.cput.nailbeautysalon.factory.ContactFactory;

import java.time.LocalTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestMethodOrder(MethodOrderer.MethodName.class)
class ContactServiceTest {

    @Autowired
    private ContactService service;

    private Address address = new Address.Builder()
            .setStreetNumber("12")
            .setStreetName("Long Street")
            .setCity("Cape Town")
            .setSuburb("Foreshore")
            .setProvince("Western Cape")
            .setPostalCode(8001)
            .build();

    private Contact contact = ContactFactory.createContact(
            address,
            "0821234567",
            "salon@gmail.com",
            LocalTime.of(8, 0)
    );

    private static Long createdId;

    @Test
    void a_create() {
        Contact created = service.create(contact);
        assertNotNull(created);
        createdId = created.getContactId();
        System.out.println(created);
    }

    @Test
    void b_read() {
        Contact read = service.read(createdId);
        assertNotNull(read);
        System.out.println(read);
    }

    @Test
    void c_update() {

        Contact updatedContact = new Contact.Builder()
                .copy(contact)
                .setContactId(createdId)
                .setPhone("0839876543")
                .build();

        Contact updated = service.update(updatedContact);

        assertNotNull(updated);
        assertEquals("0839876543", updated.getPhone());
        System.out.println(updated);
    }

    @Test
    @Disabled
    void d_delete() {
        boolean deleted = service.delete(createdId);

        assertTrue(deleted);
        System.out.println("Deleted: " + deleted);
    }

    @Test
    void e_getAll() {
        List<Contact> contacts = service.getAll();
        assertNotNull(contacts);
        System.out.println(contacts);
    }

    @Test
    void f_findContactByAddressProvinceIn() {
        List<Contact> contacts =
                service.findContactByAddressProvinceIn(
                        List.of("Western Cape"));

        assertNotNull(contacts);
        System.out.println(contacts);
    }
}