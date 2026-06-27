package za.ac.cput.nailbeautysalon.domain;
/* Contact.java
   Contact POJO class
   Author: M Hlaba (223031437)
   Date: 22 June 2026 */
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;

import java.time.LocalTime;

@Entity
public class Contact {
    @Id
    @OneToOne
    private Address address;
    private String phone;
    private String email;
    private LocalTime hours;

    protected Contact(){}

    public Contact(Builder builder){
        this.address = builder.address;
        this.hours = builder.hours;
        this.email = builder.email;
        this.phone = builder.phone;
    }

    public Address getAddress() {
        return address;
    }

    public String getPhone() {
        return phone;
    }

    public String getEmail() {
        return email;
    }

    public LocalTime getHours() {
        return hours;
    }

    @Override
    public String toString() {
        return "Contact{" +
                "address=" + address +
                ", phone=" + phone +
                ", email='" + email + '\'' +
                ", hours=" + hours +
                '}';
    }

    public static class Builder{
        private Address address;
        private String phone;
        private String email;
        private LocalTime hours;

        public Builder setAddress(Address address) {
            this.address = address;
            return this;
        }

        public Builder setPhone(String phone) {
            this.phone = phone;
            return this;
        }

        public Builder setEmail(String email) {
            this.email = email;
            return this;
        }

        public Builder setHours(LocalTime hours) {
            this.hours = hours;
            return this;
        }

        public Builder copy(Contact contact){
            this.address = contact.address;
            this.hours = contact.hours;
            this.email = contact.email;
            this.phone = contact.phone;
            return this;
        }

        public Contact build(){
            return new Contact(this);
        }
    }
}
