package za.ac.cput.nailbeautysalon.domain;

import jakarta.persistence.*;

import java.time.LocalDateTime;

/** One payment record per booking. Created (as "Pending") when a booking is made. */
@Entity
@Table(name = "payments")
public class Payment {

    public static final String PENDING   = "Pending";
    public static final String PAID      = "Paid";
    public static final String CANCELLED = "Cancelled";
    public static final String REFUNDED  = "Refunded";
    public static final String REFUND_DUE = "Refund Due";

    @Id
    private String paymentId;
    private String appointmentId;
    private String customerId;
    private double amount;
    private String method;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime paidAt;

    protected Payment() {}

    public Payment(String paymentId, String appointmentId, String customerId,
                   double amount, String method, String status) {
        this.paymentId = paymentId;
        this.appointmentId = appointmentId;
        this.customerId = customerId;
        this.amount = amount;
        this.method = method;
        this.status = status;
        this.createdAt = LocalDateTime.now();
    }

    public String getPaymentId()        { return paymentId; }
    public String getAppointmentId()    { return appointmentId; }
    public String getCustomerId()       { return customerId; }
    public double getAmount()           { return amount; }
    public String getMethod()           { return method; }
    public String getStatus()           { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getPaidAt()    { return paidAt; }

    public void setStatus(String status)       { this.status = status; }
    public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }
    public void setMethod(String method)       { this.method = method; }
}
