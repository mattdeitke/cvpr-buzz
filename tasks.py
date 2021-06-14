"""Extracts all the paper metadata."""

from bs4 import BeautifulSoup
import requests
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from urllib import request
import pandas as pd
import twint
import nest_asyncio
import datetime
import logging
import json
import time
import os


def get_char_sequence(string: str) -> str:
    """Remove non-alpha characters from a string and convert it to lowercase."""
    return "".join(filter(str.isalpha, string.lower()))


def get_semantic_scholar_id(paper_title: str, driver: webdriver.Firefox) -> str:
    """Searches Semantic Scholar to see if the title exists."""
    search = driver.find_elements_by_class_name("form-input")[0]
    search.clear()
    search.send_keys(paper_title)
    search.send_keys(Keys.RETURN)

    try:
        WebDriverWait(driver, 3).until(
            EC.visibility_of_element_located(
                (By.XPATH, "//a[@data-selenium-selector='title-link']")
            )
        )
    except:
        logging.warning(f"Semantic Scholar timeout with {paper_title}!")

    candidate_char_sequences = []
    papers = driver.find_elements_by_xpath("//a[@data-selenium-selector='title-link']")
    for paper in papers[:3]:
        soup = BeautifulSoup(paper.get_attribute("innerHTML"), features="lxml")
        candidate_title = soup.get_text()

        # determine if the papers have the same title
        char_sequence = get_char_sequence(candidate_title)
        candidate_char_sequences.append(char_sequence)

    # check for duplicate titles
    if len(candidate_char_sequences) != len(set(candidate_char_sequences)):
        raise Exception(f"More than 1 paper with the title: {paper_title}!")

    paper_seq = get_char_sequence(paper_title)
    for i, c_seq in enumerate(candidate_char_sequences):
        if c_seq == paper_seq:
            paper_url = papers[i].get_attribute("href")
            paper_id = paper_url[paper_url.rfind("/") + 1 :]
            return paper_id

    raise Exception(f"Paper not found {paper_title}!")


def get_abstract(pdf_url: str) -> str:
    """Get the abstract from the CVPR pdf_url."""
    html_url = pdf_url.replace("/papers/", "/html/").replace(".pdf", ".html")
    r = requests.get(html_url)
    soup = BeautifulSoup(r.text, features="lxml")
    abstract = soup.select("div#abstract")[0].get_text().strip()
    return abstract


def get_paper_data(
    cvpr_papers_url: str = "https://openaccess.thecvf.com/CVPR2021?day=all",
    fetch_semantic_scholar_id: bool = True,
    fetch_abstract: bool = True,
    start_at_paper: int = 0,
    sleep_increment: int = 100,
):
    """Get the metadata for each paper.

    The abstracts are on a different page then the titles and authors,
    so fetch_abstract specifies if one wants to request this page. Similarly,
    the Semantic Scholar IDs also must be fetched from a separate page.

    start_at_paper is used if one is continuing from an interruption.

    Semantic Scholar hits rate limits about every 100 papers, hence why there
    is a sleep_increment, which sleeps for 3 minutes.
    """
    if fetch_semantic_scholar_id:
        driver = webdriver.Firefox(executable_path="./geckodriver.exe")
        driver.get("https://semanticscholar.org")

    r = requests.get(cvpr_papers_url)
    soup = BeautifulSoup(r.text, features="lxml")

    titles = soup.find_all("dt", class_="ptitle")[start_at_paper:]
    for i, title_tag in enumerate(titles):
        if fetch_semantic_scholar_id and i % sleep_increment == 0 and i != 0:
            # hits rate limit requests on intervals 130 papers
            print(f"Starting 3 minute sleep at {datetime.datetime.now().time()}")
            time.sleep(2 * 60)
            pass

        print(f"Starting {i + 1}/{len(titles)}")

        paper_title = title_tag.get_text()
        paper = dict(
            arXiv="", title=paper_title, pdf="", authors=[], abstract="", s2id=""
        )

        if fetch_semantic_scholar_id:
            try:
                paper["s2id"] = get_semantic_scholar_id(
                    paper_title=paper_title, driver=driver
                )
            except Exception as e:
                logging.error(str(e))

        author_tags = title_tag.find_next("dd")
        authors = []
        for author_tag in author_tags.find_all("a"):
            authors.append(author_tag.get_text())
        paper["authors"] = authors

        paper["arXiv"] = None
        link_tags = author_tags.find_next("dd")
        for link_tag in link_tags.find_all("a"):
            tag = link_tag.get_text()
            if tag == "arXiv":
                paper["arXiv"] = link_tag["href"]
            elif tag == "pdf":
                pdf_url: str = link_tag["href"]
                paper["pdf"] = pdf_url
                if fetch_abstract:
                    paper["abstract"] = get_abstract(pdf_url=pdf_url)

        if not paper["pdf"]:
            logging.warning(f"No PDF found for {paper_title}!")
            break

        paper_id = paper["pdf"][
            paper["pdf"].rfind("/") + 1 : -len("_CVPR_2021_paper.pdf")
        ]

        path = f"paper-data/{paper_id}.json"

        # prevents accidentally overwriting additional data from the paper
        if os.path.exists(path):
            with open(path, "r") as f:
                existing_data = json.load(f)
            existing_data.update(paper)
            paper = existing_data

        with open(path, "w") as f:
            f.write(json.dumps(paper, indent=2))


