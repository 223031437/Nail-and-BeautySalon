package za.ac.cput.nailbeautysalon.factory;

import za.ac.cput.nailbeautysalon.util.Helper;
import za.ac.cput.nailbeautysalon.domain.Address;

/* AddressFactory.java
Address Factory class
Author: Mbali Hlaba (223031437)
Date: 26 June 2026
*/
public class AddressFactory {
    public static Address createAddress(String streetNumber, String streetName, String city, String suburb, String province, int postalCode){
        if(Helper.isNullOrEmpty(streetNumber) || Helper.isNullOrEmpty(streetName) || Helper.isNullOrEmpty(city) || Helper.isNullOrEmpty(suburb) || Helper.isNullOrEmpty(province) || !Helper.isValidPostalCode(postalCode)){
            return null;
        }
        return new Address.Builder().setStreetName(streetName)
                .setStreetNumber(streetNumber)
                .setSuburb(suburb)
                .setCity(city)
                .setProvince(province)
                .setPostalCode(postalCode)
                .build();
    }
}
