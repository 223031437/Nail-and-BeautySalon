package za.ac.cput.nailbeautysalon.factory;
/* ProductFactoryTest.java
Author: Confidence Khoza
Student number: 222927402
Date: 26 June 2026
*/
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import za.ac.cput.nailbeautysalon.domain.Product;
import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.MethodName.class)

public class ProductFactoryTest {
    @Test
    void a_createProduct() {

        Product product = ProductFactory.createProduct(
                1,                     // productID
                "Gel Polish",                   // productName
                "Nails",                        // category
                120.00,                         // price
                50,                             // quantityInStock
                10,                             // lowStockThreshold
                "Bottle",                       // unitOfMeasure
                "Beauty Depot",                // supplier
                "Professional gel nail polish" // description
        );

        assertNotNull(product);
        System.out.println(product);
    }

    @Test
    void b_createProductThatFails() {

        Product product = ProductFactory.createProduct(
                2,      // productID
                "",     // productName (invalid)
                "",     // category (invalid)
                -50.00, // price (invalid)
                -1,     // quantityInStock (invalid)
                -1,     // lowStockThreshold (invalid)
                "",     // unitOfMeasure (invalid)
                "",     // supplier (invalid)
                ""      // description (invalid)
        );

        assertNull(product);
        System.out.println((Object) null);
    }
}

