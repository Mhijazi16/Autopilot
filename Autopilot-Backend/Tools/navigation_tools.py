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

def search_google_images(query):
    """
        This tool is for searching google Images
        it opens a broswer window and show results 
        to the end user
        Args: 
            query: string
    """
    engine = webdriver.Chrome(service=service)
    engine.get("https://www.google.com/imghp")
    search_box = engine.find_element(By.NAME, "q")
    search_box.send_keys(query)
    search_box.send_keys(Keys.RETURN)
    return close_window(engine)

def search_youtube_videos(video_title):
    """
        This tool is for searching youtube videos by
        title it opens a broswer window and show results 
        to the end user
        Args: 
            video_title : string
    """
    engine = webdriver.Chrome(service=service)
    engine.get("https://www.youtube.com")
    search_box = engine.find_element(By.NAME, "search_query")
    search_box.send_keys(video_title)
    search_box.send_keys(Keys.RETURN)
    return close_window(engine)

def search_google_news(query):
    """
        This tool is for searching google news 
        it opens a broswer window and show results 
        to the end user
        Args: 
            query: string
    """
    engine = webdriver.Chrome(service=service)
    engine.get("https://news.google.com")
    search_box = engine.find_element(By.XPATH, "//input[@aria-label='Search']")
    search_box.send_keys(query)
    search_box.send_keys(Keys.RETURN)
    return close_window(engine)

def search_weather_forecast(location):
    """
        This tool is for looking into weather forecast 
        it opens a broswer window and show results 
        to the end user
        Args: 
            location: string
    """
    engine = webdriver.Chrome(service=service)
    engine.get("https://www.google.com")
    search_box = engine.find_element(By.NAME, "q")
    search_box.send_keys(f"weather in {location}")
    search_box.send_keys(Keys.RETURN)
    return close_window(engine)

def get_top_search_result(query):
    """
        This tool is for search top results in google 
        it opens a broswer window and show results 
        to the end user
        Args: 
            query : string
    """
    engine = webdriver.Chrome(service=service)
    search_google(query)
    top_result = engine.find_element(By.XPATH, "(//h3)[1]")
    print("Top Result:", top_result.text)
    return close_window(engine)
    return top_result.text

def get_directions(start_location, end_location):
    """
        This tool is for getting directions on google maps 
        it opens a broswer window and show results 
        to the end user
        Args: 
            start_location: string
            end_location: string
    """
    engine = webdriver.Chrome(service=service)
    engine.get("https://www.google.com/maps")
    search_box = engine.find_element(By.ID, "searchboxinput")
    search_box.send_keys(f"{start_location} to {end_location}")
    search_box.send_keys(Keys.RETURN)
    return close_window(engine)

def get_navigation_toolkit():
     return [search_google,
             search_google_news,
             search_google_images,
             search_youtube_videos,
             search_weather_forecast,
             get_top_search_result,
             get_directions]
