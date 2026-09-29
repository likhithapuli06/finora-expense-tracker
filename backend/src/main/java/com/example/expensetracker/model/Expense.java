package com.example.expensetracker.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

/**
 * Entity class representing an Expense record in the MySQL database.
 *
 * Annotations explained:
 * - @Entity: Marks this Java class as a JPA entity mapped to a database table.
 * - @Table(name = "expenses"): Specifies the table name in MySQL.
 * - @Id: Marks the primary key field.
 * - @GeneratedValue(strategy = GenerationType.IDENTITY): Configures MySQL AUTO_INCREMENT behavior.
 * - @NotBlank / @NotNull / @DecimalMin: Bean validation annotations to ensure valid data.
 */
@Entity
@Table(name = "expenses")
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Description cannot be empty")
    @Column(nullable = false)
    private String description;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    @Column(nullable = false)
    private Double amount;

    @NotBlank(message = "Category is required")
    @Column(nullable = false)
    private String category;

    @NotNull(message = "Date is required")
    @Column(nullable = false)
    private LocalDate date;

    @NotBlank(message = "Payment method is required")
    @Column(name = "payment_method", nullable = false)
    private String paymentMethod;

    @Column(name = "is_recurring")
    private Boolean isRecurring = false;

    @Column(name = "recurring_frequency")
    private String recurringFrequency; // "Weekly", "Monthly", "Yearly"

    // Default constructor (required by JPA/Hibernate)
    public Expense() {
    }

    // Parameterized constructor for easy instantiation
    public Expense(String description, Double amount, String category, LocalDate date, String paymentMethod) {
        this.description = description;
        this.amount = amount;
        this.category = category;
        this.date = date;
        this.paymentMethod = paymentMethod;
        this.isRecurring = false;
    }

    public Expense(String description, Double amount, String category, LocalDate date, String paymentMethod, Boolean isRecurring, String recurringFrequency) {
        this.description = description;
        this.amount = amount;
        this.category = category;
        this.date = date;
        this.paymentMethod = paymentMethod;
        this.isRecurring = isRecurring != null ? isRecurring : false;
        this.recurringFrequency = recurringFrequency;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public Boolean getIsRecurring() {
        return isRecurring != null && isRecurring;
    }

    public void setIsRecurring(Boolean isRecurring) {
        this.isRecurring = isRecurring;
    }

    public String getRecurringFrequency() {
        return recurringFrequency;
    }

    public void setRecurringFrequency(String recurringFrequency) {
        this.recurringFrequency = recurringFrequency;
    }

    @Override
    public String toString() {
        return "Expense{" +
                "id=" + id +
                ", description='" + description + '\'' +
                ", amount=" + amount +
                ", category='" + category + '\'' +
                ", date=" + date +
                ", paymentMethod='" + paymentMethod + '\'' +
                ", isRecurring=" + isRecurring +
                ", recurringFrequency='" + recurringFrequency + '\'' +
                '}';
    }
}
