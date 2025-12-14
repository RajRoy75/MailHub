package com.rajroy.mailhub.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rajroy.mailhub.dto.LoginRequestDto;
import com.rajroy.mailhub.dto.LoginResponseDto;
import com.rajroy.mailhub.dto.SignupRequestDto;
import com.rajroy.mailhub.dto.SignupResponseDto;
import com.rajroy.mailhub.dto.UserResponseDto;
import com.rajroy.mailhub.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;

  @PostMapping("/login")
  public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto loginRequestDto) {
    LoginResponseDto loginResult = authService.login(loginRequestDto);

    ResponseCookie cookie = ResponseCookie.from("accessToken", loginResult.getJwt())
        .httpOnly(true)
        .secure(true)
        .path("/")
        .maxAge(7 * 24 * 60 * 60)
        .sameSite("None")
        .build();

    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, cookie.toString())
        .body(loginResult);
  }

  @PostMapping("/signup")
  public ResponseEntity<SignupResponseDto> singup(@RequestBody SignupRequestDto signupRequestDto) {
    return ResponseEntity.ok(authService.signup(signupRequestDto));
  }

  @GetMapping("/user/{userId}")
  public ResponseEntity<UserResponseDto> getUser(@PathVariable long userId) {
    return ResponseEntity.ok(authService.getUser(userId));
  }

}
