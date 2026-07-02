package za.ac.cput.nailbeautysalon.repository;
/* EmployeeRepository.java
Employee Repository class
Author: Vincent Kanzi(221188932)
Date: 02 July 2026
*/
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.cput.nailbeautysalon.domain.Employee;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, String> {
    List<Employee> findEmployeeBy(String email);

    String userId(String userId);
}
