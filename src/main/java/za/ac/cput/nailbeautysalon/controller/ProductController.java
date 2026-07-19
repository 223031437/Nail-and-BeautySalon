package za.ac.cput.nailbeautysalon.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.nailbeautysalon.domain.Product;
import za.ac.cput.nailbeautysalon.service.ProductService;

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
        return service.create(product);
    }

    @PostMapping("/read/{productID}")
    public Product read(@PathVariable Integer productID) {
        return service.read(productID);
    }

    @PutMapping("/update")
    public Product update(@RequestBody Product product) {
        return service.update(product);
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