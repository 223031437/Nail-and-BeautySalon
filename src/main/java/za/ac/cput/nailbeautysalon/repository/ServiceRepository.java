package za.ac.cput.nailbeautysalon.repository;

/**
 * author: Nandipha Galada
 * student number: 221225366
 * date: 03 July 2026
 * Interface for Service
 */

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.cput.nailbeautysalon.domain.Service;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Service, String> {
    List<Service> findByServiceNameIgnoreCase(String serviceName);
}
