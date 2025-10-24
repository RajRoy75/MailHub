package com.rajroy.mailhub.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmailDto {
  private String subject;
  private String from;
  private String to;
  private String date;
  private String contentType;
  private String bodyHtml;
}
