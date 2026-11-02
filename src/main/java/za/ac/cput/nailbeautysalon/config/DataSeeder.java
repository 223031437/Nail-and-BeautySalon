package za.ac.cput.nailbeautysalon.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import za.ac.cput.nailbeautysalon.domain.Account;
import za.ac.cput.nailbeautysalon.domain.Role;
import za.ac.cput.nailbeautysalon.domain.Service;
import za.ac.cput.nailbeautysalon.repository.AccountRepository;
import za.ac.cput.nailbeautysalon.repository.ServiceRepository;

import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Runs on every start-up:
 *  1. makes sure the admin login exists (username/password come from application.properties),
 *  2. fills the services table the first time so customers have something to book.
 */
@Configuration
public class DataSeeder {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    @Value("${app.admin.username:admin@nailbeautysalon.co.za}")
    private String adminUsername;

    @Value("${app.admin.password:Login@2026}")
    private String adminPassword;

    @Bean
    public CommandLineRunner seedAdmin(AccountRepository accountRepository,
                                       PasswordEncoder passwordEncoder) {
        return args -> {
            String username = adminUsername.trim().toLowerCase();

            if (accountRepository.existsByUsername(username)) {
                log.info("Admin account '{}' already exists - skipping seed.", username);
                return;
            }

            // Earlier versions created the admin as plain "admin" (which cannot be typed into the
            // email field of the login page). Rename that account instead of creating a second admin.
            Optional<Account> legacy = accountRepository.findByUsername("admin");
            if (legacy.isPresent() && legacy.get().getRole() == Role.ROLE_ADMIN) {
                Account old = legacy.get();
                old.setUsername(username);
                accountRepository.save(old);
                log.info("Renamed legacy admin account 'admin' to '{}' (password unchanged).", username);
                return;
            }

            Account admin = new Account.Builder()
                    .setUsername(username)
                    .setPassword(passwordEncoder.encode(adminPassword))
                    .setRole(Role.ROLE_ADMIN)
                    .build();
            accountRepository.save(admin);
            log.info("Seeded admin account: username='{}' - CHANGE THE PASSWORD IN PRODUCTION", username);
        };
    }

    @Bean
    public CommandLineRunner seedServices(ServiceRepository serviceRepository, ObjectMapper objectMapper) {
        return args -> {
            if (serviceRepository.count() > 0) {
                return;
            }
            try (InputStream in = new ClassPathResource("seed/services.json").getInputStream()) {
                List<Map<String, Object>> rows = objectMapper.readValue(in, new TypeReference<List<Map<String, Object>>>() {});
                for (Map<String, Object> row : rows) {
                    serviceRepository.save(new Service.Builder()
                            .setServiceId(String.valueOf(row.get("serviceId")))
                            .setServiceName(String.valueOf(row.get("serviceName")))
                            .setCategory(String.valueOf(row.get("category")))
                            .setDescription(String.valueOf(row.get("description")))
                            .setPrice(((Number) row.get("price")).doubleValue())
                            .build());
                }
                log.info("Seeded {} services.", rows.size());
            } catch (Exception e) {
                log.error("Could not seed services: {}", e.getMessage());
            }
        };
    }
}
