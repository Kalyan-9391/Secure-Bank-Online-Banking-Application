package com.banksphere.tests;

import com.banksphere.pages.LoginPage;
import org.testng.Assert;
import org.testng.annotations.Test;

public class LoginTest extends BaseTest {

    @Test(priority = 1, description = "TC_AUTH_001: Verify customer login with valid credentials")
    public void testValidCustomerLogin() {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.loginAsCustomer("kalyan@banksphere.com", "Password123!");
        Assert.assertTrue(loginPage.isDashboardDisplayed(), "Dashboard was not displayed after login!");
    }

    @Test(priority = 2, description = "TC_AUTH_002: Verify error message on invalid password")
    public void testInvalidPasswordLogin() {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.loginAsCustomer("kalyan@banksphere.com", "WrongPassword!");
        String errMsg = loginPage.getErrorMessage();
        Assert.assertTrue(errMsg.contains("Invalid password"), "Expected error alert not displayed!");
    }
}
