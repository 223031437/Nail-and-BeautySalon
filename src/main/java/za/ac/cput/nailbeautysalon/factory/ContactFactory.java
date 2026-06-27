package za.ac.cput.nailbeautysalon.factory;
/* ContactFactory.java
Contact Factory class
Author: Mbali Hlaba (223031437)
Date: 26 June 2026
*/

import za.ac.cput.nailbeautysalon.Util.Helper;
import za.ac.cput.nailbeautysalon.domain.Address;
import za.ac.cput.nailbeautysalon.domain.Contact;

import java.time.LocalTime;

public class ContactFactory {
    public static Contact createContact(Address address, String phone, String email, LocalTime hours) {
        if (address == null || !Helper.isValidMobile(phone) || !Helper.isValidEmail(email) || hours == null) {
            return null;
        }

        return new Contact.Builder()
                .setAddress(address)
                .setEmail(email)
                .setHours(hours)
                .setPhone(phone)
                .build();
    }
}
