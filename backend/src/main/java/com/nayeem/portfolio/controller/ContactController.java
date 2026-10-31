package com.nayeem.portfolio.controller;

import com.nayeem.portfolio.model.ContactMessage;
import com.nayeem.portfolio.service.PortfolioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final PortfolioService portfolioService;

    public ContactController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> submitMessage(@RequestBody ContactMessage message) {
        ContactMessage saved = portfolioService.saveContactMessage(message);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Thank you! Your message has been received. Nayeem will get in touch shortly.",
            "data", saved
        ));
    }

    @GetMapping
    public ResponseEntity<List<ContactMessage>> getAllMessages() {
        return ResponseEntity.ok(portfolioService.getMessages());
    }
}
