package com.rajroy.mailhub.controller;

import com.rajroy.mailhub.dto.EmailDto;
import com.rajroy.mailhub.service.ImapEmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/emails")
@CrossOrigin(origins = "http://localhost:5173")
public class EmailController {

  private final ImapEmailService imapEmailService;

  public EmailController(ImapEmailService imapEmailService) {
    this.imapEmailService = imapEmailService;
  }

  @GetMapping("/latest")
  public ResponseEntity<List<EmailDto>> getLatestEmails(
      @RequestParam(defaultValue = "5") int count) {

    List<EmailDto> latestEmails = imapEmailService.readLatestEmails(count);
    return ResponseEntity.ok(latestEmails);
  }
}
