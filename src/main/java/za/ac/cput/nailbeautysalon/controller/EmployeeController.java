package za.ac.cput.nailbeautysalon.controller;
/* EmployeeController.java
EmployeeController class
Author: Vincent Kanzi(2)
Date: 14 July 2026
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.nailbeautysalon.domain.Employee;
import za.ac.cput.nailbeautysalon.exception.ApiException;
import za.ac.cput.nailbeautysalon.repository.AccountRepository;
import za.ac.cput.nailbeautysalon.service.EmployeeService;
import za.ac.cput.nailbeautysalon.util.Helper;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/employee")
public class EmployeeController {
    private final EmployeeService service;
    private final AccountRepository accountRepository;

    @Autowired
    public EmployeeController(EmployeeService service, AccountRepository accountRepository){
        this.service = service;
        this.accountRepository = accountRepository;
    }

    /** Admin only. Use POST /auth/register-employee to create an employee WITH a login. */
    @PostMapping("/create")
    public Employee create(@RequestBody Employee employee){
        validate(employee);
        return service.create(employee);
    }

    /** Admin / employee. GET is the documented method; POST is kept for the old frontend service. */
    @RequestMapping(value = "/read/{userId}", method = {RequestMethod.GET, RequestMethod.POST})
    public Employee read(@PathVariable String userId){
        Employee employee = service.read(userId);
        if (employee == null) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Employee not found.");
        }
        return employee;
    }

    /** Admin only. */
    @PutMapping("/update")
    public Employee update(@RequestBody Employee employee){
        validate(employee);
        if (service.read(employee.getUserId()) == null) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Employee not found.");
        }
        return service.update(employee);
    }

    /** Admin only. Also removes the employee's login. */
    @DeleteMapping("/delete/{userId}")
    @Transactional
    public Map<String, Object> delete(@PathVariable String userId){
        boolean deleted = service.delete(userId);
        accountRepository.findByUserId(userId).ifPresent(accountRepository::delete);
        return Map.of("deleted", deleted);
    }

    @GetMapping("/getAll")
    public List<Employee> getAll(){
        return service.getAll();
    }

    private void validate(Employee e) {
        if (e == null || Helper.isNullOrEmpty(e.getUserId()) || Helper.isNullOrEmpty(e.getFirstName())
                || Helper.isNullOrEmpty(e.getLastName()) || !Helper.isValidEmail(e.getEmail())
                || !Helper.isValidPhone(e.getCellNumber()) || Helper.isNullOrEmpty(e.getRole())) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                    "Employee id, first name, last name, a valid email, a valid cell number and a role are required.");
        }
    }
}
