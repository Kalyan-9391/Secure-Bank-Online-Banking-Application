package com.banksphere.tests;

import com.banksphere.pages.LoginPage;
import com.banksphere.pages.TransferPage;
import org.testng.Assert;
import org.testng.annotations.Test;

public class TransferTest extends BaseTest {

    @Test(priority = 1, description = "TC_XFER_002: Verify rejection on insufficient balance")
    public void testInsufficientBalanceRejection() {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.loginAsCustomer("kalyan@banksphere.com", "Password123!");

        TransferPage transferPage = new TransferPage(driver);
        transferPage.navigateToTransfers();
        transferPage.selectFromAccount("ACC4521");
        transferPage.selectToAccount("100012345678");
        transferPage.enterAmount("999999");
        transferPage.enterDescription("Test Overbalance");
        transferPage.clickReview();

        String err = transferPage.getErrorMessage();
        Assert.assertTrue(err.contains("Insufficient funds") || err.contains("balance"), "Expected insufficient balance error message missing!");
    }
}
