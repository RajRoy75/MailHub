package com.rajroy.mailhub.service;

import jakarta.annotation.PreDestroy;
import jakarta.mail.BodyPart;
import jakarta.mail.FetchProfile;
import jakarta.mail.Flags;
import jakarta.mail.Folder;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.Multipart;
import jakarta.mail.Part;
import jakarta.mail.Session;
import jakarta.mail.Store;
import jakarta.mail.UIDFolder;

import org.springframework.stereotype.Service;
import org.springframework.web.context.annotation.RequestScope;

import com.rajroy.mailhub.dto.EmailDto;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequestScope
public class ImapEmailService {

  private final Session mailSession;
  private final Object connectionLock = new Object();

  private String username;

  private String password;

  private Store store;
  private final Map<String, Folder> openFolders = new ConcurrentHashMap<>();

  public ImapEmailService(Session mailSession) {
    this.mailSession = mailSession;
  }

  public void setCredentials(String username, String password) {
    this.username = username;
    this.password = password;
  }

  @PreDestroy
  public void cleanup() {
    forceDisconnect();
  }

  private Folder getFolder(String folderName) throws MessagingException {
    synchronized (connectionLock) {
      if (store == null || !store.isConnected()) {
        System.out.println("🔄 Connecting to IMAP Store...");
        store = mailSession.getStore("imaps");
        store.connect(username, password);
      }

      Folder folder = openFolders.get(folderName);
      if (folder == null || !folder.isOpen()) {
        System.out.println("📂 Opening folder: " + folderName);
        folder = store.getFolder(folderName);
        folder.open(Folder.READ_ONLY);
        openFolders.put(folderName, folder);
      }
      return folder;
    }
  }

  @FunctionalInterface
  public interface EmailAction<T> {
    T execute(Folder folder) throws Exception;
  }

  public <T> T executeInFolder(String folderName, EmailAction<T> action) {
    synchronized (connectionLock) {
      try {
        Folder folder = getFolder(folderName);
        return action.execute(folder);
      } catch (Exception e) {
        System.err.println("⚠️ IMAP Operation failed for " + folderName + ", retrying...");
        forceDisconnect();
        try {
          Folder folder = getFolder(folderName);
          return action.execute(folder);
        } catch (Exception retryEx) {
          throw new RuntimeException("Failed to execute email operation", retryEx);
        }
      }
    }
  }

  public List<EmailDto> fetchEmails(String folderName, int count) {
    return executeInFolder(folderName, (folder) -> {
      List<EmailDto> emails = new ArrayList<>();

      if (folder instanceof UIDFolder uidFolder) {
        int totalMessages = folder.getMessageCount();
        if (totalMessages == 0)
          return emails;

        int start = Math.max(1, totalMessages - count + 1);
        Message[] messages = folder.getMessages(start, totalMessages);

        FetchProfile fp = new FetchProfile();
        fp.add(FetchProfile.Item.ENVELOPE);
        fp.add(UIDFolder.FetchProfileItem.UID);
        fp.add(FetchProfile.Item.FLAGS);
        folder.fetch(messages, fp);

        for (int i = messages.length - 1; i >= 0; i--) {
          Message message = messages[i];
          EmailDto dto = new EmailDto();
          dto.setUid(uidFolder.getUID(message));
          dto.setSubject(message.getSubject());
          dto.setIsRead(message.isSet(Flags.Flag.SEEN));
          if (message.getFrom() != null && message.getFrom().length > 0) {
            dto.setFrom(message.getFrom()[0].toString());
          }
          dto.setDate(message.getReceivedDate() != null ? message.getReceivedDate().toString() : "");
          emails.add(dto);
        }
      }
      return emails;
    });
  }

  public EmailDto getEmailByUid(String folderName, long uid) {
    return executeInFolder(folderName, (folder) -> {
      if (folder instanceof UIDFolder uidFolder) {
        Message message = uidFolder.getMessageByUID(uid);
        if (message != null) {
          String bodyHtml = getTextFromMessage(message);

          EmailDto dto = new EmailDto();
          dto.setUid(uidFolder.getUID(message));
          dto.setSubject(message.getSubject());
          if (message.getFrom() != null && message.getFrom().length > 0)
            dto.setFrom(message.getFrom()[0].toString());
          dto.setTo(Arrays.toString(message.getAllRecipients()));
          dto.setDate(message.getReceivedDate() != null ? message.getReceivedDate().toString() : "");
          dto.setContentType(message.getContentType());
          dto.setBodyHtml(bodyHtml);
          return dto;
        }
      }
      return null;
    });
  }

  private void forceDisconnect() {
    synchronized (connectionLock) {
      try {
        for (Folder f : openFolders.values()) {
          if (f.isOpen())
            f.close(false);
        }
        openFolders.clear();
      } catch (Exception ignored) {
      }

      try {
        if (store != null && store.isConnected()) {
          store.close();
        }
      } catch (Exception ignored) {
      }

      store = null;
      System.out.println("🧹 IMAP connection reset");
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
        String text = getTextFromMessage(bodyPart);
        if (text != null && !text.isEmpty()) {
          if (bodyPart.isMimeType("text/html"))
            return text;
          result.append(text);
        }
      }
      return result.toString();
    }
    return "";
  }
}
