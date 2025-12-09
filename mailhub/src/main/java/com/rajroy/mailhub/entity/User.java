package com.rajroy.mailhub.entity;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "app_user")
@Builder
public class User implements UserDetails {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;
  private String username;

  @Column(unique = true, nullable = false)
  private String email;
  private String password;
  private String profilePicture;

  @Builder.Default
  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<ImapConfig> imapConfigs = new ArrayList<>();

  @OneToMany(mappedBy = "user")
  private List<Token> tokens;

  public void addImapConfig(ImapConfig config) {
    if (imapConfigs == null) {
      imapConfigs = new ArrayList<>();
    }
    imapConfigs.add(config);
    config.setUser(this);
  }

  public void removeImapConfig(ImapConfig config) {
    if (imapConfigs != null) {
      imapConfigs.remove(config);
      config.setUser(null);
    }
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of();
  }

}
