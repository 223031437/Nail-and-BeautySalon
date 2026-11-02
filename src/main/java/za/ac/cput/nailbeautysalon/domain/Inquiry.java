package za.ac.cput.nailbeautysalon.domain;
/* Inquiry.java
   Inquiry POJO class (a message sent from the Contact page to the salon employees)
   Author: M Hlaba (223031437)
   Date: 22 June 2026 */

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "inquiries")
public class Inquiry {

    public static final String STATUS_NEW = "New";
    public static final String STATUS_RESPONDED = "Responded";

    // The e-mail used to be the primary key, which meant a second message from the
    // same customer overwrote the first one. A generated id fixes that.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long inquiryId;

    private String email;
    private String fullName;
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    private Subject subject;

    @Column(length = 2000)
    private String message;

    private String status;
    private LocalDateTime createdAt;

    @Column(length = 2000)
    private String response;
    private LocalDateTime respondedAt;
    private String respondedBy;

    protected Inquiry(){ }

    public Inquiry(Builder builder){
        this.email = builder.email;
        this.fullName = builder.fullName;
        this.phoneNumber = builder.phoneNumber;
        this.subject = builder.subject;
        this.message = builder.message;
        this.status = builder.status != null ? builder.status : STATUS_NEW;
        this.createdAt = builder.createdAt != null ? builder.createdAt : LocalDateTime.now();
        this.response = builder.response;
        this.respondedAt = builder.respondedAt;
        this.respondedBy = builder.respondedBy;
        this.inquiryId = builder.inquiryId;
    }

    public Long getInquiryId() {
        return inquiryId;
    }

    public String getEmail() {
        return email;
    }

    public String getMessage() {
        return message;
    }

    public String getFullName() {
        return fullName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public Subject getSubject() {
        return subject;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getResponse() {
        return response;
    }

    public LocalDateTime getRespondedAt() {
        return respondedAt;
    }

    public String getRespondedBy() {
        return respondedBy;
    }

    @Override
    public String toString() {
        return "Inquiry{" +
                "inquiryId=" + inquiryId +
                ", email='" + email + '\'' +
                ", fullName='" + fullName + '\'' +
                ", phoneNumber=" + phoneNumber +
                ", subject=" + subject +
                ", message='" + message + '\'' +
                ", status='" + status + '\'' +
                '}';
    }

    public static class Builder{
        private Long inquiryId;
        private String email;
        private String fullName;
        private String phoneNumber;
        private Subject subject;
        private String message;
        private String status;
        private LocalDateTime createdAt;
        private String response;
        private LocalDateTime respondedAt;
        private String respondedBy;

        public Builder setInquiryId(Long inquiryId) {
            this.inquiryId = inquiryId;
            return this;
        }

        // Bug fix: this setter previously did nothing, so every message was saved empty.
        public Builder setMessage(String message) {
            this.message = message;
            return this;
        }

        public Builder setPhoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
            return this;
        }

        public Builder setSubject(Subject subject) {
            this.subject = subject;
            return this;
        }

        public Builder setFullName(String fullName) {
            this.fullName = fullName;
            return this;
        }

        public Builder setEmail(String email) {
            this.email = email;
            return this;
        }

        public Builder setStatus(String status) {
            this.status = status;
            return this;
        }

        public Builder setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Builder setResponse(String response) {
            this.response = response;
            return this;
        }

        public Builder setRespondedAt(LocalDateTime respondedAt) {
            this.respondedAt = respondedAt;
            return this;
        }

        public Builder setRespondedBy(String respondedBy) {
            this.respondedBy = respondedBy;
            return this;
        }

        public Builder copy(Inquiry inquiry){
            this.inquiryId = inquiry.inquiryId;
            this.email = inquiry.email;
            this.fullName = inquiry.fullName;
            this.phoneNumber = inquiry.phoneNumber;
            this.subject = inquiry.subject;
            this.message = inquiry.message;
            this.status = inquiry.status;
            this.createdAt = inquiry.createdAt;
            this.response = inquiry.response;
            this.respondedAt = inquiry.respondedAt;
            this.respondedBy = inquiry.respondedBy;
            return this;
        }

        public Inquiry build(){
            return new Inquiry(this);
        }
    }
}
