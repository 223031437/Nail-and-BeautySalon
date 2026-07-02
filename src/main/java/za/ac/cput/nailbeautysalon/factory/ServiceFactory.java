package za.ac.cput.nailbeautysalon.factory;

import za.ac.cput.nailbeautysalon.util.Helper;
import za.ac.cput.nailbeautysalon.domain.Service;

import static za.ac.cput.nailbeautysalon.util.Helper.isNullOrEmpty;

/**
 * author: Nandipha Galada
 * student number: 221225366
 * date: 23 June 2026
 * Creates Service objects
 */

public class ServiceFactory {

    public static Service createService(String serviceId, String serviceName, String category, String description, double price) {

        if (Helper.isNullOrEmpty(serviceId) || isNullOrEmpty(serviceName) || isNullOrEmpty(category) || isNullOrEmpty(description) || price <= 0) {
            return null;
        }

        return new Service.Builder().setServiceId(serviceId).setServiceName(serviceName).setCategory(category).setDescription(description).setPrice(price).build();
    }
}
