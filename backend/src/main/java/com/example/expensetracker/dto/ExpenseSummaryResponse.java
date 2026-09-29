package com.example.expensetracker.dto;

import java.util.Map;

/**
 * Data Transfer Object (DTO) for returning aggregated dashboard statistics.
 */
public class ExpenseSummaryResponse {

    private Double totalExpenses;
    private Long totalTransactions;
    private Double currentMonthExpenses;
    private Double highestExpense;
    private Map<String, Double> categoryWiseTotals;
    private Map<String, Double> paymentMethodWiseTotals;

    public ExpenseSummaryResponse() {
    }

    public ExpenseSummaryResponse(Double totalExpenses,
                                  Long totalTransactions,
                                  Double currentMonthExpenses,
                                  Double highestExpense,
                                  Map<String, Double> categoryWiseTotals,
                                  Map<String, Double> paymentMethodWiseTotals) {
        this.totalExpenses = totalExpenses;
        this.totalTransactions = totalTransactions;
        this.currentMonthExpenses = currentMonthExpenses;
        this.highestExpense = highestExpense;
        this.categoryWiseTotals = categoryWiseTotals;
        this.paymentMethodWiseTotals = paymentMethodWiseTotals;
    }

    public Double getTotalExpenses() {
        return totalExpenses;
    }

    public void setTotalExpenses(Double totalExpenses) {
        this.totalExpenses = totalExpenses;
    }

    public Long getTotalTransactions() {
        return totalTransactions;
    }

    public void setTotalTransactions(Long totalTransactions) {
        this.totalTransactions = totalTransactions;
    }

    public Double getCurrentMonthExpenses() {
        return currentMonthExpenses;
    }

    public void setCurrentMonthExpenses(Double currentMonthExpenses) {
        this.currentMonthExpenses = currentMonthExpenses;
    }

    public Double getHighestExpense() {
        return highestExpense;
    }

    public void setHighestExpense(Double highestExpense) {
        this.highestExpense = highestExpense;
    }

    public Map<String, Double> getCategoryWiseTotals() {
        return categoryWiseTotals;
    }

    public void setCategoryWiseTotals(Map<String, Double> categoryWiseTotals) {
        this.categoryWiseTotals = categoryWiseTotals;
    }

    public Map<String, Double> getPaymentMethodWiseTotals() {
        return paymentMethodWiseTotals;
    }

    public void setPaymentMethodWiseTotals(Map<String, Double> paymentMethodWiseTotals) {
        this.paymentMethodWiseTotals = paymentMethodWiseTotals;
    }
}
