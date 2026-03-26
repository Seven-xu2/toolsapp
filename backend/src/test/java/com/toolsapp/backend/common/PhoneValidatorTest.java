package com.toolsapp.backend.common;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

class PhoneValidatorTest {

    @Test
    void shouldValidatePhone() {
        Assertions.assertTrue(PhoneValidator.isValid("13800138000"));
        Assertions.assertFalse(PhoneValidator.isValid("23800138000"));
        Assertions.assertFalse(PhoneValidator.isValid("1380013"));
    }
}
