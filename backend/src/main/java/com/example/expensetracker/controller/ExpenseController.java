package com.example.expensetracker.controller;

import com.example.expensetracker.dto.ExpenseSummaryResponse;
import com.example.expensetracker.model.Expense;
import com.example.expensetracker.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * REST Controller exposing API endpoints for managing expenses.
 *
 * Annotations explained:
 * - @RestController: Marks this class as a RESTful web service controller where methods return JSON directly.
 * - @RequestMapping("/api/expenses"): Base path for all endpoints in this controller.
 * - @CrossOrigin(origins = "*"): Enables Cross-Origin Resource Sharing so browser frontends can call this API.
 * - @GetMapping, @PostMapping, @PutMapping, @DeleteMapping: Map HTTP methods to Java handler methods.
 * - @Valid: Triggers Bean Validation on the incoming JSON payload before the method body runs.
 * - @RequestBody: Deserializes the incoming JSON request body into a Java Expense object.
 * - @PathVariable: Extracts parameters from the URL path (e.g. {id}).
 */
@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "*")
public class ExpenseController {

    private final ExpenseService expenseService;

    @Autowired
    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    /**
     * 1. GET /api/expenses
     * Retrieve all expenses, or filter by search keyword, category, payment method, or date.
     *
     * Example: GET /api/expenses?category=Food&search=coffee
     */
    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String paymentMethod,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Boolean isRecurring) {

        // If any filter parameter is provided, use filter method; otherwise return all
        if ((search != null && !search.trim().isEmpty()) ||
            (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("All")) ||
            (paymentMethod != null && !paymentMethod.trim().isEmpty() && !paymentMethod.equalsIgnoreCase("All")) ||
            date != null || startDate != null || endDate != null || isRecurring != null) {
            return ResponseEntity.ok(expenseService.filterExpenses(search, category, paymentMethod, date, startDate, endDate, isRecurring));
        }

        return ResponseEntity.ok(expenseService.getAllExpenses());
    }

    /**
     * 2. GET /api/expenses/{id}
     * Retrieve a single expense by its ID.
     * Returns 200 OK with Expense JSON, or 404 Not Found if missing.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Expense> getExpenseById(@PathVariable Long id) {
        return ResponseEntity.ok(expenseService.getExpenseById(id));
    }

    /**
     * 3. POST /api/expenses
     * Create a new expense.
     * Validates incoming data and returns 201 CREATED with the saved Expense (including generated ID).
     */
    @PostMapping
    public ResponseEntity<Expense> createExpense(@Valid @RequestBody Expense expense) {
        Expense savedExpense = expenseService.createExpense(expense);
        return new ResponseEntity<>(savedExpense, HttpStatus.CREATED);
    }

    /**
     * 4. PUT /api/expenses/{id}
     * Update an existing expense by ID.
     * Validates data, updates in MySQL, and returns 200 OK with updated Expense.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(
            @PathVariable Long id,
            @Valid @RequestBody Expense expenseDetails) {
        Expense updated = expenseService.updateExpense(id, expenseDetails);
        return ResponseEntity.ok(updated);
    }

    /**
     * 5. DELETE /api/expenses/{id}
     * Delete an expense by ID.
     * Returns 200 OK with confirmation message or 204 No Content.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * 6. GET /api/expenses/summary
     * Retrieve calculated dashboard metrics (Total expenses, count, current month spending, highest, category breakdown).
     */
    @GetMapping("/summary")
    public ResponseEntity<ExpenseSummaryResponse> getDashboardSummary() {
        return ResponseEntity.ok(expenseService.getDashboardSummary());
    }
}
