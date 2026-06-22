package za.ac.cput.nailbeautysalon.domain;

/**
 * author: Nandipha Galada
 * student number: 221225366
 * date 20 June 2026
 */

public class Service {

    private String serviceId;
    private String serviceName;
    private String category;
    private String description;
    private double price;

    protected Service() {
    }

    public Service(Builder builder) {
        this.serviceId = builder.serviceId;
        this.serviceName = builder.serviceName;
        this.category = builder.category;
        this.description = builder.description;
        this.price = builder.price;
    }

    public String getServiceId() {
        return serviceId;
    }

    public String getServiceName() {
        return serviceName;
    }

    public String getCategory() {
        return category;
    }

    public String getDescription() {
        return description;
    }

    public double getPrice() {
        return price;
    }

    @Override
    public String toString() {
        return "Service{" +
                "serviceId='" + serviceId + '\'' +
                ", serviceName='" + serviceName + '\'' +
                ", category='" + category + '\'' +
                ", description='" + description + '\'' +
                ", price=" + price +
                '}';
    }
    
    public static class Builder{
        
        private String serviceId;
        private String serviceName;
        private String category;
        private String description;
        private double price;
        
        public Builder setServiceId(String serviceId) {
            this.serviceId = serviceId;
            return this;
        }
        
        public Builder setServiceName(String serviceName) {
            this.serviceName = serviceName;
            return this;
        }
        
        public Builder setCategory(String category) {
            this.category = category;
            return this;
        }
        
        public Builder setDescription(String description) {
            this.description = description;
            return this;
        }
        
        public Builder setPrice(double price) {
            this.price = price;
            return this;
        }

        public Builder copy(Service service) {
            this.serviceId = service.serviceId;
            this.serviceName = service.serviceName;
            this.category = service.category;
            this.description = service.description;
            this.price = service.price;
            return this;
        }

        public Service build() {
            return new Service(this);
        }
    }
}
