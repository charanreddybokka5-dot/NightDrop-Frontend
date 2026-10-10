package com.nightdrop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

@SpringBootApplication
public class NightDropApplication {

    public static void main(String[] args) {
        // Set JVM default timezone to Asia/Kolkata (IST)
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
        SpringApplication.run(NightDropApplication.class, args);
    }
}
