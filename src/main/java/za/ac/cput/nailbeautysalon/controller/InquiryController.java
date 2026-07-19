package za.ac.cput.nailbeautysalon.controller;
/* InquiryController.java
Inquiry Controller class
Author: Mbali Hlaba (223031437)
Date: 21 July 2026 */

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.nailbeautysalon.domain.Inquiry;
import za.ac.cput.nailbeautysalon.service.InquiryService;

@RestController
@RequestMapping
public class InquiryController {

    private InquiryService service;

    @Autowired
    InquiryController(InquiryService service){
        this.service = service;
    }

    @PostMapping
    public Inquiry create(@RequestBody Inquiry inquiry){
        return service.create(inquiry);
    }

    @GetMapping("/{id}")
    public Inquiry read(@PathVariable String id){
        return service.read(id);
    }

    @DeleteMapping("/{id}")
    public boolean delete(@PathVariable String id){
        service.delete(id);
        return false;
    }
}
