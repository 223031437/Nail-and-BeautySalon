package za.ac.cput.nailbeautysalon.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.cput.nailbeautysalon.domain.Address;
import za.ac.cput.nailbeautysalon.domain.Appointment;

import java.util.List;

/* Appointment.java
Appointment model class
Author: Tshephiso Kekana (240264681)
Date: 05 July 2026
*/

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, String> {
    List<Appointment> findByCustomerId(String customerId);

    List<Appointment> findAppointmentsByAddress(Address address);

    List<Appointment> findByAddress_City(String city);

    //String AppointmentId(String appointmentId);
}
