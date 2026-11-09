package za.ac.cput.nailbeautysalon.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import za.ac.cput.nailbeautysalon.domain.Order;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, String> {
    List<Order> findByCustomerId(String customerId);
}