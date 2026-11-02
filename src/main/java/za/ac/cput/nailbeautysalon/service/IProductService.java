package za.ac.cput.nailbeautysalon.service;
import za.ac.cput.nailbeautysalon.domain.Product;
/*
 IProductService.java
 IProductService Class
 Author: Confidence Khoza (222927402)
 Date: 04 July 2026
 */
import java.util.List;
public interface IProductService<T, ID> {
    T create(T t);

    T read(ID id);

    T update(T t);

    boolean delete(ID id);

    List<Product> getAll();
    List<Product> findByCategory(String category);
}
