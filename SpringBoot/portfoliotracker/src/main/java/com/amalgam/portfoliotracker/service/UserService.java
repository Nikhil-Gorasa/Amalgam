package com.amalgam.portfoliotracker.service;

import com.amalgam.portfoliotracker.model.User;
import com.amalgam.portfoliotracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User login(String username, String password) {
        return userRepository.findByUsername(username)
            .filter(user -> user.getPassword().equals(password))
            .orElseThrow(() -> new RuntimeException("Invalid credentials"));
    }

    public User register(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        return userRepository.save(user);
    }

    public void saveFinnhubKey(Long userId, String apiKey) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setFinnhubApiKey(apiKey);
        userRepository.save(user);
    }

    public String getFinnhubKey(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getFinnhubApiKey();
    }
} 