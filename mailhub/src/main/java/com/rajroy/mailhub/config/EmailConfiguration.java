package com.rajroy.mailhub.config;

import java.util.Properties;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import jakarta.mail.Session;

@Configuration
public class EmailConfiguration {

  @Value("${imap.host}")
  private String imapHost;

  @Value("${imap.port}")
  private String imapPort;

  @Bean
  @Primary
  public Properties imapProperties() {
    Properties props = new Properties();
    props.put("mail.imap.connectiontimeout", "5000");
    props.put("mail.imap.timeout", "5000");
    props.put("mail.imap.writetimeout", "5000");
    props.setProperty("mail.store.protocol", "imaps");
    props.setProperty("mail.imaps.host", imapHost);
    props.setProperty("mail.imaps.port", imapPort);
    return props;
  }

  @Bean
  public Session mailSession(Properties imapPropetries) {
    return Session.getDefaultInstance(imapPropetries);
  }

}
