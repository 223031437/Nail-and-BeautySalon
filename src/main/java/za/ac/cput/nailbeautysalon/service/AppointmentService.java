package za.ac.cput.nailbeautysalon.service;
/* Appointment.java
Appointment model class
Author: Tshephiso Kekana (240264681)
Date: 05 July 2026
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.nailbeautysalon.domain.Appointment;
import za.ac.cput.nailbeautysalon.repository.AppointmentRepository;


import java.util.List;

@Service
public class AppointmentService implements IAppointmentService <Appointment, String>{
    private AppointmentRepository repository;

    @Autowired
    AppointmentService(AppointmentRepository repository){
        this.repository = repository;
    }

    @Override
    public Appointment create(Appointment appointment) {
        return this.repository.save(appointment);
    }

    @Override
    public Appointment read(String appointmentId) {
        return this.repository.findById(appointmentId).orElse(null);
    }

    @Override
    public Appointment update(Appointment appointment) {
        return this.repository.save(appointment);
    }

    @Override
    public boolean delete(String appointmentId) {
        this.repository.deleteById(appointmentId);
        return true;
    }

    @Override
    public List<Appointment> getAll() {
        return this.repository.findAll();
    }

    public List<Appointment> findByAddress_City(String city){return this.repository.findByAddress_City(city);}
}
