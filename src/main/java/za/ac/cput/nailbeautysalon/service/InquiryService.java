package za.ac.cput.nailbeautysalon.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import za.ac.cput.nailbeautysalon.domain.Inquiry;
import za.ac.cput.nailbeautysalon.domain.Subject;
import za.ac.cput.nailbeautysalon.dto.InquiryReplyRequest;
import za.ac.cput.nailbeautysalon.dto.InquiryRequest;
import za.ac.cput.nailbeautysalon.exception.ApiException;
import za.ac.cput.nailbeautysalon.repository.InquiryRepository;
import za.ac.cput.nailbeautysalon.util.Helper;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class InquiryService implements IInquiryService {

    private final InquiryRepository repository;
    private final EmailService emailService;

    @Autowired
    public InquiryService(InquiryRepository repository, EmailService emailService) {
        this.repository = repository;
        this.emailService = emailService;
    }

    @Override
    public Inquiry create(Inquiry inquiry) {
        if(inquiry == null) return null;
        return repository.save(inquiry);
    }

    /** Contact-page submission: validates, stores the message and notifies the employees. */
    public Inquiry submit(InquiryRequest request) {
        if (!Helper.isValidEmail(request.email().trim())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Please enter a valid email address.");
        }
        if (!Helper.isValidPhone(request.phoneNumber())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Please enter a valid phone number (9 to 15 digits).");
        }
        Inquiry saved = repository.save(new Inquiry.Builder()
                .setFullName(request.fullName().trim())
                .setEmail(request.email().trim().toLowerCase())
                .setPhoneNumber(request.phoneNumber().trim())
                .setSubject(request.subject())
                .setMessage(request.message().trim())
                .setStatus(Inquiry.STATUS_NEW)
                .setCreatedAt(LocalDateTime.now())
                .build());
        emailService.sendInquiryReceived(saved);
        return saved;
    }

    /** An employee records how they answered (and optionally e-mails the answer to the customer). */
    public Inquiry respond(Long id, InquiryReplyRequest request, String employeeName) {
        Inquiry existing = repository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Message not found."));
        Inquiry updated = repository.save(new Inquiry.Builder().copy(existing)
                .setStatus(Inquiry.STATUS_RESPONDED)
                .setResponse(request.response().trim())
                .setRespondedAt(LocalDateTime.now())
                .setRespondedBy(employeeName)
                .build());
        if (request.sendEmail() == null || request.sendEmail()) {
            emailService.sendInquiryReply(updated);
        }
        return updated;
    }

    @Override
    public Inquiry read(Long id) {
        return repository.findById(id).orElse(null);
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
    public List<Inquiry> getAll() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    public List<Inquiry> findInquiriesBySubject(Subject subject) {
        return repository.findInquiriesBySubject(subject);
    }

    @Override
    public List<Inquiry> findByPhoneNumber(String phoneNumber) {
        return repository.findByPhoneNumber(phoneNumber);
    }
}
