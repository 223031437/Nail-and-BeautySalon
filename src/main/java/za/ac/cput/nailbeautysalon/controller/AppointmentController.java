package za.ac.cput.nailbeautysalon.controller;

/* AppointmentController.java
Appointment Controller class
Author: Tshephiso Kekana (240264681)
Date: 25 July 2026
*/

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.nailbeautysalon.domain.Account;
import za.ac.cput.nailbeautysalon.dto.*;
import za.ac.cput.nailbeautysalon.service.AppointmentService;
import za.ac.cput.nailbeautysalon.service.BookingService;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/appointment")
public class AppointmentController {

    private final BookingService bookingService;
    private final AppointmentService service;

    @Autowired
    public AppointmentController(BookingService bookingService, AppointmentService service) {
        this.bookingService = bookingService;
        this.service = service;
    }

    /** Public: the time slots of one day and whether each can still be booked. */
    @GetMapping("/availability")
    public List<SlotResponse> availability(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return bookingService.availability(date);
    }

    /** Customer: make a booking (also creates the payment record and sends the confirmation e-mails). */
    @PostMapping("/create")
    public ResponseEntity<AppointmentResponse> create(@Valid @RequestBody BookingRequest request,
                                                      Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bookingService.create(account(authentication), request));
    }

    /** Customer: my own bookings. */
    @GetMapping("/mine")
    public List<AppointmentResponse> mine(Authentication authentication) {
        return bookingService.getForCustomer(account(authentication).getUserId());
    }

    /** Admin / employee: every booking. */
    @GetMapping("/getAll")
    public List<AppointmentResponse> getAll() {
        return bookingService.getAll();
    }

    /** One booking (customers can only read their own). POST is kept because the old frontend used it. */
    @RequestMapping(value = "/read/{appointmentId}", method = {RequestMethod.GET, RequestMethod.POST})
    public AppointmentResponse read(@PathVariable String appointmentId, Authentication authentication) {
        return bookingService.get(account(authentication), appointmentId);
    }

    /** Customer (own booking) or admin/employee: move a booking to another AVAILABLE slot. */
    @PutMapping("/{appointmentId}/reschedule")
    public AppointmentResponse reschedule(@PathVariable String appointmentId,
                                          @Valid @RequestBody RescheduleRequest request,
                                          Authentication authentication) {
        return bookingService.reschedule(account(authentication), appointmentId, request.dateTime());
    }

    /** Customer (own booking) or admin/employee: cancel a booking. */
    @PutMapping("/{appointmentId}/cancel")
    public AppointmentResponse cancel(@PathVariable String appointmentId, Authentication authentication) {
        return bookingService.cancel(account(authentication), appointmentId);
    }

    /** Admin / employee: mark a booking Completed. */
    @PutMapping("/{appointmentId}/status")
    public AppointmentResponse status(@PathVariable String appointmentId, @Valid @RequestBody StatusRequest request) {
        return bookingService.setStatus(appointmentId, request.status());
    }

    /** Admin: permanently remove a booking record. */
    @DeleteMapping("/delete/{appointmentId}")
    public Map<String, Object> delete(@PathVariable String appointmentId) {
        return Map.of("deleted", service.delete(appointmentId));
    }

    private Account account(Authentication authentication) {
        return (Account) authentication.getPrincipal();
    }
}
