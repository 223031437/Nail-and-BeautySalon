package za.ac.cput.nailbeautysalon.factory;

/* CustomerFactory.java
   Author: Chris Kabangu
   Student Number: 220296693
   Date: 28 June 2026
*/

import za.ac.cput.nailbeautysalon.util.Helper;
import za.ac.cput.nailbeautysalon.domain.Customer;

public class CustomerFactory {

    public static Customer createCustomer(String userId,
                                          String firstName,
                                          String lastName,
                                          String email,
                                          String cellNumber,
                                          String customerId) {

        if (Helper.isNullOrEmpty(userId) ||
                Helper.isNullOrEmpty(firstName) ||
                Helper.isNullOrEmpty(lastName) ||
                Helper.isNullOrEmpty(cellNumber) ||
                Helper.isNullOrEmpty(customerId)) {
            return null;
        }

        if (!Helper.isValidEmail(email)) {
            return null;
        }

        return new Customer.Builder()
                .setUserId(userId)
                .setFirstName(firstName)
                .setLastName(lastName)
                .setEmail(email)
                .setCellNumber(cellNumber)
                .setCustomerId(customerId)
                .build();
    }
}