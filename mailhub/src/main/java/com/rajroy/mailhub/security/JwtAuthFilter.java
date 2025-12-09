package com.rajroy.mailhub.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import com.rajroy.mailhub.entity.User;
import com.rajroy.mailhub.repository.TokenRepository;
import com.rajroy.mailhub.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {

  private final HandlerExceptionResolver handlerExceptionResolver;
  private final AuthUtil authUtil;
  private final UserRepository userRepository;
  private final TokenRepository tokenRepository;

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    try {
      log.info("incoming request: {} ", request.getRequestURI());

      String token = null;

      if (request.getServletPath().contains("/auth")) {
        filterChain.doFilter(request, response);
      }

      if (request.getCookies() != null) {
        for (Cookie cookie : request.getCookies()) {
          if ("accessToken".equals(cookie.getName())) {
            token = cookie.getValue();
            break;
          }
        }
      }

      if (token == null) {
        final String requestTokenHeader = request.getHeader("Authorization");
        if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
          token = requestTokenHeader.substring(7);
        }
      }

      if (token == null) {
        filterChain.doFilter(request, response);
        return;
      }

      String email = authUtil.getEmailFromToken(token);

      if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
        User user = userRepository.findByEmail(email).orElseThrow();
        boolean isTokenValid = tokenRepository.findByToken(token)
            .map(t -> !t.isExpired() && !t.isRevoked())
            .orElse(false);

        if (isTokenValid) {
          UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
              user, null, user.getAuthorities());

          SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
        }

      }

      filterChain.doFilter(request, response);

    } catch (Exception e) {
      handlerExceptionResolver.resolveException(request, response, null, e);
    }
  }

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
    String path = request.getRequestURI();
    return path.startsWith("/auth/");
  }
}
