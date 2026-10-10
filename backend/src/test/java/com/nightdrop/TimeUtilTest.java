package com.nightdrop;

import com.nightdrop.entity.Store;
import com.nightdrop.util.TimeUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalTime;

import static org.junit.jupiter.api.Assertions.*;

class TimeUtilTest {

    private TimeUtil timeUtil;

    @BeforeEach
    void setUp() {
        timeUtil = new TimeUtil();
    }

    @Test
    void testInactiveStoreIsAlwaysClosed() {
        Store store = Store.builder()
                .openingTime(LocalTime.of(0, 0))
                .closingTime(LocalTime.of(23, 59))
                .isActive(false)
                .build();

        assertFalse(timeUtil.isStoreOpen(store));
    }

    @Test
    void test24HourStoreIsOpen() {
        Store store = Store.builder()
                .openingTime(LocalTime.of(0, 0))
                .closingTime(LocalTime.of(0, 0))
                .isActive(true)
                .build();

        assertTrue(timeUtil.isStoreOpen(store));
    }

    @Test
    void testNullHoursStoreIsClosed() {
        Store store = Store.builder()
                .openingTime(null)
                .closingTime(null)
                .isActive(true)
                .build();

        assertFalse(timeUtil.isStoreOpen(store));
    }
}
