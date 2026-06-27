package za.ac.cput.nailbeautysalon.factory;

import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import za.ac.cput.nailbeautysalon.domain.Address;
import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.MethodName.class)
class AddressFactoryTest {

    @Test
    void A_createAddress() {
        Address address = AddressFactory.createAddress("10", "Main Street", "Cape Town", "Gardens", "Western Cape", 8001);
        assertNotNull(address);
        System.out.println(address);
    }

    @Test
    void B_testCreateAddress_Invalid() {
        Address address = AddressFactory.createAddress("10", "Main Street", "Cape Town", "Gardens", "Western Cape", 10000);
        assertNull(address);
        System.out.println(address);
    }
}