def add_2021_paper_poster_sessions():
    dates = dict(
        Monday="https://openaccess.thecvf.com/CVPR2021?day=2021-06-21",
        Tuesday="https://openaccess.thecvf.com/CVPR2021?day=2021-06-22",
        Wednesday="https://openaccess.thecvf.com/CVPR2021?day=2021-06-23",
        Thursday="https://openaccess.thecvf.com/CVPR2021?day=2021-06-24",
        Friday="https://openaccess.thecvf.com/CVPR2021?day=2021-06-25",
    )

    for session_day, date_url in dates.items():
        r = requests.get(date_url)
        soup = BeautifulSoup(r.text, features="lxml")
        titles = soup.find_all("dt", class_="ptitle")
        for i, title in enumerate(titles):
            print(f"Session: {session_day}, Starting {i}/{len(titles)}")
            pdf_link = title.find_next("a")["href"]
            paper_id = pdf_link[pdf_link.rfind("/") + 1 : -len("_CVPR_2021_paper.html")]
            data_file = f"paper-data/{paper_id}.json"
            with open(data_file, "r") as f:
                data = json.load(f)
            data["posterSession"] = session_day
            with open(data_file, "w") as f:
                f.write(json.dumps(data, indent=2))


def query_twitter(search: str, output_path: str) -> None:
    """Save a csv file containing all of the tweets for a search query."""
    c = twint.Config()
    c.Search = search
    c.Stats = True
    c.Store_csv = True
    c.Output = output_path
    twint.run.Search(c)


def add_to_query(query: str, to_add: str, in_quotes: bool = True):
    if in_quotes:
        to_add = f'"{to_add}"'
    query = to_add if not query else f"{query} OR {to_add}"
    return query


def get_twitter_data(start_at_paper: int = 0):
    """Download all the twitter data locally."""
    data_dir = "paper-data"
    paper_data_paths = [
        paper for paper in os.listdir(data_dir) if paper.endswith(".json")
    ]

    # these contain too many tweets that are non-specific to the paper
    skip_titles = set(["Learning by Watching",])

    # make it possible to debug in an interactive environment
    nest_asyncio.apply()

    for i, paper in enumerate(paper_data_paths[start_at_paper:]):
        print(f"Starting {i}/{len(paper_data_paths[start_at_paper:])}")
        with open(os.path.join(data_dir, paper), "r") as f:
            paper_data = json.load(f)

        query = ""
        if paper_data["arXiv"] is not None:
            # want both http and https data
            query = add_to_query(query, paper_data["arXiv"][len("http://") :])
        if paper_data["title"] not in skip_titles:
            query = add_to_query(query, paper_data["title"])

        if query:
            query_twitter(
                search=query, output_path=f"twitter/{paper[: paper.rfind('.json')]}.csv"
            )


def parse_twitter_data():
    """Update the paper-data directory with the data from Twitter."""
    data_dir = "twitter"
    twitter_data_paths = [
        paper for paper in os.listdir(data_dir) if paper.endswith(".csv")
    ]

    for i, path in enumerate(twitter_data_paths):
        print(f"Starting {i}/{len(twitter_data_paths)}")

        df = pd.read_csv(f"{data_dir}/{path}")

        retweets = int(df["retweets_count"].sum())
        likes = int(df["likes_count"].sum())
        replies = int(df["replies_count"].sum())

        # update the paper data
        paper_data_path = f"paper-data/{path[:path.rfind('.csv')]}.json"
        with open(paper_data_path, "r") as f:
            data = json.load(f)

        data["twitter"] = dict(retweets=retweets, likes=likes, replies=replies)
        with open(paper_data_path, "w") as f:
            f.write(json.dumps(data, indent=2))


def update_citation_data(start_at_paper: int = 0):
    """Update the citation count for each paper that has a Semantic Scholar ID."""
    start_at_paper = 402 + 335 + 390 + 360
    paths = [paper for paper in os.listdir("paper-data") if paper.endswith(".json")]
    for i, path in enumerate(paths[start_at_paper:]):
        print(f"Starting {i}/{len(paths[start_at_paper:])}")
        full_path = f"paper-data/{path}"
        with open(full_path, "r") as f:
            paper = json.load(f)
        if not paper["s2id"]:
            continue
        url = f"https://api.semanticscholar.org/v1/paper/{paper['s2id']}"
        with request.urlopen(url) as f:
            s2_data = json.loads(f.read())

        paper["citations"] = len(s2_data["citations"])
        with open(full_path, "w") as f:
            f.write(json.dumps(paper, indent=2))

