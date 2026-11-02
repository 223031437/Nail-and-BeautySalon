package za.ac.cput.nailbeautysalon.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** What the employee did / said when answering a message. sendEmail=true also e-mails the customer. */
public record InquiryReplyRequest(
        @NotBlank(message = "Please write a response or note") @Size(max = 2000, message = "Response is too long (maximum 2000 characters)") String response,
        Boolean sendEmail) {
}
