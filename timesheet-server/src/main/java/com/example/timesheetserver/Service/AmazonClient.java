package com.example.timesheetserver.Service;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.apigateway.model.Op;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.example.timesheetserver.Domain.Document;
import com.example.timesheetserver.Domain.Timesheet;
import com.example.timesheetserver.Util.TimeManager;
import com.netflix.discovery.converters.Auto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import javax.swing.text.html.Option;
import java.awt.color.ProfileDataException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.File;
import java.sql.Time;
import java.util.Date;
import java.util.Objects;
import java.util.Optional;

@Service
public class AmazonClient {
    private AmazonS3 s3Client;

    @Value("${amazonS3.endpointUrl}")
    private String endpointUrl;
    @Value("${amazonS3.accessKey}")
    private String accessKey;
    @Value("${amazonS3.secretKey}")
    private String secretKey;
    @Value("${amazonS3.bucketName}")
    private String bucketName;

    TimesheetService timesheetService;

    @Autowired
    AmazonClient(TimesheetService timesheetService) {
        this.timesheetService = timesheetService;
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

    private File converMultiPartToFile(MultipartFile multipartFile) throws IOException {
        File file = new File(Objects.requireNonNull(multipartFile.getOriginalFilename()));
        try(FileOutputStream fos = new FileOutputStream(file)){
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

    public String uploadDocument(String profileId, String weekEnding, MultipartFile multipartFile) {
        String fileUrl = "";
        try {
            File file = converMultiPartToFile(multipartFile);
            String fileName = generateFileName(multipartFile);
            fileUrl = endpointUrl + "/" + bucketName + "/" + fileName;
            Optional<Timesheet> option = timesheetService.getTimesheetByProfileIdAndWeekEnding(profileId, weekEnding);
            String finalFileUrl = fileUrl;
            option.ifPresent(timesheet -> {
                Document document = timesheet.getWeeklyTimesheet().getDocument();
                document.setUrl(finalFileUrl);
                document.setTitle(fileName);
                document.setUploadedTime(TimeManager.getCurrentTime());
                document.setUploadedBy(timesheet.getProfile().getName());
                document.setType("document"); //TODO(Yangfei): finalize this
                timesheetService.saveTimesheet(timesheet);
                uploadFileToS3Bucket(fileName, file);
                file.delete();
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
        return fileUrl;
    }
}
