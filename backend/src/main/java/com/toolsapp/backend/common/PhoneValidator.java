package com.toolsapp.backend.common;

public final class PhoneValidator {

    private PhoneValidator() {
    }

    public static boolean isValid(String phone) {
        return phone != null && phone.matches("^1\\d{10}$");
    }
}
