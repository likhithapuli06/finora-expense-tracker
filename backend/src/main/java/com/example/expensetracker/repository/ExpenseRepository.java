package com.example.expensetracker.repository;

import com.example.expensetracker.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository interface for Expense database operations.
 *
 * Annotations explained:
 * - @Repository: Indicates that this interface acts as a Data Access Object (DAO).
 *
 * Extending JpaRepository provides ready-to-use CRUD methods:
 * - save(Expense expense): Insert or update
 * - findById(Long id): Find by primary key
 * - findAll(): Retrieve all records
 * - deleteById(Long id): Remove by primary key
 * - count(): Count records
 */
@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    /**
     * Retrieve all expenses sorted by date in descending order (newest first).
     */
    List<Expense> findAllByOrderByDateDesc();

    /**
     * Search expenses where description contains keyword (case-insensitive).
     */
    List<Expense> findByDescriptionContainingIgnoreCaseOrderByDateDesc(String keyword);

    /**
     * Filter expenses by category.
     */
    List<Expense> findByCategoryIgnoreCaseOrderByDateDesc(String category);

    /**
     * Filter expenses by payment method.
     */
    List<Expense> findByPaymentMethodIgnoreCaseOrderByDateDesc(String paymentMethod);

    /**
     * Filter expenses within a specific date range.
     */
    List<Expense> findByDateBetweenOrderByDateDesc(LocalDate startDate, LocalDate endDate);

    /**
     * Calculate sum of all expenses.
     */
    @Query("SELECT COALESCE(SUM(e.amount), 0.0) FROM Expense e")
    Double getTotalExpenseAmount();

    /**
     * Find highest single expense amount.
     */
    @Query("SELECT COALESCE(MAX(e.amount), 0.0) FROM Expense e")
    Double getHighestExpenseAmount();

    /**
     * Calculate sum of expenses for a specific date range (e.g. current month).
     */
    @Query("SELECT COALESCE(SUM(e.amount), 0.0) FROM Expense e WHERE e.date BETWEEN :startDate AND :endDate")
    Double getMonthlyTotal(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
