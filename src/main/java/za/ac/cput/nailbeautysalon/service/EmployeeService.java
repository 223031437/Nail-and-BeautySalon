package za.ac.cput.nailbeautysalon.service;
/* EmployeeService.java
Employee Service class
Author: Vincent Kanzi(221188932)
Date: 02 July 2026
*/
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.nailbeautysalon.domain.Employee;
import za.ac.cput.nailbeautysalon.repository.EmployeeRepository;

import java.util.List;

@Service
public class EmployeeService implements IEmployeeService<Employee, String> {
    private EmployeeRepository repository;

    @Autowired
    EmployeeService(EmployeeRepository repository){
        this.repository = repository;
    }

    @Override
    public Employee create(Employee employee){
        return this.repository.save(employee);
    }

    @Override
    public Employee read(String userId) {
        return this.repository.findById(userId).orElse(null);
    }

    @Override
    public Employee update(Employee employee) {

        return this.repository.save(employee);
    }

    @Override
    public boolean delete(String userId) {
        this.repository.deleteById(userId);
        return true;
    }

    @Override
    public List<Employee> getAll() {
        return this.repository.findAll();
    }

}
