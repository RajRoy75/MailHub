package com.rajroy.mailhub.service;

import java.util.List;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.rajroy.mailhub.dto.LoginRequestDto;
import com.rajroy.mailhub.dto.LoginResponseDto;
import com.rajroy.mailhub.dto.SignupRequestDto;
import com.rajroy.mailhub.dto.SignupResponseDto;
import com.rajroy.mailhub.dto.UserResponseDto;
import com.rajroy.mailhub.entity.Token;
import com.rajroy.mailhub.entity.User;
import com.rajroy.mailhub.repository.TokenRepository;
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
  private final TokenRepository tokenRepository;

  public LoginResponseDto login(LoginRequestDto loginRequestDto) {
    log.info(loginRequestDto.getEmail());
    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(loginRequestDto.getEmail(), loginRequestDto.getPassword()));
    log.info("authenticate");
    User user = (User) authentication.getPrincipal();
    log.info("get User");
    revokeAllTokens(user);
    String jwtToken = authUtil.generateAccessToken(user);
    Token token = Token.builder()
        .user(user)
        .token(jwtToken)
        .tokenType("BEARER")
        .expired(false)
        .revoked(false)
        .build();
    tokenRepository.save(token);
    log.info("get Token");
    return new LoginResponseDto(jwtToken, user.getId());
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
    revokeAllTokens(user);
    String jwtToken = authUtil.generateAccessToken(user);
    Token token = Token.builder()
        .user(user)
        .token(jwtToken)
        .tokenType("BEARER")
        .expired(false)
        .revoked(false)
        .build();
    tokenRepository.save(token);
    log.info("userSaved");
    return user;
  }

  public SignupResponseDto signup(SignupRequestDto signupRequestDto) {
    log.info("singup called");
    User user = signUpEnternal(signupRequestDto);
    return new SignupResponseDto(user.getId(), user.getEmail());
  }

  public UserResponseDto getUser(long userId) {
    log.info("user details called");
    User user = userRepository.findById(userId).orElse(null);
    return new UserResponseDto(user.getId(), user.getUsername(), user.getEmail());
  }

  private void revokeAllTokens(User user) {
    List<Token> validUserToken = tokenRepository.findAllValidTokenByUserId(user.getId());
    if (validUserToken.isEmpty())
      return;
    validUserToken.forEach(t -> {
      t.setExpired(true);
      t.setRevoked(true);
    });
    tokenRepository.saveAll(validUserToken);
  }
}
