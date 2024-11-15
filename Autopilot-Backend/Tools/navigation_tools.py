from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
import time

service = Service(executable_path="/home/ha1st/chromedriver")
def close_window(engine):
    window = engine.current_window_handle
    try:
        while window in engine.window_handles:
            time.sleep(1)
        page_html = engine.page_source
        engine.quit()
        return f"search was successful here is what the user saw: {page_html}"
    except Exception:
        print("Window closed or browser disconnected.")

def search_google(query):
    """
        This tool is for searching google 
        it opens a broswer window and show results 
        to the end user
        Args: 
            query: string
    """
    engine = webdriver.Chrome(service=service)
    engine.get("https://www.google.com")
    search_box = engine.find_element(By.NAME, "q")
    search_box.send_keys(query)
    search_box.send_keys(Keys.RETURN)

    return close_window(engine)
