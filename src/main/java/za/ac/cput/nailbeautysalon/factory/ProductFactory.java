package za.ac.cput.nailbeautysalon.factory;
/* ProductFactory.java
Author: Confidence Khoza
Student number: 222927402
Date: 26 June 2026
*/

import za.ac.cput.nailbeautysalon.util.Helper;
import za.ac.cput.nailbeautysalon.domain.Product;

public class ProductFactory {
    public static Product createProduct(
            int productID,
            String productName,
            String category,
            double price,
            int quantityInStock,
            int lowStockThreshold,
            String unitOfMeasure,
            String supplier,
            String description) {

        if (Helper.isNullOrEmpty(productName) || Helper.isNullOrEmpty(category) || Helper.isNullOrEmpty(unitOfMeasure)
                || Helper.isNullOrEmpty(supplier) || Helper.isNullOrEmpty(description)) {
            return null;
        }

        if (price < 0 || quantityInStock < 0 || lowStockThreshold < 0) {
            return null;
        }

        return new Product.Builder()
                .setProductID(productID)
                .setProductName(productName)
                .setCategory(category)
                .setPrice(price)
                .setQuantityInStock(quantityInStock)
                .setLowStockThreshold(lowStockThreshold)
                .setUnitOfMeasure(unitOfMeasure)
                .setSupplier(supplier)
                .setDescription(description)
                .build();
    }
}



