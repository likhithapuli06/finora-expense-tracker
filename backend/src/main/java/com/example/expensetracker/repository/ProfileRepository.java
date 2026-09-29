package com.example.expensetracker.repository;

import com.example.expensetracker.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for Profile database operations.
 * Extends Spring Data JPA to provide out-of-the-box CRUD operations on MySQL.
 */
@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {

    /**
     * Retrieves the primary user profile.
     */
    Optional<Profile> findTopByOrderByIdAsc();
}
