package com.voyageai.repository;

import com.voyageai.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, UUID> {
    
    List<Expense> findByItineraryIdOrderByDateDesc(UUID itineraryId);
    
    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.itinerary.id = :itineraryId")
    BigDecimal getTotalExpenses(UUID itineraryId);
    
    @Query("SELECT e.category, SUM(e.amount) FROM Expense e WHERE e.itinerary.id = :itineraryId GROUP BY e.category")
    List<Object[]> getExpensesByCategory(UUID itineraryId);
    
    void deleteByItineraryId(UUID itineraryId);
}
