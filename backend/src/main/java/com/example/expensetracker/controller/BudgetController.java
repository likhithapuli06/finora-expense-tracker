package com.example.expensetracker.controller;

import com.example.expensetracker.model.Budget;
import com.example.expensetracker.repository.BudgetRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * REST Controller for managing monthly spending budget.
 *
 * Endpoints:
 * - GET  /api/budget : Fetch the current monthly budget (defaults to ₹10,000)
 * - POST /api/budget : Set or update the monthly budget
 */
@RestController
@RequestMapping("/api/budget")
@CrossOrigin(origins = "*")
public class BudgetController {

    private final BudgetRepository budgetRepository;

    @Autowired
    public BudgetController(BudgetRepository budgetRepository) {
        this.budgetRepository = budgetRepository;
    }

    /**
     * GET /api/budget
     * Returns the active monthly budget target.
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getBudget() {
        Budget budget = budgetRepository.findTopByOrderByIdDesc()
                .orElse(new Budget(10000.00));

        Map<String, Object> response = new HashMap<>();
        response.put("monthlyBudget", budget.getMonthlyBudget());
        response.put("targetMonth", budget.getTargetMonth());
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/budget
     * Save or update the monthly budget.
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> setBudget(@Valid @RequestBody Budget budgetRequest) {
        Budget existing = budgetRepository.findTopByOrderByIdDesc().orElse(null);
        Budget toSave;
        if (existing != null) {
            existing.setMonthlyBudget(budgetRequest.getMonthlyBudget());
            if (budgetRequest.getTargetMonth() != null) {
                existing.setTargetMonth(budgetRequest.getTargetMonth());
            }
            toSave = existing;
        } else {
            toSave = budgetRequest;
        }

        Budget saved = budgetRepository.save(toSave);

        Map<String, Object> response = new HashMap<>();
        response.put("monthlyBudget", saved.getMonthlyBudget());
        response.put("targetMonth", saved.getTargetMonth());
        response.put("message", "Monthly budget updated successfully");
        return ResponseEntity.ok(response);
    }
}
