from pokebayimagedownloader.cards_image_downloader import CardsImageDownloader


def main():
    aux = CardsImageDownloader()
    aux.download_by_collection('base1')


if __name__ == '__main__':
    main()
