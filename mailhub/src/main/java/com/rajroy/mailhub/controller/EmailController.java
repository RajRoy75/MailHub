package com.rajroy.mailhub.controller;

import com.rajroy.mailhub.dto.EmailDto;
import com.rajroy.mailhub.service.ImapEmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/emails")
@CrossOrigin(origins = "http://localhost:3000")
public class EmailController {

  private final ImapEmailService imapEmailService;

  public EmailController(ImapEmailService imapEmailService) {
    this.imapEmailService = imapEmailService;
  }

  @GetMapping("/latest")
  public ResponseEntity<List<EmailDto>> getLatestEmails(
      @RequestParam(defaultValue = "10") int count) {

    List<EmailDto> latestEmails = imapEmailService.readLatestEmails(count);
    return ResponseEntity.ok(latestEmails);
  }

  @GetMapping("/{uid}")
  public ResponseEntity<?> getEmailByUid(@PathVariable long uid) {
    EmailDto email = imapEmailService.getEmailByUid(uid);
    if (email != null)
      return ResponseEntity.ok(email);
    return ResponseEntity.status(404).body("Email not found");
  }
}
