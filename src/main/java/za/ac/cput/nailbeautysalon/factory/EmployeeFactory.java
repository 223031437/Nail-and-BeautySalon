package za.ac.cput.nailbeautysalon.factory;
/* EmployeeFactory.java
Employee Factory class
Author: Vincent Kanzi(221188932)
Date: 25 June 2026
*/

import za.ac.cput.nailbeautysalon.util.Helper;
import za.ac.cput.nailbeautysalon.domain.Employee;

public class EmployeeFactory {
    public static Employee createEmployee(String userId, String firstName, String lastName, String email, String cellNumber, String employeeId, String role){
        if(Helper.isNullOrEmpty(userId) || Helper.isNullOrEmpty(firstName) || Helper.isNullOrEmpty(lastName) || Helper.isNullOrEmpty(cellNumber)
        || Helper.isNullOrEmpty(employeeId) || Helper.isNullOrEmpty(role))
            return null;

        if(!Helper.isValidEmail(email)){
            return null;
        }

        return new Employee.Builder()
                .setUserId(userId)
                .setFirstName(firstName)
                .setLastName(lastName)
                .setEmail(email)
                .setCellNumber(cellNumber)
                .setEmployeeId(employeeId)
                .setRole(role)
                .build();
    }
}
