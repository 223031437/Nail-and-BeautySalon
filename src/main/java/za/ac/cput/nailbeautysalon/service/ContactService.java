package za.ac.cput.nailbeautysalon.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import za.ac.cput.nailbeautysalon.domain.Contact;
import za.ac.cput.nailbeautysalon.repository.AddressRepository;
import za.ac.cput.nailbeautysalon.repository.ContactRepository;

import java.util.Collection;
import java.util.List;

@Service
public class ContactService implements IContactService {

    private final ContactRepository repository;
    private final AddressRepository addressRepository;

    @Autowired
    public ContactService(ContactRepository repository, AddressRepository addressRepository) {
        this.repository = repository;
        this.addressRepository = addressRepository;
    }

    @Override
    @Transactional
    public Contact create(Contact contact) {
        if (contact == null || contact.getAddress() == null) return null;
        addressRepository.save(contact.getAddress());
        return this.repository.save(contact);
    }

    @Override
    public Contact read(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public Contact update(Contact contact) {
        if (contact == null || contact.getContactId() == null
                || !repository.existsById(contact.getContactId())) {
            return null;
        }
        if (contact.getAddress() != null) {
            addressRepository.save(contact.getAddress());
        }
        return this.repository.save(contact);
    }

    @Override
    public boolean delete(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public List<Contact> getAll() {
        return repository.findAll();
    }

    @Override
    public List<Contact> findContactByAddressProvinceIn(Collection<String> addressProvinces) {
        return repository.findContactByAddressProvinceIn(addressProvinces);
    }
}
