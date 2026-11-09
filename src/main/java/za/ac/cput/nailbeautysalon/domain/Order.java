package za.ac.cput.nailbeautysalon.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    private String orderId;
    private String customerId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private LocalDateTime orderDate;
    private double totalAmount;
    private String status;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "order_id")
    private List<OrderItem> items;

    protected Order() {}

    public Order(Builder builder) {
        this.orderId = builder.orderId;
        this.customerId = builder.customerId;
        this.customerName = builder.customerName;
        this.customerEmail = builder.customerEmail;
        this.customerPhone = builder.customerPhone;
        this.orderDate = builder.orderDate;
        this.totalAmount = builder.totalAmount;
        this.status = builder.status;
        this.items = builder.items;
    }

    // Getters
    public String getOrderId() { return orderId; }
    public String getCustomerId() { return customerId; }
    public String getCustomerName() { return customerName; }
    public String getCustomerEmail() { return customerEmail; }
    public String getCustomerPhone() { return customerPhone; }
    public LocalDateTime getOrderDate() { return orderDate; }
    public double getTotalAmount() { return totalAmount; }
    public String getStatus() { return status; }
    public List<OrderItem> getItems() { return items; }

    public void setStatus(String status) { this.status = status; }

    public static class Builder {
        private String orderId;
        private String customerId;
        private String customerName;
        private String customerEmail;
        private String customerPhone;
        private LocalDateTime orderDate;
        private double totalAmount;
        private String status;
        private List<OrderItem> items;

        public Builder setOrderId(String orderId) { this.orderId = orderId; return this; }
        public Builder setCustomerId(String customerId) { this.customerId = customerId; return this; }
        public Builder setCustomerName(String customerName) { this.customerName = customerName; return this; }
        public Builder setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; return this; }
        public Builder setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; return this; }
        public Builder setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; return this; }
        public Builder setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; return this; }
        public Builder setStatus(String status) { this.status = status; return this; }
        public Builder setItems(List<OrderItem> items) { this.items = items; return this; }

        public Order build() { return new Order(this); }
    }
}