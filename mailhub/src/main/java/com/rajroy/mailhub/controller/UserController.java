package com.rajroy.mailhub.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rajroy.mailhub.dto.ImapConfigRequestDto;
import com.rajroy.mailhub.dto.ImapConfigResponseDto;
import com.rajroy.mailhub.dto.UpdateUserDto;
import com.rajroy.mailhub.dto.UserResponseDto;
import com.rajroy.mailhub.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;
  private final ObjectMapper objectMapper;

  @PutMapping("/update/{userId}")
  public ResponseEntity<?> updateUserProfile(
      @PathVariable Long userId,
      @RequestPart("userDto") String userDtoStr,
      @RequestPart(value = "profilePic", required = false) MultipartFile profilePic) {
    try {
      UserResponseDto userDto = objectMapper.readValue(userDtoStr, UserResponseDto.class);
      UpdateUserDto updatedUser = userService.updateUserProfile(userId, userDto, profilePic);
      return ResponseEntity.ok(updatedUser);
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(500).body("Failed to update profile" + e.getMessage());
    }
  }

  @PostMapping("/imap/{userId}")
  public ResponseEntity<ImapConfigResponseDto> addEmailConfig(
      @PathVariable Long userId,
      @RequestBody ImapConfigRequestDto request) {
    ImapConfigResponseDto updateUserConfig = userService.addEmailConfig(userId, request);
    return ResponseEntity.ok(updateUserConfig);
  }

  @GetMapping("/{userId}")
  public ResponseEntity<List<ImapConfigResponseDto>> getAllEmailConfig(@PathVariable Long userId) {
    List<ImapConfigResponseDto> allImaps = userService.getAllImaps(userId);
    return ResponseEntity.ok(allImaps);
  }

  @GetMapping("/test")
  public String demoController() {
    return "Hello from secured endpoint";
  }
}
