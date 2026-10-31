package com.nayeem.portfolio.controller;

import com.nayeem.portfolio.service.PortfolioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile() {
        return ResponseEntity.ok(portfolioService.getProfileData());
    }

    @GetMapping("/process")
    public ResponseEntity<List<Map<String, Object>>> getProcess() {
        return ResponseEntity.ok(portfolioService.getProcessSteps());
    }

    @GetMapping("/works")
    public ResponseEntity<List<Map<String, Object>>> getWorks() {
        return ResponseEntity.ok(portfolioService.getSelectedWorks());
    }

    @GetMapping("/services")
    public ResponseEntity<List<Map<String, Object>>> getServices() {
        return ResponseEntity.ok(portfolioService.getServices());
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of("status", "UP", "message", "Portfolio API is functioning smoothly"));
    }
}
