package com.example.expensetracker.repository;

import com.example.expensetracker.model.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for Budget database operations.
 */
@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {

    /**
     * Find the most recent active budget.
     */
    Optional<Budget> findTopByOrderByIdDesc();

    /**
     * Find budget specifically configured for a target month (e.g. "2026-09").
     */
    Optional<Budget> findByTargetMonth(String targetMonth);
}
