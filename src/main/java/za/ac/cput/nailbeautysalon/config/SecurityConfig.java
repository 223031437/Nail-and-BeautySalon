package za.ac.cput.nailbeautysalon.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;
import za.ac.cput.nailbeautysalon.security.JwtAuthFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private static final String ADMIN    = "ROLE_ADMIN";
    private static final String EMPLOYEE = "ROLE_EMPLOYEE";
    private static final String CUSTOMER = "ROLE_CUSTOMER";

    private final CorsConfigurationSource corsConfigurationSource;
    private final JwtAuthFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;

    public SecurityConfig(CorsConfigurationSource corsConfigurationSource,
                          JwtAuthFilter jwtAuthFilter,
                          UserDetailsService userDetailsService) {
        this.corsConfigurationSource = corsConfigurationSource;
        this.jwtAuthFilter = jwtAuthFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // A missing/expired token is a 401 (so the frontend sends the user to the login page);
            // a logged-in user without the right role gets a 403.
            .exceptionHandling(e -> e.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
            .authorizeHttpRequests(auth -> auth
                // Browser pre-flight requests
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/error").permitAll()

                // ---------- AUTH ----------
                .requestMatchers("/auth/register-employee").hasAuthority(ADMIN)   // only the admin registers employees
                .requestMatchers("/auth/**").permitAll()                           // login + customer registration

                // ---------- PUBLIC (website visitors) ----------
                .requestMatchers(HttpMethod.GET, "/service/getAll", "/service/read/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/product/getAll").permitAll()
                .requestMatchers(HttpMethod.GET, "/product/read/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/appointment/availability").permitAll()
                .requestMatchers(HttpMethod.POST, "/inquiry").permitAll()          // Contact page form
                .requestMatchers(HttpMethod.GET, "/contact/**").permitAll()

                // ---------- CUSTOMER ----------
                .requestMatchers("/appointment/create", "/appointment/mine").hasAuthority(CUSTOMER)
                .requestMatchers(HttpMethod.POST, "/order/create").hasAuthority(CUSTOMER)
                .requestMatchers(HttpMethod.GET, "/order/mine").hasAuthority(CUSTOMER)

                    // ---------- ADMIN ONLY ----------
                .requestMatchers(HttpMethod.PUT, "/payment/*/status").hasAuthority(ADMIN)
                .requestMatchers("/employee/create", "/employee/update", "/employee/delete/**").hasAuthority(ADMIN)
                .requestMatchers("/appointment/delete/**").hasAuthority(ADMIN)
                .requestMatchers(HttpMethod.DELETE, "/inquiry/**").hasAuthority(ADMIN)
                .requestMatchers("/contact/**").hasAuthority(ADMIN)

                // ---------- ADMIN + EMPLOYEE ----------
                .requestMatchers("/appointment/getAll", "/appointment/*/status").hasAnyAuthority(ADMIN, EMPLOYEE)
                .requestMatchers("/payment/**").hasAnyAuthority(ADMIN, EMPLOYEE)
                .requestMatchers("/inquiry/**").hasAnyAuthority(ADMIN, EMPLOYEE)
                .requestMatchers("/employee/**").hasAnyAuthority(ADMIN, EMPLOYEE)
                .requestMatchers("/service/**", "/product/**").hasAnyAuthority(ADMIN, EMPLOYEE)
                .requestMatchers("/customer/getAll", "/customer/create").hasAnyAuthority(ADMIN, EMPLOYEE)
                .requestMatchers("/appointment/getAll", "/appointment/*/status").hasAnyAuthority(ADMIN, EMPLOYEE)
                .requestMatchers(HttpMethod.GET, "/order/getAll").hasAnyAuthority(ADMIN, EMPLOYEE)
                .requestMatchers(HttpMethod.PUT, "/order/**").hasAnyAuthority(ADMIN, EMPLOYEE)

                // ---------- EVERYTHING ELSE NEEDS A LOGIN ----------
                // (/appointment/{id}/reschedule|cancel, /appointment/read/**, /customer/read|update|delete
                //  also check in the code that a customer only touches their OWN records)
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
