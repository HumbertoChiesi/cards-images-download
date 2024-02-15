import os
from typing import List
import requests
import urllib.parse
from pokemontcgsdk import Set
from pokebayimagedownloader.CardsInfo import CardsInfo
from pokebayimagedownloader.EbayScraper import EbayScraper


class CardsImageDownloader:
    def __init__(self, saving_directory='./files/images'):
        self.base_directory = saving_directory
        self.ebay_scraper = EbayScraper()
        self.set_printed_total = None
        self.set_year_released = None

    def _build_query(self, card_name: str, card_id: str) -> str:
        card_number = card_id.split('-')[1]
        query = f"pokemon {urllib.parse.quote(card_name)} {card_number}/{self.set_printed_total} {self.set_year_released}"
        return query

    def _get_collection_info(self, collection_id: str):
        collection_info = Set.find(collection_id)
        self.set_printed_total = collection_info.printedTotal
        self.set_year_released = collection_info.releaseDate[0:4]

    def _get_ebay_images(self, query: str) -> List[str]:
        images_url = self.ebay_scraper.get_sale_images(
            10,
            self.ebay_scraper.search(query)
        )

        return images_url

    def download_card_images(self, card_name: str, card_id: str, ):
        images_url = self._get_ebay_images(self._build_query(card_name, card_id))

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
