package za.ac.cput.nailbeautysalon.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.nailbeautysalon.domain.Product;
import za.ac.cput.nailbeautysalon.service.ProductService;
import za.ac.cput.nailbeautysalon.exception.ApiException;
import za.ac.cput.nailbeautysalon.factory.ProductFactory;
import org.springframework.http.HttpStatus;

import java.util.List;

/*
 ProductController.java
 Product Controller class
 Author: Confidence Khoza (222927402)
 Date: 19 July 2026
*/

@RestController
@RequestMapping("/product")
public class ProductController {

    private ProductService service;

    @Autowired
    public ProductController(ProductService service) {
        this.service = service;
    }

    @PostMapping("/create")
    public Product create(@RequestBody Product product) {
        return service.create(validated(product));
    }

    /** GET is the documented method; POST is kept for backwards compatibility. */
    @RequestMapping(value = "/read/{productID}", method = {RequestMethod.GET, RequestMethod.POST})
    public Product read(@PathVariable Integer productID) {
        Product product = service.read(productID);
        if (product == null) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Product not found.");
        }
        return product;
    }

    @PutMapping("/update")
    public Product update(@RequestBody Product product) {
        return service.update(validated(product));
    }

    private Product validated(Product p) {
        Product valid = p == null ? null : ProductFactory.createProduct(p.getProductID(), p.getProductName(),
                p.getCategory(), p.getPrice(), p.getQuantityInStock(), p.getLowStockThreshold(),
                p.getUnitOfMeasure(), p.getSupplier(), p.getDescription());
        if (valid == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                    "Product name, category, unit, supplier and description are required and price/stock cannot be negative.");
        }
        return valid;
    }

    @DeleteMapping("/delete/{productID}")
    public boolean delete(@PathVariable Integer productID) {
        return service.delete(productID);
    }

    @GetMapping("/getAll")
    public List<Product> getAll() {
        return service.getAll();
    }
}