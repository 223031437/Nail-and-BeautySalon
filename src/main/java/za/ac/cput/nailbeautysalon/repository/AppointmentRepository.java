package za.ac.cput.nailbeautysalon.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.cput.nailbeautysalon.domain.Address;
import za.ac.cput.nailbeautysalon.domain.Appointment;

import java.time.LocalDateTime;
import java.util.List;

/* Appointment.java
Appointment model class
Author: Tshephiso Kekana (240264681)
Date: 05 July 2026
*/

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, String> {
    List<Appointment> findAppointmentsByAddress(Address address);

    List<Appointment> findByAddress_City(String city);

    List<Appointment> findByCustomerIdOrderByDateTimeAsc(String customerId);

    List<Appointment> findAllByOrderByDateTimeAsc();

    /** Bookings occupying a time slot (everything that is not cancelled). */
    List<Appointment> findByDateTimeAndStatusNot(LocalDateTime dateTime, String status);

    /** Bookings inside a time range, used to work out which slots of a day are taken. */
    List<Appointment> findByDateTimeBetweenAndStatusNot(LocalDateTime from, LocalDateTime to, String status);
}
