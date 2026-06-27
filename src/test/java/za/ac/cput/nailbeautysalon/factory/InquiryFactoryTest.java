package za.ac.cput.nailbeautysalon.factory;

import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import za.ac.cput.nailbeautysalon.domain.Inquiry;
import za.ac.cput.nailbeautysalon.domain.Subject;

import static org.junit.jupiter.api.Assertions.*;
import static za.ac.cput.nailbeautysalon.domain.Subject.Customer_Feedback;
import static za.ac.cput.nailbeautysalon.domain.Subject.Sales;

@TestMethodOrder(MethodOrderer.MethodName.class)
class InquiryFactoryTest {


    @Test
    void A_createInquiry() {
        Inquiry inquiry = InquiryFactory.createInquiry("mbalihlabao67@gmail.com", "Mbali Hlaba", "0677390691", Customer_Feedback , "My skin is reacting bad to your products.");
        assertNotNull(inquiry);
        System.out.println(inquiry);
    }

    @Test
    void B_createInquiry_EmptyMessage() {
        Inquiry inquiry = InquiryFactory.createInquiry("mbalihlabao67@gmail.com", "Mbali Hlaba", "0677390691", Sales, "");
        assertNull(inquiry);
        System.out.println(inquiry);
    }
}