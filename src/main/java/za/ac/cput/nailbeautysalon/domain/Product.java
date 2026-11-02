
package za.ac.cput.nailbeautysalon.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Column;

/* author: Confidence Khoza
   Student number: 222927402
 */
@Entity
public class Product {

    @Id
    private int productID;

    private String productName;
    private String category;
    private double price;
    private int quantityInStock;
    private int lowStockThreshold;
    private String unitOfMeasure;
    private String supplier;
    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    public Product() {

    }

    private Product(Builder builder) {
        this.productID = builder.productID;
        this.productName = builder.productName;
        this.category = builder.category;
        this.price = builder.price;
        this.quantityInStock = builder.quantityInStock;
        this.lowStockThreshold = builder.lowStockThreshold;
        this.unitOfMeasure = builder.unitOfMeasure;
        this.supplier = builder.supplier;
        this.description = builder.description;
        this.imageUrl = builder.imageUrl;
    }

    public int getProductID() {
        return productID;
    }

    public String getProductName() {
        return productName;
    }

    public String getCategory() {
        return category;
    }

    public double getPrice() {
        return price;
    }

    public int getQuantityInStock() {
        return quantityInStock;
    }

    public int getLowStockThreshold() {
        return lowStockThreshold;
    }

    public String getUnitOfMeasure() {
        return unitOfMeasure;
    }

    public String getSupplier() {
        return supplier;
    }

    public String getDescription() {
        return description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public static class Builder {

        private int productID;
        private String productName;
        private String category;
        private double price;
        private int quantityInStock;
        private int lowStockThreshold;
        private String unitOfMeasure;
        private String supplier;
        private String description;
        private String imageUrl;

        public Builder setProductID(int productID) {
            this.productID = productID;
            return this;
        }

        public Builder setProductName(String productName) {
            this.productName = productName;
            return this;
        }

        public Builder setCategory(String category) {
            this.category = category;
            return this;
        }

        public Builder setPrice(double price) {
            this.price = price;
            return this;
        }

        public Builder setQuantityInStock(int quantityInStock) {
            this.quantityInStock = quantityInStock;
            return this;
        }

        public Builder setLowStockThreshold(int lowStockThreshold) {
            this.lowStockThreshold = lowStockThreshold;
            return this;
        }

        public Builder setUnitOfMeasure(String unitOfMeasure) {
            this.unitOfMeasure = unitOfMeasure;
            return this;
        }

        public Builder setSupplier(String supplier) {
            this.supplier = supplier;
            return this;
        }

        public Builder setDescription(String description) {
            this.description = description;
            return this;
        }

        public Builder setImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public Builder copy(Product product) {
            this.productID = product.productID;
            this.productName = product.productName;
            this.category = product.category;
            this.price = product.price;
            this.quantityInStock = product.quantityInStock;
            this.lowStockThreshold = product.lowStockThreshold;
            this.unitOfMeasure = product.unitOfMeasure;
            this.supplier = product.supplier;
            this.description = product.description;
            this.imageUrl = product.imageUrl;
            return this;
        }

        @Override
        public String toString() {
            return "Product{" +
                    "productID=" + productID +
                    ", productName='" + productName + '\'' +
                    ", category='" + category + '\'' +
                    ", price=" + price +
                    ", quantityInStock=" + quantityInStock +
                    ", lowStockThreshold=" + lowStockThreshold +
                    ", unitOfMeasure='" + unitOfMeasure + '\'' +
                    ", supplier='" + supplier + '\'' +
                    ", description='" + description + '\'' +
                    ", imageUrl='" + imageUrl + '\'' +
                    '}';
        }

        public Product build() {
            return new Product(this);
        }
    }
}
