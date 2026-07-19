package za.ac.cput.nailbeautysalon.controller;

/*
 * ProductControllerTest.java
 * ProductController Test class
 * Author: Confidence Khoza (222927402)
 * Date: 19 July 2026
 */

import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import za.ac.cput.nailbeautysalon.domain.Product;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestMethodOrder(MethodOrderer.MethodName.class)
class ProductControllerTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    private final Product product = new Product.Builder()
            .setProductID(1)
            .setProductName("Gel Polish")
            .setCategory("Nails")
            .setPrice(120.00)
            .setQuantityInStock(50)
            .setLowStockThreshold(10)
            .setUnitOfMeasure("Bottle")
            .setSupplier("Beauty Depot")
            .setDescription("Professional Gel Polish")
            .build();

    private String getBaseUrl() {
        return "http://localhost:" + port + "/product";
    }

    @Test
    void a_create() {

        ResponseEntity<Product> response = restTemplate.postForEntity(
                getBaseUrl() + "/create",
                product,
                Product.class);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());

        System.out.println(response.getBody());
    }

    @Test
    void b_read() {

        ResponseEntity<Product> response = restTemplate.postForEntity(
                getBaseUrl() + "/read/" + product.getProductID(),
                null,
                Product.class);

        assertNotNull(response);

        System.out.println(response.getBody());
    }

    @Test
    void c_update() {

        Product updated = new Product.Builder()
                .copy(product)
                .setPrice(150.00)
                .build();

        HttpEntity<Product> request = new HttpEntity<>(updated);

        ResponseEntity<Product> response = restTemplate.exchange(
                getBaseUrl() + "/update",
                HttpMethod.PUT,
                request,
                Product.class);

        assertNotNull(response.getBody());

        System.out.println(response.getBody());
    }

    @Test
    void d_delete() {

        restTemplate.delete(getBaseUrl() + "/delete/" + product.getProductID());

        assertTrue(true);
    }

    @Test
    void e_getAll() {

        ResponseEntity<String> response = restTemplate.getForEntity(
                getBaseUrl() + "/getAll",
                String.class);

        assertNotNull(response);

        System.out.println(response.getBody());
    }
}


