from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import os

def scrape_website(website):
    print("Launching local Chrome browser...")

    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Optional: run in headless mode
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    # Path to your local chromedriver.exe
    # chromedriver_path = os.path.join(os.getcwd(), "chromedriver.exe")

    service = Service(executable_path= 'chromedriver.exe')

    with webdriver.Chrome(service=service, options=chrome_options) as driver:
        driver.get(website)
        print("Page loaded. Scraping content...")
        html = driver.page_source
        return html

def extract_body_content(html_content):
    soup = BeautifulSoup(html_content, "html.parser")
    body_content = soup.body
    return str(body_content) if body_content else ""

def clean_body_content(body_content):
    soup = BeautifulSoup(body_content, "html.parser")
    for script_or_style in soup(["script", "style"]):
        script_or_style.extract()
    cleaned_content = soup.get_text(separator="\n")
    return "\n".join(line.strip() for line in cleaned_content.splitlines() if line.strip())

def split_dom_content(dom_content, max_length=6000):
    return [dom_content[i : i + max_length] for i in range(0, len(dom_content), max_length)]
