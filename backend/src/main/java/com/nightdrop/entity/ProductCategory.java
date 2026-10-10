package com.nightdrop.entity;

public enum ProductCategory {
    FOOD_AND_SNACKS("Food and snacks"),
    GROCERIES("Groceries"),
    PERSONAL_CARE("Personal care"),
    ELECTRONICS_AND_ACCESSORIES("Electronics and phone accessories"),
    PET_ESSENTIALS("Pet essentials"),
    BABY_ESSENTIALS("Baby essentials");

    private final String displayName;

    ProductCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
