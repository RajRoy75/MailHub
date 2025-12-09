package com.rajroy.mailhub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ImapConfigRequestDto {

  private String provider;
  private String email;
  private String password;
}
