package com.nightdrop.util;

import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Component
public class OrderIdGenerator {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd");

    public String generateOrderNumber() {
        String datePart = LocalDate.now().format(DATE_FORMATTER);
        String randomPart = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        return "ND-" + datePart + "-" + randomPart;
    }
}
