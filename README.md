# 🕸️ AI-WebScaper

**AI-WebScaper** is a powerful Python-based web scraping tool enhanced with AI capabilities. It automates the extraction of web data using Selenium and BeautifulSoup, then allows users to ask natural language queries powered by LLMs (like LLaMA3 via Ollama). It's ideal for gathering, parsing, and querying website content seamlessly.

---

## 🚀 Features

- 🌐 Scrape dynamic websites using `Selenium`
- 🧠 Use `Ollama` to run local LLMs like `LLaMA3`
- 🪄 Natural language querying of scraped content
- 🔍 BeautifulSoup-based HTML parsing
- 💡 Modular codebase (`scrape.py`, `parse.py`, `main.py`)
- 📂 Clean DOM content before LLM input
- 🖥️ Uses local `chromedriver.exe` — no Bright Data required

---

## 🛠️ Project Structure

AI-WebScaper/ 
│ ├── chromedriver.exe # Local ChromeDriver binary 
  ├── main.py # Main Streamlit app logic 
  ├── parse.py # HTML content cleaning and chunking 
  ├── scrape.py # Selenium-based web scraping logic 
  ├── requirements.txt # All Python dependencies 
      └── pycache/ # Python bytecode cache



---

## ⚙️ Installation

> Make sure you have **Python 3.8+**, **pip**, and **Google Chrome** installed.

```
git clone https://github.com/IshwariGadewar/AI-WebScaper.git
cd AI-WebScaper
python -m venv venv
venv\Scripts\activate   # On Windows
pip install -r requirements.txt
streamlit run main.py
```



🧠 AI Integration (Ollama + LLaMA3)
To enable AI-powered prompts:

Download and install Ollama
  https://ollama.com/
Pull the LLaMA3 model (skip if already installed):
  ollama pull llama3
🔒 The app is designed to work fully locally — no external API like OpenAI is required.


---

✨ Example Use Cases
Summarize content from any blog or news article

Extract contact info from business directories

Clean and query messy DOM structures

Ask natural language questions about a product page

