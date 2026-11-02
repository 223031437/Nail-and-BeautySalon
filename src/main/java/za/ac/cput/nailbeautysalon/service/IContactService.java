package za.ac.cput.nailbeautysalon.service;

import za.ac.cput.nailbeautysalon.domain.Address;
import za.ac.cput.nailbeautysalon.domain.Contact;

import java.util.Collection;
import java.util.List;

public interface IContactService {
    Contact create(Contact contact);
    Contact read(Long id);
    Contact update(Contact contact);
    boolean delete(Long id);

    List<Contact> getAll();
    List<Contact> findContactByAddressProvinceIn(Collection<String> addressProvinces);
}
