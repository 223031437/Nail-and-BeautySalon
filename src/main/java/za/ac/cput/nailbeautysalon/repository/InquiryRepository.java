package za.ac.cput.nailbeautysalon.repository;
/* InquiryRepository.java
Inquiry Repository class
Author: Mbali Hlaba (223031437)
Date: 03 July 2026
*/

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.cput.nailbeautysalon.domain.Inquiry;
import za.ac.cput.nailbeautysalon.domain.Subject;

import java.util.List;

@Repository
public interface InquiryRepository extends JpaRepository<Inquiry, String> {
    List<Inquiry> findInquiriesBySubject(Subject subject);
    List<Inquiry> findByPhoneNumber(String phoneNumber);
}
