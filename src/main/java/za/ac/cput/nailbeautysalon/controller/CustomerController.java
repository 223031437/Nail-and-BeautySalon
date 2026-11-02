package za.ac.cput.nailbeautysalon.controller;
/*
Customer Controller class
220296693
Date: 20 July 2026
*/
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.nailbeautysalon.domain.Account;
import za.ac.cput.nailbeautysalon.domain.Customer;
import za.ac.cput.nailbeautysalon.domain.Role;
import za.ac.cput.nailbeautysalon.exception.ApiException;
import za.ac.cput.nailbeautysalon.repository.AccountRepository;
import za.ac.cput.nailbeautysalon.service.CustomerService;
import za.ac.cput.nailbeautysalon.util.Helper;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/customer")
public class CustomerController {

    private final CustomerService service;
    private final AccountRepository accountRepository;

    @Autowired
    public CustomerController(CustomerService service, AccountRepository accountRepository){
        this.service = service;
        this.accountRepository = accountRepository;
    }

    /** Admin / employee only. Customers register themselves through POST /auth/register-customer. */
    @PostMapping("/create")
    public Customer create(@RequestBody Customer customer){
        if (customer == null || Helper.isNullOrEmpty(customer.getUserId()) || Helper.isNullOrEmpty(customer.getFirstName())
                || Helper.isNullOrEmpty(customer.getLastName()) || !Helper.isValidEmail(customer.getEmail())
                || !Helper.isValidPhone(customer.getCellNumber())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Customer id, first name, last name, a valid email and a valid cell number are required.");
        }
        return service.create(customer);
    }

    @RequestMapping(value = "/read/{customerId}", method = {RequestMethod.GET, RequestMethod.POST})
    public Customer read(@PathVariable String customerId, Authentication authentication){
        checkSelfOrStaff(authentication, customerId);
        Customer customer = service.read(customerId);
        if (customer == null) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Customer not found.");
        }
        return customer;
    }

    /** A customer can update their own profile (name and cell number); the email is their login and stays fixed. */
    @PutMapping("/update")
    public Customer update(@RequestBody Customer customer, Authentication authentication){
        if (customer == null || Helper.isNullOrEmpty(customer.getUserId())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Customer id is required.");
        }
        checkSelfOrStaff(authentication, customer.getUserId());

        Customer existing = service.read(customer.getUserId());
        if (existing == null) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Customer not found.");
        }
        if (Helper.isNullOrEmpty(customer.getFirstName() == null ? null : customer.getFirstName().trim())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "First name is required.");
        }
        if (Helper.isNullOrEmpty(customer.getLastName() == null ? null : customer.getLastName().trim())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Last name is required.");
        }
        if (!Helper.isValidPhone(customer.getCellNumber())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Please enter a valid cell number (9 to 15 digits).");
        }
        Customer updated = new Customer.Builder().copy(existing)
                .setFirstName(customer.getFirstName().trim())
                .setLastName(customer.getLastName().trim())
                .setCellNumber(customer.getCellNumber().trim())
                .build();
        return service.update(updated);
    }

    /** Deletes the customer AND their login so the account cannot be used again. */
    @DeleteMapping("/delete/{customerId}")
    @Transactional
    public Map<String, Object> delete(@PathVariable String customerId, Authentication authentication){
        checkSelfOrStaff(authentication, customerId);
        boolean deleted = service.delete(customerId);
        accountRepository.findByUserId(customerId).ifPresent(accountRepository::delete);
        return Map.of("deleted", deleted);
    }

    /** Admin / employee only. */
    @GetMapping("/getAll")
    public List<Customer> getAll(){
        return service.getAll();
    }

    private void checkSelfOrStaff(Authentication authentication, String customerId) {
        Account account = (Account) authentication.getPrincipal();
        boolean staff = account.getRole() == Role.ROLE_ADMIN || account.getRole() == Role.ROLE_EMPLOYEE;
        if (!staff && !customerId.equals(account.getUserId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You can only access your own profile.");
        }
    }
}
