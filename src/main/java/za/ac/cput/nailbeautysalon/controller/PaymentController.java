package za.ac.cput.nailbeautysalon.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.nailbeautysalon.dto.PaymentResponse;
import za.ac.cput.nailbeautysalon.dto.StatusRequest;
import za.ac.cput.nailbeautysalon.service.PaymentService;

import java.util.List;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    private final PaymentService service;

    @Autowired
    public PaymentController(PaymentService service) {
        this.service = service;
    }

    /** Admin / employee: all payments with the booking and customer they belong to. */
    @GetMapping("/getAll")
    public List<PaymentResponse> getAll() {
        return service.getAll();
    }

    /** Admin only: e.g. mark a payment Paid once the customer has paid at the salon. */
    @PutMapping("/{paymentId}/status")
    public PaymentResponse updateStatus(@PathVariable String paymentId, @Valid @RequestBody StatusRequest request) {
        return service.updateStatus(paymentId, request.status());
    }
}
