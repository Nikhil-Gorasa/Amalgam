package com.amalgam.portfoliotracker.controller;

import com.amalgam.portfoliotracker.dto.LoginRequest;
import com.amalgam.portfoliotracker.dto.RegisterRequest;
import com.amalgam.portfoliotracker.model.User;
import com.amalgam.portfoliotracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
    @Autowired
    private UserService userService;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            User user = userService.login(request.getUsername(), request.getPassword());
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            User user = new User();
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setPassword(request.getPassword());
            User savedUser = userService.register(user);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{userId}/finnhub-key")
    public ResponseEntity<?> saveFinnhubKey(@PathVariable Long userId, @RequestBody Map<String, String> body) {
        try {
            String apiKey = body.get("finnhubKey");
            userService.saveFinnhubKey(userId, apiKey);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error saving API key: " + e.getMessage());
        }
    }

    @GetMapping("/{userId}/finnhub-key")
    public ResponseEntity<?> getFinnhubKey(@PathVariable Long userId) {
        try {
            String apiKey = userService.getFinnhubKey(userId);
            return ResponseEntity.ok(Map.of("finnhubKey", apiKey));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
} 