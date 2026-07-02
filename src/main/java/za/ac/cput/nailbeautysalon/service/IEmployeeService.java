package za.ac.cput.nailbeautysalon.service;
/* IEmployeeService.java
IEmployeeService class
Author: Vincent Kanzi(221188932)
Date: 02 July 2026
*/
import za.ac.cput.nailbeautysalon.domain.Employee;

import java.util.List;

public interface IEmployeeService <T, ID>{
    T create(T t);
    T read(ID id);
    T update(T t);
    boolean delete(ID id);
    List<Employee> getAll();
}
