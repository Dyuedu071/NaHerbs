package vn.io.naherb.order;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import vn.io.naherb.account.Account;
import vn.io.naherb.account.AccountRepository;
import vn.io.naherb.account.Role;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderEmailService {

    private final JavaMailSender javaMailSender;
    private final TemplateEngine templateEngine;
    private final AccountRepository accountRepository;

    @Value("${app.mail.from}")
    private String fromEmail;

    @Async
    public void sendOrderConfirmationToCustomer(Order order, List<OrderItem> items) {
        if (order.getReceiverEmail() == null || order.getReceiverEmail().isBlank()) {
            log.warn("Customer email is missing for order {}, skipping email notification.", order.getOrderCode());
            return;
        }

        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            Context context = new Context();
            context.setVariable("order", order);
            context.setVariable("items", items);

            String htmlContent = templateEngine.process("order-customer", context);

            helper.setFrom(fromEmail);
            helper.setTo(order.getReceiverEmail());
            helper.setSubject("NaHerbs - Xác nhận đặt hàng thành công (" + order.getOrderCode() + ")");
            helper.setText(htmlContent, true);

            javaMailSender.send(message);
            log.info("Sent order confirmation email to customer {} for order {}", order.getReceiverEmail(), order.getOrderCode());
        } catch (MessagingException e) {
            log.error("Failed to send order confirmation email for order {}", order.getOrderCode(), e);
        }
    }

    @Async
    public void sendOrderNotificationToAdmin(Order order, List<OrderItem> items) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            Context context = new Context();
            context.setVariable("order", order);
            context.setVariable("items", items);

            String htmlContent = templateEngine.process("order-admin", context);

            helper.setFrom(fromEmail);
            
            List<Account> admins = accountRepository.findByRole(Role.ADMIN);
            String[] adminEmails = admins.stream()
                    .map(Account::getEmail)
                    .filter(email -> email != null && !email.isBlank())
                    .toArray(String[]::new);
                    
            if (adminEmails.length == 0) {
                // Fallback to fromEmail if no admins found
                helper.setTo(fromEmail);
            } else {
                helper.setTo(adminEmails);
            }
            
            helper.setSubject("NaHerbs Admin - Có đơn hàng mới (" + order.getOrderCode() + ")");
            helper.setText(htmlContent, true);

            javaMailSender.send(message);
            log.info("Sent order notification email to admins for order {}", order.getOrderCode());
        } catch (MessagingException e) {
            log.error("Failed to send order notification email to admins for order {}", order.getOrderCode(), e);
        }
    }
}
