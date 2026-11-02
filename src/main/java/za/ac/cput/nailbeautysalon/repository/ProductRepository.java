package za.ac.cput.nailbeautysalon.repository;
/*
 ProductRepository.java
 Product Repository Class
 Author: Confidence Khoza (222927402)
 Date: 04 July 2026
 */

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.cput.nailbeautysalon.domain.Product;

import java.util.List;

    @Repository
    public interface ProductRepository extends JpaRepository<Product, Integer> {

        List<Product> findByCategory(String category);
    }

