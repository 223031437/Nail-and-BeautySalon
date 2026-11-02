package za.ac.cput.nailbeautysalon.controller;
/* InquiryController.java
Inquiry Controller class (messages sent from the Contact page)
Author: Mbali Hlaba (223031437)
Date: 21 July 2026 */

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.nailbeautysalon.domain.Account;
import za.ac.cput.nailbeautysalon.domain.Inquiry;
import za.ac.cput.nailbeautysalon.dto.InquiryReplyRequest;
import za.ac.cput.nailbeautysalon.dto.InquiryRequest;
import za.ac.cput.nailbeautysalon.exception.ApiException;
import za.ac.cput.nailbeautysalon.repository.EmployeeRepository;
import za.ac.cput.nailbeautysalon.service.InquiryService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/inquiry")
public class InquiryController {

    private final InquiryService service;
    private final EmployeeRepository employeeRepository;

    @Autowired
    public InquiryController(InquiryService service, EmployeeRepository employeeRepository) {
        this.service = service;
        this.employeeRepository = employeeRepository;
    }

    /** Public: the Contact page form. */
    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@Valid @RequestBody InquiryRequest request) {
        Inquiry saved = service.submit(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Thank you! Your message has been sent. We will reply by email or phone shortly.",
                "inquiryId", saved.getInquiryId()));
    }

    /** Admin / employee: every message, newest first. */
    @GetMapping("/getAll")
    public List<Inquiry> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Inquiry read(@PathVariable Long id) {
        Inquiry inquiry = service.read(id);
        if (inquiry == null) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Message not found.");
        }
        return inquiry;
    }

    /** Admin / employee: record the answer (and optionally e-mail it to the customer). */
    @PutMapping("/{id}/respond")
    public Inquiry respond(@PathVariable Long id, @Valid @RequestBody InquiryReplyRequest request,
                           Authentication authentication) {
        Account account = (Account) authentication.getPrincipal();
        String name = employeeRepository.findById(account.getUserId() == null ? "" : account.getUserId())
                .map(e -> e.getFirstName() + " " + e.getLastName())
                .orElse("Admin");
        return service.respond(id, request, name);
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable Long id) {
        return Map.of("deleted", service.delete(id));
    }
}
