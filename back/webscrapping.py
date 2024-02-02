from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
import time
import pandas as pd
import threading
import math

option = webdriver.ChromeOptions()
option.add_argument("start-maximized")


driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()),options=option)
driver.get('https://www.ebay.com/')

input_element = driver.find_element(By.CLASS_NAME, "gh-tb.ui-autocomplete-input")
input_element.send_keys("mewtwo gold star")
input_element.send_keys(Keys.RETURN)
