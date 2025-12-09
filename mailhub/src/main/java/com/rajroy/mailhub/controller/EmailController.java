package com.rajroy.mailhub.controller;

import com.rajroy.mailhub.dto.EmailDto;
import com.rajroy.mailhub.service.ImapEmailService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/emails")
public class EmailController {

  private final ImapEmailService imapEmailService;

  private static final String FOLDER_INBOX = "INBOX";
  private static final String FOLDER_SPAM = "[Gmail]/Spam";
  private static final String FOLDER_SENT = "[Gmail]/Sent Mail";
  private static final String FOLDER_DRAFT = "[Gmail]/Drafts";

  public EmailController(ImapEmailService imapEmailService) {
    this.imapEmailService = imapEmailService;
  }

  @GetMapping("/inbox")
  public ResponseEntity<List<EmailDto>> getLatestEmails(
      @RequestHeader("X-Email") String email,
      @RequestHeader("X-Password") String password,
      @RequestParam(defaultValue = "10") int count) {

    imapEmailService.setCredentials(email, password);
    return ResponseEntity.ok(imapEmailService.fetchEmails(FOLDER_INBOX, count));
  }

  @GetMapping("/spam")
  public ResponseEntity<List<EmailDto>> getSpamEmails(
      @RequestHeader("X-Email") String email,
      @RequestHeader("X-Password") String password,
      @RequestParam(defaultValue = "5") int count) {
    imapEmailService.setCredentials(email, password);
    return ResponseEntity.ok(imapEmailService.fetchEmails(FOLDER_SPAM, count));
  }

  @GetMapping("/sent")
  public ResponseEntity<List<EmailDto>> getSentEmails(
      @RequestHeader("X-Email") String email,
      @RequestHeader("X-Password") String password,
      @RequestParam(defaultValue = "5") int count) {
    imapEmailService.setCredentials(email, password);
    return ResponseEntity.ok(imapEmailService.fetchEmails(FOLDER_SENT, count));
  }

  @GetMapping("/draft")
  public ResponseEntity<List<EmailDto>> getTrashEmails(
      @RequestHeader("X-Email") String email,
      @RequestHeader("X-Password") String password,
      @RequestParam(defaultValue = "5") int count) {
    imapEmailService.setCredentials(email, password);
    return ResponseEntity.ok(imapEmailService.fetchEmails(FOLDER_DRAFT, count));
  }

  @GetMapping("/{uid}")
  public ResponseEntity<?> getEmailByUid(
      @PathVariable long uid,
      @RequestHeader("X-Email") String email,
      @RequestHeader("X-Password") String password,
      @RequestParam(defaultValue = "INBOX") String folder) {

    String targetFolder;
    switch (folder) {
      case "inbox":
        targetFolder = FOLDER_INBOX;
        break;
      case "spam":
        targetFolder = FOLDER_SPAM;
        break;
      case "sent":
        targetFolder = FOLDER_SENT;
        break;
      case "draft":
        targetFolder = FOLDER_DRAFT;
        break;
      default:
        targetFolder = FOLDER_INBOX;
        break;
    }
    imapEmailService.setCredentials(email, password);
    EmailDto getEmail = imapEmailService.getEmailByUid(targetFolder, uid);
    if (getEmail != null)
      return ResponseEntity.ok(getEmail);
    return ResponseEntity.status(404).body("Email not found");
  }

}
