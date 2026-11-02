package za.ac.cput.nailbeautysalon.dto;

public record LoginResponse(String token, String role, String userId, String name, String email) {

}
