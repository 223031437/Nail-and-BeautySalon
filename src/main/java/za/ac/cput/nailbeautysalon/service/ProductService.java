package za.ac.cput.nailbeautysalon.service;
/*
 ProductService.java
 Product Service Class
 Author: Confidence Khoza (222927402)
 Date: 04 July 2026
 */
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.nailbeautysalon.domain.Product;
import za.ac.cput.nailbeautysalon.repository.ProductRepository;

import java.util.List;

@Service
public class ProductService implements IProductService<Product, Integer> {

    private ProductRepository repository;

    @Autowired
    ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    @Override
    public Product create(Product product) {
        return this.repository.save(product);
    }

    @Override
    public Product read(Integer productID) {
        return this.repository.findById(productID).orElse(null);
    }

    @Override
    public Product update(Product product) {
        return this.repository.save(product);
    }

    @Override
    public boolean delete(Integer productID) {
        this.repository.deleteById(productID);
        return true;
    }

    @Override
    public List<Product> getAll() {
        return this.repository.findAll();
    }
    public List<Product> findByCategory(String category){ return this.repository.findByCategory(category);}

}

