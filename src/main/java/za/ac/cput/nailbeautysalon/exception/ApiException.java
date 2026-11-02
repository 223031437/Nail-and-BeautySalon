package za.ac.cput.nailbeautysalon.exception;

import org.springframework.http.HttpStatus;

/** A business-rule failure that should be returned to the client as {"message": "..."} */
public class ApiException extends RuntimeException {

    private final HttpStatus status;

    public ApiException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
