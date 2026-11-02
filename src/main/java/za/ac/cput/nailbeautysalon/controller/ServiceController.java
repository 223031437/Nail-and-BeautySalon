package za.ac.cput.nailbeautysalon.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.nailbeautysalon.domain.Service;
import za.ac.cput.nailbeautysalon.exception.ApiException;
import za.ac.cput.nailbeautysalon.factory.ServiceFactory;
import za.ac.cput.nailbeautysalon.service.ServiceService;

import java.util.List;
import java.util.Map;

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

    /** Admin / employee. */
    @PostMapping("/create")
    public Service create(@RequestBody Service service) {
        Service valid = validated(service);
        if (this.service.read(valid.getServiceId()) != null) {
            throw new ApiException(HttpStatus.CONFLICT, "A service with ID '" + valid.getServiceId() + "' already exists.");
        }
        return this.service.create(valid);
    }

    /** Public. */
    @GetMapping("/read/{serviceId}")
    public Service read(@PathVariable String serviceId) {
        Service found = this.service.read(serviceId);
        if (found == null) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Service not found.");
        }
        return found;
    }

    /** Admin / employee. */
    @PutMapping("/update")
    public Service update(@RequestBody Service service) {
        Service valid = validated(service);
        if (this.service.read(valid.getServiceId()) == null) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Service not found.");
        }
        return this.service.update(valid);
    }

    /** Admin / employee. */
    @DeleteMapping("/delete/{serviceId}")
    public Map<String, Object> delete(@PathVariable String serviceId) {
        if (!this.service.delete(serviceId)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Service not found.");
        }
        return Map.of("deleted", true);
    }

    /** Public. */
    @GetMapping("/getAll")
    public List<Service> getAll() {
        return this.service.getAll();
    }

    private Service validated(Service s) {
        Service valid = s == null ? null : ServiceFactory.createService(
                s.getServiceId() == null ? null : s.getServiceId().trim(),
                s.getServiceName() == null ? null : s.getServiceName().trim(),
                s.getCategory() == null ? null : s.getCategory().trim(),
                s.getDescription() == null ? null : s.getDescription().trim(),
                s.getPrice());
        if (valid == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                    "Service ID, name, category, description and a price greater than 0 are all required.");
        }
        return valid;
    }
}
