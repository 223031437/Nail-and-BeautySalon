package za.ac.cput.nailbeautysalon.Util;
/* Helper.java
Helper class
Author: Vincent Kanzi(221188932)
Date: 25 June 2026
*/

import org.apache.commons.validator.routines.EmailValidator;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
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
            return false;
        }
        return true;
    }

    public static boolean isValidMobile(String cell) {
        Pattern MOBILE_PATTERN = Pattern.compile("^(\\+27|0)?[6-8][0-9]{8}$");
        if (cell == null || cell.isEmpty()) {
            return false;
        }
        return MOBILE_PATTERN.matcher(cell).matches();
    }

}
