package com.rajroy.mailhub.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class StorageService {

  @Value("${app.upload.dir}")
  private String uploadDir;

  public String uploadImage(MultipartFile file) throws IOException {
    File uploadDirFile = new File(uploadDir);
    if (!uploadDirFile.exists()) {
      uploadDirFile.mkdir();
    }
    String fileExtension = getFileExtension(file.getOriginalFilename());
    String uniqueFileName = UUID.randomUUID().toString() + fileExtension;

    String filePath = Paths.get(uploadDir, uniqueFileName).toString();

    Files.write(Paths.get(filePath), file.getBytes());

    return uniqueFileName;
  }

  public String getFileExtension(String fileName) {
    if (fileName == null || fileName.lastIndexOf(".") == -1)
      return "";

    return fileName.substring(fileName.lastIndexOf("."));
  }

}
