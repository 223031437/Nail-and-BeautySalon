package za.ac.cput.nailbeautysalon;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * End-to-end test of the main flows against an in-memory database:
 * register -> login -> book -> slot clash -> reschedule -> cancel -> admin views -> contact form -> reply.
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.MethodName.class)
class BookingFlowIntegrationTest {

    @Autowired private MockMvc mvc;
    @Autowired private ObjectMapper json;

    private static String monday() {
        LocalDate d = LocalDate.now(ZoneId.of("Africa/Johannesburg")).plusDays(3);
        while (d.getDayOfWeek() != DayOfWeek.MONDAY) d = d.plusDays(1);
        return d.toString();
    }

    private String body(Object o) throws Exception { return json.writeValueAsString(o); }

    private ResultActions doPost(String url, String token, Object o) throws Exception {
        var req = post(url).contentType(MediaType.APPLICATION_JSON).content(body(o));
        if (token != null) req = req.header("Authorization", "Bearer " + token);
        return mvc.perform(req);
    }

    private ResultActions doPut(String url, String token, Object o) throws Exception {
        var req = put(url).contentType(MediaType.APPLICATION_JSON).content(body(o == null ? Map.of() : o));
        return mvc.perform(req.header("Authorization", "Bearer " + token));
    }

    private ResultActions doGet(String url, String token) throws Exception {
        var req = get(url);
        if (token != null) req = req.header("Authorization", "Bearer " + token);
        return mvc.perform(req);
    }

    private String register(String email) throws Exception {
        doPost("/auth/register-customer", null, Map.of("firstName", "Test", "lastName", "Customer",
                "email", email, "cellNumber", "0712345678", "password", "Password1!")).andExpect(status().isCreated());
        return login(email, "Password1!");
    }

    private String login(String user, String pass) throws Exception {
        String res = doPost("/auth/login", null, Map.of("username", user, "password", pass))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        return JsonPath.read(res, "$.token");
    }

    private Map<String, Object> booking(String dateTime) {
        return Map.of("dateTime", dateTime, "serviceSelected", "Gel Manicure", "paymentMethod", "Pay at salon",
                "notes", "",
                "address", Map.of("streetNumber", "12", "streetName", "Main Road", "suburb", "Sea Point",
                        "city", "Cape Town", "province", "Western Cape", "postalCode", "8001"));
    }

    @Test
    void fullBookingFlow() throws Exception {
        String monday = monday();
        String slotA = monday + "T10:00";
        String slotB = monday + "T11:00";

        String c1 = register("c1-" + UUID.randomUUID() + "@example.com");
        String c2 = register("c2-" + UUID.randomUUID() + "@example.com");

        // availability is public and lists the slot as free
        doGet("/appointment/availability?date=" + monday, null)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].available").value(true));

