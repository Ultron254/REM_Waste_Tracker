# ui_tests.py - Selenium UI automation for Waste Collection app
# pip install selenium
import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service as ChromeService

class WasteTrackerUITest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # If chromedriver is not in PATH, change the next line to:
        # cls.driver = webdriver.Chrome(service=ChromeService(executable_path=r'C:\path\to\chromedriver.exe'))
        cls.driver = webdriver.Chrome()
        cls.driver.implicitly_wait(5)

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def test_1_invalid_login_shows_error(self):
        driver = self.driver
        driver.get("http://localhost:3000")
        login_btn = driver.find_element(By.ID, "loginButton")
        self.assertTrue(login_btn.is_displayed(), "Login button should be visible")
        driver.find_element(By.ID, "username").send_keys("wronguser")
        driver.find_element(By.ID, "password").send_keys("wrongpass")
        login_btn.click()
        error_msg = driver.find_element(By.ID, "errorMsg")
        self.assertTrue(error_msg.is_displayed(), "Error message should be visible for invalid login")
        self.assertIn("Invalid username or password", error_msg.text)

    def test_2_login_and_crud_flow(self):
        driver = self.driver
        driver.get("http://localhost:3000")
        driver.find_element(By.ID, "username").clear()
        driver.find_element(By.ID, "username").send_keys("admin")
        driver.find_element(By.ID, "password").clear()
        driver.find_element(By.ID, "password").send_keys("password")
        driver.find_element(By.ID, "loginButton").click()

        save_button = driver.find_element(By.ID, "saveButton")
        self.assertTrue(save_button.is_displayed(), "Save button should be displayed on dashboard after login")

        driver.find_element(By.ID, "descriptionInput").send_keys("Test Waste Item")
        driver.find_element(By.ID, "weightInput").send_keys("123")
        save_button.click()
        time.sleep(1)
        page_text = driver.page_source
        self.assertIn("Test Waste Item", page_text)
        self.assertIn("123", page_text)

        edit_buttons = driver.find_elements(By.CLASS_NAME, "editBtn")
        self.assertTrue(len(edit_buttons) > 0, "At least one Edit button should exist")
        edit_buttons[0].click()

        desc_input = driver.find_element(By.ID, "descriptionInput")
        desc_input.clear()
        desc_input.send_keys("Updated Waste Item")
        driver.find_element(By.ID, "saveButton").click()

        time.sleep(1)
        page_text = driver.page_source
        self.assertIn("Updated Waste Item", page_text)
        self.assertNotIn("Test Waste Item", page_text)

        delete_buttons = driver.find_elements(By.CLASS_NAME, "deleteBtn")
        self.assertTrue(len(delete_buttons) > 0, "At least one Delete button should exist")
        delete_buttons[0].click()
        time.sleep(1)
        page_text = driver.page_source
        self.assertNotIn("Updated Waste Item", page_text)
        self.assertIn("No pickups available", page_text)

if __name__ == "__main__":
    unittest.main()
