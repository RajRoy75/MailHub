package com.rajroy.mailhub.service;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import jakarta.mail.BodyPart;
import jakarta.mail.Folder;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.Multipart;
import jakarta.mail.Part;
import jakarta.mail.Session;
import jakarta.mail.Store;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.rajroy.mailhub.dto.EmailDto;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class ImapEmailService {

  private final Session mailSession;

  @Value("${imap.username}")
  private String username;

  @Value("${imap.password}")
  private String password;

  public ImapEmailService(Session mailSession) {
    this.mailSession = mailSession;
  }

  private Store store;
  private Folder inbox;

  @PostConstruct
  public void init() {
    try {
      store = mailSession.getStore("imaps");
      store.connect(username, password);
      inbox = store.getFolder("INBOX");
      inbox.open(Folder.READ_ONLY);
      System.out.println("✅ IMAP connection established successfully");
    } catch (Exception e) {
      System.err.println("❌ Failed to initialize IMAP connection: " + e.getMessage());
      e.printStackTrace();
    }
  }

  @PreDestroy
  public void cleanup() {
    try {
      if (inbox != null && inbox.isOpen())
        inbox.close();
      if (store != null && store.isConnected())
        store.close();
      System.out.println("🧹 IMAP connection closed");
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  private void ensureConnected() throws MessagingException {
    if (store == null || !store.isConnected()) {
      System.out.println("🔄 Reconnecting IMAP store...");
      store = mailSession.getStore("imaps");
      store.connect(username, password);
      inbox = store.getFolder("INBOX");
      inbox.open(Folder.READ_ONLY);
      System.out.println("IMAP Connected Again.......");
    }
  }

  private String getTextFromMessage(Part part) throws Exception {
    if (part.isMimeType("text/html")) {
      return (String) part.getContent();
    } else if (part.isMimeType("text/plain")) {
      return (String) part.getContent();
    } else if (part.isMimeType("multipart/*")) {
      Multipart multipart = (Multipart) part.getContent();
      StringBuilder result = new StringBuilder();
      for (int i = 0; i < multipart.getCount(); i++) {
        BodyPart bodyPart = multipart.getBodyPart(i);
        String text = getTextFromMessage(bodyPart); // 🔁 recursion for nested multiparts
        if (text != null && !text.isEmpty()) {
          if (bodyPart.isMimeType("text/html")) {
            // Prefer HTML version
            return text;
          } else {
            result.append(text);
          }
        }
      }
      return result.toString();
    }
    return "";
  }

  public List<EmailDto> readLatestEmails(int count) {
    List<EmailDto> emails = new ArrayList<>();

    try {
      ensureConnected();

      int totalMessages = inbox.getMessageCount();
      int start = Math.max(1, totalMessages - count + 1);
      Message[] messages = inbox.getMessages(start, totalMessages);

      for (Message message : messages) {
        EmailDto dto = new EmailDto();
        dto.setSubject(message.getSubject());
        dto.setFrom(message.getFrom()[0].toString());
        dto.setTo(Arrays.toString(message.getAllRecipients()));
        dto.setDate(message.getReceivedDate() != null ? message.getReceivedDate().toString() : "");
        dto.setContentType(message.getContentType());
        dto.setBodyHtml(getTextFromMessage(message));
        emails.add(dto);
      }

    } catch (Exception e) {
      e.printStackTrace();
    }

    return emails;
  }
}
