package com.example.expensetracker.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

/**
 * Entity class representing a Monthly Budget target in MySQL database.
 * Allows users to define a monthly spending target (e.g. ₹10,000)
 * and compare it against their real-time monthly expenses.
 */
@Entity
@Table(name = "budgets")
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Monthly budget amount is required")
    @DecimalMin(value = "1.00", message = "Budget must be at least 1.00")
    @Column(nullable = false)
    private Double monthlyBudget;

    @Column(name = "target_month", length = 7)
    private String targetMonth; // e.g. "2026-09" or null for general default

    public Budget() {
    }

    public Budget(Double monthlyBudget) {
        this.monthlyBudget = monthlyBudget;
    }

    public Budget(Double monthlyBudget, String targetMonth) {
        this.monthlyBudget = monthlyBudget;
        this.targetMonth = targetMonth;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getMonthlyBudget() {
        return monthlyBudget;
    }

    public void setMonthlyBudget(Double monthlyBudget) {
        this.monthlyBudget = monthlyBudget;
    }

    public String getTargetMonth() {
        return targetMonth;
    }

    public void setTargetMonth(String targetMonth) {
        this.targetMonth = targetMonth;
    }
}
