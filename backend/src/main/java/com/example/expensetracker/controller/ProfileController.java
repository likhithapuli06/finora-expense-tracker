package com.example.expensetracker.controller;

import com.example.expensetracker.model.Profile;
import com.example.expensetracker.repository.ProfileRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * REST Controller for managing user Profile information.
 *
 * Endpoints:
 * - GET /api/profile : Fetch current user profile (displayName, email, createdAt, updatedAt)
 * - PUT /api/profile : Update user profile (validates non-empty displayName)
 */
@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class ProfileController {

    private final ProfileRepository profileRepository;

    @Autowired
    public ProfileController(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    /**
     * GET /api/profile
     * Returns the active user profile or initializes a default if empty.
     */
    @GetMapping
    public ResponseEntity<Profile> getProfile() {
        Profile profile = profileRepository.findTopByOrderByIdAsc()
                .orElseGet(() -> {
                    Profile defaultProfile = new Profile("Likhitha Puli", "likhithapuli2006@gmail.com");
                    return profileRepository.save(defaultProfile);
                });

        return ResponseEntity.ok(profile);
    }

    /**
     * PUT /api/profile
     * Updates the user's display name and optional email.
     */
    @PutMapping
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> request) {
        String displayName = request.get("displayName");
        if (displayName == null || displayName.trim().isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Display name cannot be empty");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        Profile profile = profileRepository.findTopByOrderByIdAsc()
                .orElseGet(() -> new Profile("Likhitha Puli", "likhithapuli2006@gmail.com"));

        profile.setDisplayName(displayName.trim());
        if (request.containsKey("email") && request.get("email") != null && !request.get("email").trim().isEmpty()) {
            profile.setEmail(request.get("email").trim());
        }

        Profile saved = profileRepository.save(profile);
        return ResponseEntity.ok(saved);
    }
}
