package za.ac.cput.nailbeautysalon.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.nailbeautysalon.domain.*;
import za.ac.cput.nailbeautysalon.dto.*;
import za.ac.cput.nailbeautysalon.repository.AccountRepository;
import za.ac.cput.nailbeautysalon.repository.CustomerRepository;
import za.ac.cput.nailbeautysalon.repository.EmployeeRepository;
import za.ac.cput.nailbeautysalon.repository.AppointmentRepository;
import za.ac.cput.nailbeautysalon.domain.Appointment;
import java.util.List;
import za.ac.cput.nailbeautysalon.security.JwtUtil;

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
    private final AppointmentRepository appointmentRepository;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          PasswordEncoder passwordEncoder,
                          AccountRepository accountRepository,
                          CustomerRepository customerRepository,
                          EmployeeRepository employeeRepository,
                          AppointmentRepository appointmentRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil               = jwtUtil;
        this.passwordEncoder       = passwordEncoder;
        this.accountRepository     = accountRepository;
        this.customerRepository    = customerRepository;
        this.employeeRepository    = employeeRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.username().toLowerCase(),
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
            return ResponseEntity.ok(new LoginResponse(token, role, account.getUserId()));

        } catch (BadCredentialsException e) {
            log.warn("Login FAILED for username={}", request.username());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password"));
        }
    }

    @PostMapping("/register-customer")
    public ResponseEntity<?> registerCustomer(@RequestBody RegisterCustomerRequest req) {
        String email = req.email().toLowerCase();

        if (accountRepository.existsByUsername(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Email already registered"));
        }

        String newId = UUID.randomUUID().toString(); // Generate ID for BOTH tables

        // 1. Create Customer
        Customer customer = new Customer.Builder()
                .setUserId(newId)        // <-- FIX: Hibernate requires this
                .setCustomerId(newId)
                .setFirstName(req.firstName())
                .setLastName(req.lastName())
                .setEmail(email)
                .setCellNumber(req.cellNumber())
                .build();
        customerRepository.save(customer);

        // 2. Create Account linked to that customer
        Account account = new Account.Builder()
                .setUsername(email)
                .setPassword(passwordEncoder.encode(req.password()))
                .setRole(Role.ROLE_CUSTOMER)
                .setUserId(newId)        // <-- Linked to the generated ID
                .build();
        accountRepository.save(account);

        log.info("Registered customer: {} ({})", email, newId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                        "message", "Customer registered successfully",
                        "userId",  newId
                ));
    }

    @PostMapping("/register-employee")
    public ResponseEntity<?> registerEmployee(@RequestBody RegisterEmployeeRequest req) {
        String email = req.email().toLowerCase();

        if (accountRepository.existsByUsername(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Email already registered"));
        }

        String newId = UUID.randomUUID().toString();

        // 1. Create Employee
        Employee employee = new Employee.Builder()
                .setUserId(newId)
                .setEmployeeId(newId)
                .setFirstName(req.firstName())
                .setLastName(req.lastName())
                .setEmail(email)
                .setCellNumber(req.cellNumber())
                .setRole(req.employeeRole())
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

    @GetMapping("/customer/appointments")
    public ResponseEntity<?> getMyAppointments(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Account)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Not logged in"));
        }

        Account account = (Account) authentication.getPrincipal();
        String customerId = account.getUserId();

        // If the user is an admin (userId is null), return empty or error
        if (customerId == null) {
            return ResponseEntity.ok(List.of());
        }

        //List<Appointment> appointments = appointmentRepository.findByCustomerId(customerId);
        List<Appointment> appointments = appointmentRepository.findAll();
        return ResponseEntity.ok(appointments);
    }
}