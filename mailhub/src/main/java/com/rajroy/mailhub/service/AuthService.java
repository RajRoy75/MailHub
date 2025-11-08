package com.rajroy.mailhub.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.rajroy.mailhub.dto.LoginRequestDto;
import com.rajroy.mailhub.dto.LoginResponseDto;
import com.rajroy.mailhub.dto.SignupRequestDto;
import com.rajroy.mailhub.dto.SignupResponseDto;
import com.rajroy.mailhub.entity.User;
import com.rajroy.mailhub.repository.UserRepository;
import com.rajroy.mailhub.security.AuthUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

  private final AuthenticationManager authenticationManager;
  private final AuthUtil authUtil;
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public LoginResponseDto login(LoginRequestDto loginRequestDto) {
    log.info(loginRequestDto.getEmail());
    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(loginRequestDto.getEmail(), loginRequestDto.getPassword()));
    log.info("authenticate");
    User user = (User) authentication.getPrincipal();
    log.info("get User");
    String token = authUtil.generateAccessToken(user);
    log.info("get Token");
    return new LoginResponseDto(token, user.getId());
  }

  private User signUpEnternal(SignupRequestDto signupRequestDto) {
    User user = userRepository.findByEmail(signupRequestDto.getEmail()).orElse(null);
    if (user != null)
      throw new IllegalArgumentException("User already registered");
    log.info("new user");
    user = User.builder()
        .username(signupRequestDto.getUsername())
        .email(signupRequestDto.getEmail())
        .password(passwordEncoder.encode(signupRequestDto.getPassword()))
        .build();

    log.info("building complete");

    user = userRepository.save(user);
    log.info("userSaved");
    return user;
  }

  public SignupResponseDto signup(SignupRequestDto signupRequestDto) {
    log.info("singup called");
    User user = signUpEnternal(signupRequestDto);
    return new SignupResponseDto(user.getId(), user.getEmail());
  }
}
