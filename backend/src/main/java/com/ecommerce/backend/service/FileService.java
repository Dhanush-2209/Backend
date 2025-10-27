package com.ecommerce.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileService {

    private static final Logger logger = LoggerFactory.getLogger(FileService.class);

    @Value("${file.upload-dir}")
    private String uploadDirConfig;

    private String uploadDir;

    @PostConstruct
    public void init() {
        this.uploadDir = Paths.get(uploadDirConfig).toAbsolutePath().toString() + "/";
    }

    public String save(MultipartFile file) throws IOException {
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            boolean created = dir.mkdirs();
            logger.info("Created uploads directory: {}", created);
        }

        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        File dest = new File(uploadDir + filename);
        logger.info("Saving file to: {}", dest.getAbsolutePath());

        file.transferTo(dest);
        return filename;
    }
}
