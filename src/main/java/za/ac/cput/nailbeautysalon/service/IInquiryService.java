package za.ac.cput.nailbeautysalon.service;

import za.ac.cput.nailbeautysalon.domain.Inquiry;
import za.ac.cput.nailbeautysalon.domain.Subject;

import java.util.List;

public interface IInquiryService {
    Inquiry create(Inquiry inquiry);
    Inquiry read(Long id);
    boolean delete(Long id);

    List<Inquiry> getAll();
    List<Inquiry> findInquiriesBySubject(Subject subject);
    List<Inquiry> findByPhoneNumber(String phoneNumber);
}
