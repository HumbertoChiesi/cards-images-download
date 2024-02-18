import os
from typing import List
import requests
import urllib.parse
from pokemontcgsdk import Set
from pokebayimagedownloader.cards_info import CardsInfo
from pokebayimagedownloader.ebay_scraper import EbayScraper


class CardsImageDownloader:
    """
       A class for downloading Pokemon trading card images from eBay.

       Attributes:
           saving_directory (str): The directory where the downloaded images will be saved.
           ebay_scraper (EbayScraper): An instance of the EbayScraper class used for scraping eBay.
           set_printed_total (str): The total number of printed cards in the set.
           set_year_released (str): The year the set was released.
           MAX_RELATED_SALES (int): The maximum number of related sales to consider.
    """
    def __init__(self, saving_directory='./files/images'):
        self.base_directory = saving_directory
        self.ebay_scraper = EbayScraper()
        self.set_printed_total = None
        self.set_year_released = None
        self.MAX_RELATED_SALES = 10

    def _build_query(self, card_name: str, card_id: str) -> str:
        card_number = card_id.split('-')[1]
        query = f"pokemon {urllib.parse.quote(card_name)} {card_number}/{self.set_printed_total} {self.set_year_released}"
        return query

    def _get_collection_info(self, collection_id: str):
        collection_info = Set.find(collection_id)
        self.set_printed_total = collection_info.printedTotal
        self.set_year_released = collection_info.releaseDate[0:4]

    def _get_ebay_info(self, query: str) -> List[dict]:
        sales_info = self.ebay_scraper.get_sales_info(
            self.ebay_scraper.search(query)
        )

        return sales_info

    def _get_sales_images(self, card_name: str, card_id: str) -> List[str]:
        ebay_sales = self._get_ebay_info(self._build_query(card_name, card_id))
        images_url = [sale['image'] for sale in self._remove_unrelated_sales(ebay_sales, card_name, card_id)]

        return images_url

    def _remove_unrelated_sales(self, sales_list: List[dict], card_name: str, card_id: str) -> List[dict]:
        card_number = card_id.split('-')[1]
        related_sales = []

        for card_sale in sales_list:
            if card_name.lower() in card_sale['title'].lower() and f"{card_number}/{self.set_printed_total}" in card_sale['title'].lower():
                related_sales.append(card_sale)

        return related_sales[:(self.MAX_RELATED_SALES if (len(related_sales) > self.MAX_RELATED_SALES >= 0) else len(related_sales))]

    def download_card_images(self, card_name: str, card_id: str):
        images_url = self._get_sales_images(card_name, card_id)

        image_path = self.base_directory + f"/{card_id}"
        os.makedirs(image_path, exist_ok=True)

        for index, image_url in enumerate(images_url):
            response = requests.get(image_url)
            file_path = os.path.join(image_path, f"{card_id}_{index + 1}.jpg")
            with open(file_path, 'wb') as file:
                file.write(response.content)

    def download_by_collection(self, collection_id: str):
        self._get_collection_info(collection_id)

        cards_df = CardsInfo.get_by_collections([collection_id], ['name', 'id'])

        for index, row in cards_df.iterrows():
            self.download_card_images(row['name'], row['id'])
