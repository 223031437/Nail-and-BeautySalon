package za.ac.cput.nailbeautysalon.util;
/* Helper.java
Helper class
Author: Vincent Kanzi(221188932)
Date: 25 June 2026
*/

import org.apache.commons.validator.routines.EmailValidator;

import java.util.regex.Pattern;

public class Helper {
    public static boolean isNullOrEmpty(String str){
        if ((str == null) || (str.isEmpty())){
            return true;
        }
        return false;
    }

    public static boolean isValidEmail(String email) {
        EmailValidator validator = EmailValidator.getInstance();
        return validator.isValid(email);
    }

    public static boolean isNumeric(int in){
        if(in < 0){
            return true;
        }
        return false;
    }

    public static boolean isValidPostalCode(int code){
        if(code < 1000 || code > 9999) {
            return true;
        }
        return false;
    }

    public static boolean isValidMobile(String cell) {
        Pattern MOBILE_PATTERN = Pattern.compile("^(\\+27|0)?[6-8][0-9]{8}$");
        if (cell == null || cell.isEmpty()) {
            return false;
        }
        return MOBILE_PATTERN.matcher(cell).matches();
    }

    /** Lenient phone check used by the website forms: 9-15 digits, optional leading +, spaces/dashes/brackets allowed. */
    public static boolean isValidPhone(String phone) {
        if (phone == null) {
            return false;
        }
        String cleaned = phone.replaceAll("[\\s\\-()]", "");
        return cleaned.matches("^\\+?[0-9]{9,15}$");
    }

    public static boolean validateId(Long id) {
        return id != null && id > 0;
    }

}
