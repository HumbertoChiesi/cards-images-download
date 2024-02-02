from bs4 import BeautifulSoup
import requests
from typing import List


class EbayScraper:
    """
    A simple eBay scraper for searching and extracting sale images
    """
    def __init__(self):
        self.base_url = "https://www.ebay.com/"

    def search(self, query: str) -> str:
        """
        Perform a search on eBay and return the HTML content of the search results page

        :param query: The search query
        :return: The HTML content of the eBay search results page
        """
        search_url = self.base_url + f"sch/i.html?_from=R40&_nkw={query.replace(' ', '+')}&_sacat=0"
        return requests.get(search_url).text

    def get_sale_images(self, qty: int, html_text: str) -> List[str]:
        """
        Extract sale images from the eBay search results HTML.

        :param qty: The desired quantity of images.
        :param html_text: The HTML content of the eBay search results page.
        :return: A list of sale image URLs.
        """
        html_soup = BeautifulSoup(html_text, 'html.parser')
        image_divs = html_soup.find_all('div', class_='s-item__image-wrapper image-treatment')
        sale_images = [div.find('img')['src'] for div in image_divs]
        return sale_images[1:(qty+1 if (len(sale_images) > qty >= 0) else len(sale_images))]
