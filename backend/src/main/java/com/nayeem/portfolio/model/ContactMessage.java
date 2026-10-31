package com.nayeem.portfolio.model;

import java.time.LocalDateTime;

public class ContactMessage {
    private String id;
    private String name;
    private String email;
    private String projectType;
    private String budget;
    private String message;
    private LocalDateTime timestamp;

    public ContactMessage() {
        this.timestamp = LocalDateTime.now();
    }

    public ContactMessage(String id, String name, String email, String projectType, String budget, String message) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.projectType = projectType;
        this.budget = budget;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getProjectType() { return projectType; }
    public void setProjectType(String projectType) { this.projectType = projectType; }

    public String getBudget() { return budget; }
    public void setBudget(String budget) { this.budget = budget; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
