package com.campusconnect.config;

import com.campusconnect.entity.Activity;
import com.campusconnect.entity.User;
import com.campusconnect.repository.ActivityRepository;
import com.campusconnect.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDate;
import java.util.Arrays;

@Configuration
public class DataSeeder {

    private final PasswordEncoder passwordEncoder;
    private final ActivityRepository activityRepository;

    public DataSeeder(PasswordEncoder passwordEncoder, ActivityRepository activityRepository) {
        this.passwordEncoder = passwordEncoder;
        this.activityRepository = activityRepository;
    }

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository) {
        return args -> {
            // Always ensure one and only one ADMIN exists
            String adminEmail = "admin@campus.edu";
            User admin = userRepository.findByEmail(adminEmail).orElse(null);

            if (admin == null) {
                admin = new User();
                admin.setName("Super Admin");
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(User.Role.ADMIN);
                admin.setDepartment("Administration");
                admin.setAvatar("SA");
                admin.setJoinedAt(LocalDate.now());
                admin = userRepository.save(admin);
                System.out.println("✅ Admin account seeded: " + adminEmail);
            } else {
                System.out.println("✅ Admin account already exists in DB.");
            }

            // Seed raw activity data if empty
            if (activityRepository.count() == 0) {
                Activity a1 = new Activity();
                a1.setTitle("Annual Tech Fest 2024");
                a1.setDescription("Largest technical symposium with workshops, coding contests and hackathons.");
                a1.setCategory("Event");
                a1.setDate(LocalDate.now().plusDays(15));
                a1.setTime("10:00 AM");
                a1.setLocation("Main Auditorium & CSE Blocks");
                a1.setMaxParticipants(500);
                a1.setCurrentParticipants(0);
                a1.setCreatedBy(admin);
                a1.setFeatured(true);
                a1.setColor("#8b5cf6");
                a1.setGradient("linear-gradient(135deg, #8b5cf6, #d946ef)");

                Activity a2 = new Activity();
                a2.setTitle("Inter-College Cricket League");
                a2.setDescription("Test your skills in the campus cricket championship. 11-a-side matches.");
                a2.setCategory("Sport");
                a2.setDate(LocalDate.now().plusDays(7));
                a2.setTime("08:30 AM");
                a2.setLocation("Campus Grounds");
                a2.setMaxParticipants(100);
                a2.setCurrentParticipants(0);
                a2.setCreatedBy(admin);
                a2.setFeatured(false);
                a2.setColor("#34d399");
                a2.setGradient("linear-gradient(135deg, #34d399, #10b981)");

                Activity a3 = new Activity();
                a3.setTitle("Music Club Orientation");
                a3.setDescription("Join the official college music band. New members and vocalists welcome.");
                a3.setCategory("Club");
                a3.setDate(LocalDate.now().plusDays(2));
                a3.setTime("04:30 PM");
                a3.setLocation("Arts Block Room 102");
                a3.setMaxParticipants(50);
                a3.setCurrentParticipants(0);
                a3.setCreatedBy(admin);
                a3.setFeatured(true);
                a3.setColor("#fbbf24");
                a3.setGradient("linear-gradient(135deg, #fbbf24, #f59e0b)");

                activityRepository.saveAll(Arrays.asList(a1, a2, a3));
                System.out.println("✅ Sample Activity data seeded.");
            }
        };
    }
}
