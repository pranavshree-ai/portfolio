package com.nayeem.portfolio.service;

import com.nayeem.portfolio.model.ContactMessage;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class PortfolioService {

    private final List<ContactMessage> messages = new CopyOnWriteArrayList<>();

    public Map<String, Object> getProfileData() {
        Map<String, Object> profile = new LinkedHashMap<>();
        profile.put("name", "NAYEEM");
        profile.put("title", "UI/UX DESIGNER");
        profile.put("role", "Senior Product Designer & Design Strategist");
        profile.put("availability", "AVAILABLE FOR WORK");
        profile.put("location", "Dhaka, Bangladesh");
        profile.put("workModes", List.of("AVAILABLE FOR WORK", "FULL TIME REMOTE", "FREELANCE"));
        profile.put("heroBio", "I'm a senior UI/UX Designer who cares about solving real problems through thoughtful design. I focus on understanding users, simplifying complex ideas, and transforming them into intuitive digital experiences.");

        Map<String, Object> metrics = new LinkedHashMap<>();
        metrics.put("projects", "100+");
        metrics.put("experience", "5+");
        metrics.put("satisfaction", "99%");
        metrics.put("rating", "4.9/5");
        profile.put("metrics", metrics);

        return profile;
    }

    public List<Map<String, Object>> getProcessSteps() {
        List<Map<String, Object>> steps = new ArrayList<>();

        steps.add(Map.of(
            "step", "01",
            "title", "RESEARCH & STRATEGY",
            "description", "Deep diving into user behavior, market landscape, and stakeholders needs to craft an actionable strategic roadmap.",
            "image", "/images/process_01.jpg"
        ));
        steps.add(Map.of(
            "step", "02",
            "title", "WIREFRAMING",
            "description", "Drafting clear user journeys, information architecture, and rapid low-fidelity layout blueprints.",
            "image", "/images/process_02.jpg"
        ));
        steps.add(Map.of(
            "step", "03",
            "title", "UI DESIGN",
            "description", "Crafting visually striking, pixel-perfect visual interfaces with crisp typography, color harmony, and emotional resonance.",
            "image", "/images/process_03.jpg"
        ));
        steps.add(Map.of(
            "step", "04",
            "title", "PROTOTYPING",
            "description", "Building interactive micro-interactions and realistic clickable user simulations to validate concepts early.",
            "image", "/images/process_04.jpg"
        ));
        steps.add(Map.of(
            "step", "05",
            "title", "DESIGN SYSTEM",
            "description", "Developing scalable atomic tokens, component libraries, and documentation for seamless multi-platform consistency.",
            "image", "/images/process_05.jpg"
        ));
        steps.add(Map.of(
            "step", "06",
            "title", "TESTING & HANDOFF",
            "description", "Validating with real users, finalizing accessibility audits, and delivering pixel-perfect dev-ready Figma specs.",
            "image", "/images/process_06.jpg"
        ));

        return steps;
    }

    public List<Map<String, Object>> getSelectedWorks() {
        List<Map<String, Object>> works = new ArrayList<>();

        works.add(Map.of(
            "id", "work-1",
            "number", "01",
            "category", "SAAS PLATFORM / AI WORKFLOW",
            "title", "NEXUS AI STUDIO",
            "description", "Next-gen generative AI workflow tool designed for creative studios and design engineering teams.",
            "image", "/images/work_01.jpg",
            "tags", List.of("AI Workflow", "Web Platform", "Design System"),
            "color", "#9333ea"
        ));

        works.add(Map.of(
            "id", "work-2",
            "number", "02",
            "category", "FINTECH / ENTERPRISE DASHBOARD",
            "title", "ORANGE ANALYTICS",
            "description", "Comprehensive financial intelligence dashboard empowering real-time data insights and portfolio forecasting.",
            "image", "/images/work_02.jpg",
            "tags", List.of("Fintech", "Data Viz", "UX Architecture"),
            "color", "#ff5b26"
        ));

        works.add(Map.of(
            "id", "work-3",
            "number", "03",
            "category", "MOBILE APPLICATION / CRYPTO",
            "title", "AURORA WALLET",
            "description", "Decentralized crypto and asset management experience crafted with frictionless micro-interactions and security.",
            "image", "/images/work_03.jpg",
            "tags", List.of("iOS / Android", "Crypto", "Micro-Interactions"),
            "color", "#eab308"
        ));

        return works;
    }

    public List<Map<String, Object>> getServices() {
        List<Map<String, Object>> services = new ArrayList<>();

        services.add(Map.of(
            "id", "srv-1",
            "title", "UI/UX DESIGN",
            "subtitle", "Modern Web & Product Experiences",
            "description", "Crafting intuitive web interfaces and responsive experiences that drive retention and high conversion rates.",
            "image", "/images/service_01.jpg"
        ));

        services.add(Map.of(
            "id", "srv-2",
            "title", "APP DESIGN",
            "subtitle", "Native iOS & Android Experiences",
            "description", "End-to-end mobile product design optimized for seamless ergonomics, fluid gestures, and app store success.",
            "image", "/images/service_02.jpg"
        ));

        services.add(Map.of(
            "id", "srv-3",
            "title", "MOBILE APP DESIGN",
            "subtitle", "High-Tech Dark & Modern Interfaces",
            "description", "Specialized mobile UI crafted with micro-animations, tactile feedback, and modern visual hierarchy.",
            "image", "/images/service_03.jpg"
        ));

        services.add(Map.of(
            "id", "srv-4",
            "title", "DASHBOARD DESIGN",
            "subtitle", "Data Visualization & B2B SaaS",
            "description", "Transforming complex datasets and multi-tenant workflows into clean, digestible visual dashboards.",
            "image", "/images/service_04.jpg"
        ));

        services.add(Map.of(
            "id", "srv-5",
            "title", "VISUAL BRANDING",
            "subtitle", "Identity, Guidelines & Typography",
            "description", "Distinctive visual identities, bespoke icon sets, and cohesive brand design kits that make brands unforgettable.",
            "image", "/images/service_05.jpg"
        ));

        services.add(Map.of(
            "id", "srv-6",
            "title", "UX AUDIT & CRO",
            "subtitle", "Heuristic Evaluation & Usability",
            "description", "Thorough heuristic evaluation identifying user friction points, boosting accessibility and conversion rates.",
            "image", "/images/service_06.jpg"
        ));

        return services;
    }

    public ContactMessage saveContactMessage(ContactMessage message) {
        if (message.getId() == null || message.getId().isBlank()) {
            message.setId(UUID.randomUUID().toString());
        }
        messages.add(message);
        return message;
    }

    public List<ContactMessage> getMessages() {
        return Collections.unmodifiableList(messages);
    }
}
