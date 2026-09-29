package com.example.expensetracker.service;

import com.example.expensetracker.dto.ExpenseSummaryResponse;
import com.example.expensetracker.exception.ResourceNotFoundException;
import com.example.expensetracker.model.Expense;
import com.example.expensetracker.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service layer containing core business logic.
 *
 * Annotations explained:
 * - @Service: Marks this class as a Spring Service bean, indicating that it holds business logic.
 * - @Autowired: Injects the ExpenseRepository dependency automatically via Spring's Inversion of Control (IoC).
 */
@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    @Autowired
    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    /**
     * 1. Retrieve all expenses, ordered by date descending (newest first).
     */
    public List<Expense> getAllExpenses() {
        return expenseRepository.findAllByOrderByDateDesc();
    }

    /**
     * 2. Retrieve a single expense by ID.
     * Throws ResourceNotFoundException if ID is not present in database.
     */
    public Expense getExpenseById(Long id) {
        return expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with ID: " + id));
    }

    /**
     * 3. Create and save a new expense into MySQL.
     */
    public Expense createExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    /**
     * 4. Update an existing expense in MySQL.
     */
    public Expense updateExpense(Long id, Expense expenseDetails) {
        Expense existingExpense = getExpenseById(id);

        existingExpense.setDescription(expenseDetails.getDescription());
        existingExpense.setAmount(expenseDetails.getAmount());
        existingExpense.setCategory(expenseDetails.getCategory());
        existingExpense.setDate(expenseDetails.getDate());
        existingExpense.setPaymentMethod(expenseDetails.getPaymentMethod());
        existingExpense.setIsRecurring(expenseDetails.getIsRecurring());
        existingExpense.setRecurringFrequency(expenseDetails.getRecurringFrequency());

        return expenseRepository.save(existingExpense);
    }

    /**
     * 5. Delete an expense from MySQL.
     */
    public void deleteExpense(Long id) {
        Expense existingExpense = getExpenseById(id);
        expenseRepository.delete(existingExpense);
    }

    /**
     * 6. Search and filter expenses dynamically.
     */
    public List<Expense> filterExpenses(String keyword, String category, String paymentMethod, LocalDate date) {
        return filterExpenses(keyword, category, paymentMethod, date, null, null, null);
    }

    /**
     * 6b. Search and filter expenses dynamically with date range and recurring options.
     */
    public List<Expense> filterExpenses(String keyword, String category, String paymentMethod, LocalDate date, LocalDate startDate, LocalDate endDate, Boolean isRecurring) {
        List<Expense> allExpenses = expenseRepository.findAllByOrderByDateDesc();

        return allExpenses.stream()
                .filter(e -> keyword == null || keyword.trim().isEmpty() ||
                        e.getDescription().toLowerCase().contains(keyword.trim().toLowerCase()))
                .filter(e -> category == null || category.trim().isEmpty() || category.equalsIgnoreCase("All") ||
                        e.getCategory().equalsIgnoreCase(category.trim()))
                .filter(e -> paymentMethod == null || paymentMethod.trim().isEmpty() || paymentMethod.equalsIgnoreCase("All") ||
                        e.getPaymentMethod().equalsIgnoreCase(paymentMethod.trim()))
                .filter(e -> date == null || e.getDate().equals(date))
                .filter(e -> startDate == null || !e.getDate().isBefore(startDate))
                .filter(e -> endDate == null || !e.getDate().isAfter(endDate))
                .filter(e -> isRecurring == null || e.getIsRecurring().equals(isRecurring))
                .collect(Collectors.toList());
    }

    /**
     * 7. Calculate real-time dashboard summary statistics from MySQL database.
     */
    public ExpenseSummaryResponse getDashboardSummary() {
        List<Expense> allExpenses = expenseRepository.findAll();

        Double totalExpenses = expenseRepository.getTotalExpenseAmount();
        Long totalTransactions = expenseRepository.count();
        Double highestExpense = expenseRepository.getHighestExpenseAmount();

        // Calculate current month's start and end date
        YearMonth currentYearMonth = YearMonth.now();
        LocalDate startOfMonth = currentYearMonth.atDay(1);
        LocalDate endOfMonth = currentYearMonth.atEndOfMonth();
        Double currentMonthExpenses = expenseRepository.getMonthlyTotal(startOfMonth, endOfMonth);

        // Category-wise totals grouping
        Map<String, Double> categoryTotals = new HashMap<>();
        for (Expense e : allExpenses) {
            categoryTotals.put(
                    e.getCategory(),
                    categoryTotals.getOrDefault(e.getCategory(), 0.0) + e.getAmount()
            );
        }

        // Payment method-wise totals grouping
        Map<String, Double> paymentMethodTotals = new HashMap<>();
        for (Expense e : allExpenses) {
            paymentMethodTotals.put(
                    e.getPaymentMethod(),
                    paymentMethodTotals.getOrDefault(e.getPaymentMethod(), 0.0) + e.getAmount()
            );
        }

        return new ExpenseSummaryResponse(
                totalExpenses != null ? totalExpenses : 0.0,
                totalTransactions != null ? totalTransactions : 0L,
                currentMonthExpenses != null ? currentMonthExpenses : 0.0,
                highestExpense != null ? highestExpense : 0.0,
                categoryTotals,
                paymentMethodTotals
        );
    }
}
