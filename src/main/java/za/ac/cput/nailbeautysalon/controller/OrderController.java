package za.ac.cput.nailbeautysalon.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.nailbeautysalon.domain.Account;
import za.ac.cput.nailbeautysalon.domain.Order;
import za.ac.cput.nailbeautysalon.domain.OrderItem;
import za.ac.cput.nailbeautysalon.repository.OrderRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/order")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    // Customer: Place an order
    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody Order request, Authentication authentication) {
        Account account = (Account) authentication.getPrincipal();

        Order order = new Order.Builder()
                .setOrderId("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .setCustomerId(account.getUserId())
                .setCustomerName(request.getCustomerName())
                .setCustomerEmail(request.getCustomerEmail())
                .setCustomerPhone(request.getCustomerPhone())
                .setOrderDate(LocalDateTime.now())
                .setTotalAmount(request.getTotalAmount())
                .setStatus("Pending Collection")
                .setItems(request.getItems())
                .build();

        orderRepository.save(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    // Customer: See only THEIR orders
    @GetMapping("/mine")
    public List<Order> getMyOrders(Authentication authentication) {
        Account account = (Account) authentication.getPrincipal();
        return orderRepository.findByCustomerId(account.getUserId());
    }

    // Admin/Employee: View all orders
    @GetMapping("/getAll")
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // Admin/Employee: Update order status
    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String orderId, @RequestBody Map<String, String> body) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return ResponseEntity.notFound().build();
        }
        order.setStatus(body.get("status"));
        orderRepository.save(order);
        return ResponseEntity.ok(order);
    }
}