package za.ac.cput.nailbeautysalon.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.nailbeautysalon.domain.Service;
import za.ac.cput.nailbeautysalon.service.ServiceService;

import java.util.List;

/**
 * author: Nandipha Galada
 * student number: 221225366
 * date: 15 July 2026
 * ServiceController class for managing Service operations
 */

@RestController
@RequestMapping("/service")
public class ServiceController {

    private ServiceService service;

    @Autowired
    public ServiceController(ServiceService service) {
        this.service = service;
    }

    @PostMapping("/create")
    public Service create(@RequestBody Service service) {
        return this.service.create(service);
    }

    @GetMapping("/{serviceId}")
    public Service read(@PathVariable String serviceId) {
        return this.service.read(serviceId);
    }

    @PutMapping("/update")
    public Service update(@RequestBody Service service) {
        return this.service.update(service);
    }

    @DeleteMapping("/delete/{serviceId}")
    public boolean delete(@PathVariable String serviceId) {
        return this.service.delete(serviceId);
    }

    @GetMapping("/getAll")
    public List<Service> getAll() {
        return this.service.getAll();
    }
}
