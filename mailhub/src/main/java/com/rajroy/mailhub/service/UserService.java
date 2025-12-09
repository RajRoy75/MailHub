package com.rajroy.mailhub.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.rajroy.mailhub.dto.ImapConfigRequestDto;
import com.rajroy.mailhub.dto.ImapConfigResponseDto;
import com.rajroy.mailhub.dto.UpdateUserDto;
import com.rajroy.mailhub.dto.UserResponseDto;
import com.rajroy.mailhub.entity.ImapConfig;
import com.rajroy.mailhub.entity.User;
import com.rajroy.mailhub.repository.ImapConfigRepository;
import com.rajroy.mailhub.repository.UserRepository;
import com.rajroy.mailhub.security.AuthUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
  private final UserRepository userRepository;
  private final ImapConfigRepository imapConfigRepository;
  private final StorageService storageService;
  private final AuthUtil authUtil;

  @Transactional
  public UpdateUserDto updateUserProfile(Long userId, UserResponseDto userDto, MultipartFile profilePic)
      throws Exception {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found with id" + userId));

    user.setEmail(userDto.getEmail());
    user.setUsername(userDto.getUsername());

    if (profilePic != null && !profilePic.isEmpty()) {
      String filename = storageService.uploadImage(profilePic);
      user.setProfilePicture("/images/" + filename);
    }
    User updatedUser = userRepository.save(user);
    String newJwtToken = authUtil.generateAccessToken(updatedUser);

    UserResponseDto userResponseDto = new UserResponseDto(updatedUser.getId(), updatedUser.getUsername(),
        updatedUser.getEmail());

    return new UpdateUserDto(userResponseDto, newJwtToken);
  }

  @Transactional
  public ImapConfigResponseDto addEmailConfig(Long userId, ImapConfigRequestDto request) {

    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found"));

    ImapConfig newConfig = ImapConfig.builder()
        .provider(request.getProvider())
        .email(request.getEmail())
        .password(request.getPassword())
        .build();

    user.addImapConfig(newConfig);
    userRepository.save(user);
    ImapConfigResponseDto response = ImapConfigResponseDto.builder()
        .id(newConfig.getId())
        .provider(newConfig.getProvider())
        .email(newConfig.getEmail())
        .build();
    return response;
  }

  public List<ImapConfigResponseDto> getAllImaps(Long userId) {
    return imapConfigRepository.findByUser_Id(userId)
        .stream()
        .map(cfg -> new ImapConfigResponseDto(
            cfg.getId(),
            cfg.getProvider(),
            cfg.getEmail(),
            cfg.getPassword()))
        .toList();
  }
}
