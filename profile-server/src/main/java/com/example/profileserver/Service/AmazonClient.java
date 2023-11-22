package com.example.profileserver.Service;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSCredentialsProvider;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.example.profileserver.Domain.Profile;
import com.netflix.discovery.converters.Auto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.util.ConditionalOnBootstrapEnabled;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.amazonaws.services.s3.AmazonS3;

import javax.annotation.PostConstruct;
import javax.script.ScriptEngine;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Date;
import java.util.Objects;
import java.util.Optional;

@Service
@Configuration
public class AmazonClient {
    // Interface S3Clent: https://sdk.amazonaws.com/java/api/latest/software/amazon/awssdk/services/s3/S3Client.html#putBucketAccelerateConfiguration(software.amazon.awssdk.services.s3.model.PutBucketAccelerateConfigurationRequest)
    private AmazonS3 s3Client;

    @Value("${amazonS3.endpointUrl}")
    private String endpointUrl;
    @Value("${amazonS3.accessKey}")
    private String accessKey;
    @Value("${amazonS3.secretKey}")
    private String secretKey;
    @Value("${amazonS3.bucketName}")
    private String bucketName;

    ProfileService profileService;

    @Autowired
    AmazonClient(ProfileService profileService) {
        this.profileService = profileService;
    }

    private AWSCredentials credentials() {
        return new BasicAWSCredentials(accessKey, secretKey);
    }

    @PostConstruct
    private void initializeAmazonS3() {
        this.s3Client = AmazonS3ClientBuilder
                .standard()
                .withCredentials(new AWSStaticCredentialsProvider(credentials()))
                .withRegion(Regions.US_EAST_2)
                .build();
    }

    private File convertMultiParttoFile(MultipartFile multipartFile) throws IOException {
        File file = new File(Objects.requireNonNull(multipartFile.getOriginalFilename()));
        try(FileOutputStream fos = new FileOutputStream(file)) {
            fos.write(multipartFile.getBytes());
        }
        return file;
    }

    private String generateFileName(MultipartFile multipartFile) {
        return new Date().getTime() + "-" + multipartFile.getName().replace(" ", "-");
    }

    private void uploadFileToS3Bucket(String fileName, File file) {
        PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, fileName, file).withCannedAcl(CannedAccessControlList.PublicRead);
        s3Client.putObject(putObjectRequest);
    }

    public String uploadAvatar(String profileId, MultipartFile multiFile) {
        String fileUrl = "";
        try {
            File file = convertMultiParttoFile(multiFile);
            String fileName = generateFileName(multiFile);
            fileUrl = endpointUrl + "/" + bucketName + "/" + fileName;
            Optional<Profile> profile = profileService.getProfileById(profileId);
            String finalFileUrl = fileUrl;
            profile.ifPresent(profile1 -> profile1.setProfileAvatar(finalFileUrl)); //only save avatar url to db
            uploadFileToS3Bucket(fileName, file);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return fileUrl;
    }
}
