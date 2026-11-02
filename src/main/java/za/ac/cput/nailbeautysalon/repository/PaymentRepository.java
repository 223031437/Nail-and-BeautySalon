package za.ac.cput.nailbeautysalon.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.cput.nailbeautysalon.domain.Payment;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
    List<Payment> findByAppointmentId(String appointmentId);
    List<Payment> findByCustomerId(String customerId);
}
