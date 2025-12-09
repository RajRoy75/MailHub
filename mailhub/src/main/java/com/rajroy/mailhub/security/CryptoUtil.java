package com.rajroy.mailhub.security;

import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class CryptoUtil {

  @Value("${jwt.secretKey}")
  private static String SECRET_KEY;

  public static String encrypt(String data) {
    try {
      Cipher cipher = Cipher.getInstance("AES");
      SecretKeySpec key = new SecretKeySpec(SECRET_KEY.getBytes(), "AES");
      cipher.init(Cipher.ENCRYPT_MODE, key);
      return Base64.getEncoder().encodeToString(cipher.doFinal(data.getBytes()));
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  public static String decrypt(String encryptedData) {
    try {
      Cipher cipher = Cipher.getInstance("AES");
      SecretKeySpec key = new SecretKeySpec(SECRET_KEY.getBytes(), "AES");
      cipher.init(Cipher.DECRYPT_MODE, key);
      return new String(cipher.doFinal(Base64.getDecoder().decode(encryptedData)));
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }
}
