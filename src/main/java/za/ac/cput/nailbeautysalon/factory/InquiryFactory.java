package za.ac.cput.nailbeautysalon.factory;
/* InquiryFactory.java
Inquiry Factory class
Author: Mbali Hlaba (223031437)
Date: 26 June 2026
*/

import za.ac.cput.nailbeautysalon.util.Helper;
import za.ac.cput.nailbeautysalon.domain.Inquiry;
import za.ac.cput.nailbeautysalon.domain.Subject;

public class InquiryFactory {
    public static Inquiry createInquiry(String email, String fullName, String phoneNumber, Subject subject, String message) {
        if (!Helper.isValidEmail(email) || Helper.isNullOrEmpty(fullName) || !Helper.isValidMobile(phoneNumber) || Helper.isNullOrEmpty(message) || subject == null) {
            return null;
        }
        return new Inquiry.Builder()
                .setEmail(email)
                .setFullName(fullName)
                .setPhoneNumber(phoneNumber)
                .setSubject(subject)
                .setMessage(message)
                .build();
    }
}