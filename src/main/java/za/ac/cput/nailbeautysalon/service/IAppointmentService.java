package za.ac.cput.nailbeautysalon.service;

import za.ac.cput.nailbeautysalon.domain.Address;
import za.ac.cput.nailbeautysalon.domain.Appointment;

import java.util.List;
/* Appointment.java
Appointment model class
Author: Tshephiso Kekana (240264681)
Date: 05 July 2026
*/

public interface IAppointmentService <T,ID>{

    T create(T t);

    T read(ID id);

    T update(T t);

    boolean delete(ID id);

    List<Appointment> getAll();
    List<Appointment> findByAddress_City(String city);

}
