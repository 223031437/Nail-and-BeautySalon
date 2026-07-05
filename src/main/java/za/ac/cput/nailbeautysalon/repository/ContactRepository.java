package za.ac.cput.nailbeautysalon.repository;
/* ContactRepository.java
Contact Repository class
Author: Mbali Hlaba (223031437)
Date: 03 July 2026
*/

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.cput.nailbeautysalon.domain.Address;
import za.ac.cput.nailbeautysalon.domain.Contact;

import java.util.Collection;
import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Address> {
   List<Contact> findContactByAddressProvinceIn(Collection<String> addressProvinces);
   List<Contact> findAll();
}
