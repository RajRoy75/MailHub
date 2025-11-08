package com.rajroy.mailhub.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rajroy.mailhub.dto.LoginRequestDto;
import com.rajroy.mailhub.dto.LoginResponseDto;
import com.rajroy.mailhub.dto.SignupRequestDto;
import com.rajroy.mailhub.dto.SignupResponseDto;
import com.rajroy.mailhub.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

  private final AuthService authService;

  @PostMapping("/login")
  public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto loginRequestDto) {
    return ResponseEntity.ok(authService.login(loginRequestDto));
  }

  @PostMapping("/signup")
  public ResponseEntity<SignupResponseDto> singup(@RequestBody SignupRequestDto signupRequestDto) {
    return ResponseEntity.ok(authService.signup(signupRequestDto));
  }

}
