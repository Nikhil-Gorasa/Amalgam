package com.amalgam.portfoliotracker.controller;

import com.amalgam.portfoliotracker.model.Stock;
import com.amalgam.portfoliotracker.repository.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stocks")
@CrossOrigin(origins = "http://localhost:5173")
public class StockController {
    @Autowired
    private StockRepository stockRepository;

    @PostMapping
    public ResponseEntity<Stock> addStock(@RequestBody Stock stock) {
        stock.setCreatedAt(LocalDateTime.now());
        Stock savedStock = stockRepository.save(stock);
        return ResponseEntity.ok(savedStock);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Stock>> getUserStocks(@PathVariable Long userId) {
        List<Stock> stocks = stockRepository.findByUserId(userId);
        stocks.forEach(stock -> 
            System.out.println("Stock: id=" + stock.getId() + ", ticker=" + stock.getTicker())
        );
        return ResponseEntity.ok(stocks);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStock(@PathVariable Long id, @RequestBody Map<String, Long> body) {
        try {
            Long userId = body.get("userId");
            System.out.println("Deleting stock: id=" + id + ", userId=" + userId);
            
            if (userId == null) {
                return ResponseEntity.badRequest().body("userId is required");
            }

            Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock not found with id: " + id));
                
            if (!stock.getUserId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("User not authorized to delete this stock");
            }
            
            stockRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error deleting stock: " + e.getMessage());
        }
    }
} 