        // customer 1 books slot A
        String created = doPost("/appointment/create", c1, booking(slotA))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("Confirmed"))
                .andExpect(jsonPath("$.paymentStatus").value("Pending"))
                .andReturn().getResponse().getContentAsString();
        String id = JsonPath.read(created, "$.appointmentId");

        // the slot is now unavailable and customer 2 cannot take it
        doGet("/appointment/availability?date=" + monday, null)
                .andExpect(jsonPath("$[0].available").value(false));
        doPost("/appointment/create", c2, booking(slotA)).andExpect(status().isConflict());

        // missing fields -> 400 with a message
        doPost("/appointment/create", c1, Map.of("dateTime", slotB)).andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").exists());

        // customer 2 cannot touch customer 1's booking
        doPut("/appointment/" + id + "/cancel", c2, null).andExpect(status().isForbidden());

        // customer 1 reschedules to a free slot, but not to a taken one
        String other = register("c3-" + UUID.randomUUID() + "@example.com");
        doPost("/appointment/create", other, booking(slotB)).andExpect(status().isCreated());
        doPut("/appointment/" + id + "/reschedule", c1, Map.of("dateTime", slotB)).andExpect(status().isConflict());
        doPut("/appointment/" + id + "/reschedule", c1, Map.of("dateTime", monday + "T12:00"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.dateTime").value(monday + "T12:00:00"));

        // my bookings
        doGet("/appointment/mine", c1).andExpect(status().isOk()).andExpect(jsonPath("$[0].appointmentId").value(id));

        // admin sees bookings + payments, can move and mark paid; employees/customers cannot register staff
        String admin = login("admin@nailbeautysalon.co.za", "Login@2026");
        doGet("/appointment/getAll", admin).andExpect(status().isOk());
        doGet("/appointment/getAll", c1).andExpect(status().isForbidden());
        String payments = doGet("/payment/getAll", admin).andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        java.util.List<String> paymentIds = JsonPath.read(payments, "$[?(@.appointmentId=='" + id + "')].paymentId");
        String paymentId = paymentIds.get(0);
        doPut("/payment/" + paymentId + "/status", admin, Map.of("status", "Paid"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.status").value("Paid"));
        doPut("/appointment/" + id + "/reschedule", admin, Map.of("dateTime", monday + "T13:00")).andExpect(status().isOk());

        // admin cancels -> paid payment becomes "Refund Due" and the slot is free again
        doPut("/appointment/" + id + "/cancel", admin, null).andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("Cancelled"))
                .andExpect(jsonPath("$.paymentStatus").value("Refund Due"));
        doPut("/appointment/" + id + "/reschedule", c1, Map.of("dateTime", monday + "T14:00")).andExpect(status().isConflict());
    }

    @Test
    void registrationRules() throws Exception {
        String email = "reg-" + UUID.randomUUID() + "@example.com";
        Map<String, Object> customer = Map.of("firstName", "A", "lastName", "B", "email", email,
                "cellNumber", "0712345678", "password", "Password1!");
        doPost("/auth/register-customer", null, customer).andExpect(status().isCreated());
        doPost("/auth/register-customer", null, customer).andExpect(status().isConflict());
        doPost("/auth/register-customer", null, Map.of("firstName", "", "lastName", "B", "email", "nope",
                "cellNumber", "1", "password", "x")).andExpect(status().isBadRequest());

        Map<String, Object> employee = Map.of("firstName", "Emp", "lastName", "Loyee",
                "email", "emp-" + UUID.randomUUID() + "@example.com", "cellNumber", "0821234567",
                "employeeRole", "Nail Technician", "password", "Password1!");
        String customerToken = login(email, "Password1!");
        doPost("/auth/register-employee", customerToken, employee).andExpect(status().isForbidden());
        doPost("/auth/register-employee", null, employee).andExpect(status().isUnauthorized());
        String admin = login("admin@nailbeautysalon.co.za", "Login@2026");
        doPost("/auth/register-employee", admin, employee).andExpect(status().isCreated());
        login((String) employee.get("email"), "Password1!");
    }

    @Test
    void contactFormFlow() throws Exception {
        Map<String, Object> msg = Map.of("fullName", "Jane Doe", "email", "jane@example.com",
                "phoneNumber", "0712345678", "subject", "General_Enquiry", "message", "Do you do bridal nails?");
        // public submit
        String res = doPost("/inquiry", null, msg).andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        Number id = JsonPath.read(res, "$.inquiryId");

        // missing fields are rejected
        doPost("/inquiry", null, Map.of("fullName", "", "email", "x", "phoneNumber", "", "message", ""))
                .andExpect(status().isBadRequest());

        // a customer cannot read messages, the admin can and can respond
        String customer = register("msg-" + UUID.randomUUID() + "@example.com");
        doGet("/inquiry/getAll", customer).andExpect(status().isForbidden());
        String admin = login("admin@nailbeautysalon.co.za", "Login@2026");
        doGet("/inquiry/getAll", admin).andExpect(status().isOk())
                .andExpect(jsonPath("$[0].message").exists());
        doPut("/inquiry/" + id.longValue() + "/respond", admin, Map.of("response", "Yes we do - call us!", "sendEmail", true))
                .andExpect(status().isOk()).andExpect(jsonPath("$.status").value("Responded"));
    }
}
