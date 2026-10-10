package com.nightdrop.util;

import com.nightdrop.entity.Store;
import org.springframework.stereotype.Component;

import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class TimeUtil {

    public static final ZoneId ZONE_ID = ZoneId.of("Asia/Kolkata");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("hh:mm a");

    public LocalTime getCurrentTime() {
        return LocalTime.now(ZONE_ID);
    }

    public ZonedDateTime getCurrentZonedDateTime() {
        return ZonedDateTime.now(ZONE_ID);
    }

    public String formatServerTime() {
        return getCurrentTime().format(TIME_FORMATTER) + " IST";
    }

    public boolean isStoreOpen(Store store) {
        if (store == null || !Boolean.TRUE.equals(store.getIsActive())) {
            return false;
        }

        LocalTime open = store.getOpeningTime();
        LocalTime close = store.getClosingTime();

        if (open == null || close == null) {
            return false;
        }

        LocalTime now = getCurrentTime();

        // 24-hour store
        if (open.equals(close)) {
            return true;
        }

        if (open.isBefore(close)) {
            // Normal daytime window (e.g. 09:00 to 18:00)
            return (now.equals(open) || now.isAfter(open)) && now.isBefore(close);
        } else {
            // Overnight window crossing midnight (e.g. 20:00 to 04:00)
            return (now.equals(open) || now.isAfter(open)) || now.isBefore(close);
        }
    }

    public String getOperatingStatusMessage(Store store) {
        if (store == null || !Boolean.TRUE.equals(store.getIsActive())) {
            return "Temporarily Closed";
        }

        LocalTime open = store.getOpeningTime();
        LocalTime close = store.getClosingTime();

        if (open == null || close == null) {
            return "Hours not configured";
        }

        boolean openNow = isStoreOpen(store);
        String formattedOpen = open.format(TIME_FORMATTER);
        String formattedClose = close.format(TIME_FORMATTER);

        if (openNow) {
            return "Open • Closes at " + formattedClose;
        } else {
            return "Closed • Opens at " + formattedOpen;
        }
    }
}
