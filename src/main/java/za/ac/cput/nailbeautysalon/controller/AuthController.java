package za.ac.cput.nailbeautysalon.controller;

import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.nailbeautysalon.domain.*;
import za.ac.cput.nailbeautysalon.dto.*;
import za.ac.cput.nailbeautysalon.repository.AccountRepository;
import za.ac.cput.nailbeautysalon.repository.CustomerRepository;
import za.ac.cput.nailbeautysalon.repository.EmployeeRepository;
import za.ac.cput.nailbeautysalon.security.JwtUtil;
import za.ac.cput.nailbeautysalon.util.Helper;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AuthenticationManager authenticationManager;
    private final JwtUtil               jwtUtil;
    private final PasswordEncoder       passwordEncoder;
    private final AccountRepository     accountRepository;
    private final CustomerRepository    customerRepository;
    private final EmployeeRepository    employeeRepository;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          PasswordEncoder passwordEncoder,
                          AccountRepository accountRepository,
                          CustomerRepository customerRepository,
                          EmployeeRepository employeeRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil               = jwtUtil;
        this.passwordEncoder       = passwordEncoder;
        this.accountRepository     = accountRepository;
        this.customerRepository    = customerRepository;
        this.employeeRepository    = employeeRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.username().trim().toLowerCase(),
                            request.password()
                    )
            );

            Account account = (Account) auth.getPrincipal();
            String token = jwtUtil.generateToken(account);
            String role  = account.getAuthorities().stream()
                    .findFirst()
                    .map(GrantedAuthority::getAuthority)
                    .orElse(null);

            log.info("Login OK: username={} role={}", account.getUsername(), role);
            return ResponseEntity.ok(new LoginResponse(token, role, account.getUserId(),
                    displayName(account), account.getUsername()));

        } catch (AuthenticationException e) {
            // BadCredentialsException, UsernameNotFound (hidden as bad credentials), disabled, ...
            log.warn("Login FAILED for username={}", request.username());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password"));
        }
    }

    @PostMapping("/register-customer")
    @Transactional
    public ResponseEntity<?> registerCustomer(@Valid @RequestBody RegisterCustomerRequest req) {
        ResponseEntity<?> invalid = validateRegistration(req.email(), req.cellNumber());
        if (invalid != null) return invalid;

        String email = req.email().trim().toLowerCase();

        if (accountRepository.existsByUsername(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Email already registered"));
        }

        String newId = UUID.randomUUID().toString(); // Generate ID for BOTH tables

        // 1. Create Customer
        Customer customer = new Customer.Builder()
                .setUserId(newId)
                .setCustomerId(newId)
                .setFirstName(req.firstName().trim())
                .setLastName(req.lastName().trim())
                .setEmail(email)
                .setCellNumber(req.cellNumber().trim())
                .build();
        customerRepository.save(customer);

        // 2. Create Account linked to that customer
        Account account = new Account.Builder()
                .setUsername(email)
                .setPassword(passwordEncoder.encode(req.password()))
                .setRole(Role.ROLE_CUSTOMER)
                .setUserId(newId)
                .build();
        accountRepository.save(account);

        log.info("Registered customer: {} ({})", email, newId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                        "message", "Customer registered successfully",
                        "userId",  newId
                ));
    }

    /** Admin only (see SecurityConfig). */
    @PostMapping("/register-employee")
    @Transactional
    public ResponseEntity<?> registerEmployee(@Valid @RequestBody RegisterEmployeeRequest req) {
        ResponseEntity<?> invalid = validateRegistration(req.email(), req.cellNumber());
        if (invalid != null) return invalid;

        String email = req.email().trim().toLowerCase();

        if (accountRepository.existsByUsername(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Email already registered"));
        }

        String newId = UUID.randomUUID().toString();

        // 1. Create Employee
        Employee employee = new Employee.Builder()
                .setUserId(newId)
                .setEmployeeId(newId)
                .setFirstName(req.firstName().trim())
                .setLastName(req.lastName().trim())
                .setEmail(email)
                .setCellNumber(req.cellNumber().trim())
                .setRole(req.employeeRole().trim())
                .build();
        employeeRepository.save(employee);

        // 2. Create Account linked to that employee
        Account account = new Account.Builder()
                .setUsername(email)
                .setPassword(passwordEncoder.encode(req.password()))
                .setRole(Role.ROLE_EMPLOYEE)
                .setUserId(newId)
                .build();
        accountRepository.save(account);

        log.info("Registered employee: {} ({}) by admin", email, newId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                        "message", "Employee registered successfully",
                        "userId",  newId
                ));
    }

    /** Returns a 400 with per-field errors, or null when the e-mail and phone are fine. */
    private ResponseEntity<?> validateRegistration(String email, String cell) {
        Map<String, String> errors = new LinkedHashMap<>();
        if (!Helper.isValidEmail(email.trim())) {
            errors.put("email", "Please enter a valid email address");
        }
        if (!Helper.isValidPhone(cell)) {
            errors.put("cellNumber", "Please enter a valid cell number (9 to 15 digits)");
        }
        if (errors.isEmpty()) {
            return null;
        }
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("message", "Please fix the following: " + String.join("; ", errors.values()));
        body.put("errors", errors);
        return ResponseEntity.badRequest().body(body);
    }

    private String displayName(Account account) {
        String id = account.getUserId();
        if (id == null) {
            return "Admin";
        }
        if (account.getRole() == Role.ROLE_EMPLOYEE) {
            return employeeRepository.findById(id)
                    .map(e -> e.getFirstName() + " " + e.getLastName()).orElse("Employee");
        }
        return customerRepository.findById(id)
                .map(c -> c.getFirstName() + " " + c.getLastName()).orElse("Customer");
    }
}
