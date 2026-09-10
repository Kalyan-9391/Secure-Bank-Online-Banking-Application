package com.banksphere.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class TransferPage {
    private WebDriver driver;
    private WebDriverWait wait;

    private By transfersTabNav = By.id("nav-transfers");
    private By fromAccountSelect = By.id("transfer-from");
    private By toAccountSelect = By.id("transfer-to");
    private By amountInput = By.id("transfer-amount");
    private By descInput = By.id("transfer-desc");
    private By reviewBtn = By.id("btn-review-transfer");
    private By otpInput = By.id("otp-input");
    private By confirmOtpBtn = By.id("btn-confirm-otp");
    private By transferErrorAlert = By.id("transfer-error-alert");

    public TransferPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    public void navigateToTransfers() {
        wait.until(ExpectedConditions.elementToBeClickable(transfersTabNav)).click();
    }

    public void selectFromAccount(String value) {
        new Select(driver.findElement(fromAccountSelect)).selectByValue(value);
    }

    public void selectToAccount(String value) {
        new Select(driver.findElement(toAccountSelect)).selectByValue(value);
    }

    public void enterAmount(String amount) {
        driver.findElement(amountInput).sendKeys(amount);
    }

    public void enterDescription(String desc) {
        driver.findElement(descInput).sendKeys(desc);
    }

    public void clickReview() {
        driver.findElement(reviewBtn).click();
    }

    public void enterOTP(String otp) {
        WebElement otpElem = wait.until(ExpectedConditions.visibilityOfElementLocated(otpInput));
        otpElem.sendKeys(otp);
        driver.findElement(confirmOtpBtn).click();
    }

    public String getErrorMessage() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(transferErrorAlert)).getText();
    }
}
