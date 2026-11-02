package za.ac.cput.nailbeautysalon.controller;

/* Appointment.java
Appointment model class
Author: Tshephiso Kekana (240264681)
Date: 25 July 2026
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.nailbeautysalon.domain.Account;
import za.ac.cput.nailbeautysalon.domain.Appointment;
import za.ac.cput.nailbeautysalon.service.AppointmentService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/appointment")
public class AppointmentController {

    private final AppointmentService service;

    @Autowired
    public AppointmentController(AppointmentService service) {
        this.service = service;
    }

    @PostMapping("/book")
    public ResponseEntity<?> bookAppointment(@RequestBody Appointment appointment, Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Account)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You must be logged in to book.");
        }

        Account account = (Account) authentication.getPrincipal();


        if (account.getUserId() != null) {
            appointment.setCustomerId(account.getUserId());
        }


        if (appointment.getAppointmentId() == null) {
            appointment.setAppointmentId(UUID.randomUUID().toString());
        }

        Appointment saved = service.create(appointment);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/my-appointments")
    public ResponseEntity<?> getMyAppointments(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Account)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not logged in");
        }
        Account account = (Account) authentication.getPrincipal();
        String customerId = account.getUserId();

        if (customerId == null) {
            return ResponseEntity.ok(List.of());
        }


        List<Appointment> appointments = service.findByCustomerId(customerId);
        return ResponseEntity.ok(appointments);
    }



    @GetMapping("/getAll")
    public List<Appointment> getAll(){
        return service.getAll();
    }
}