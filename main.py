from pokebayimagedownloader.cards_image_downloader import CardsImageDownloader


def main():
    aux = CardsImageDownloader(img_qty=50)
    aux.download_by_set('base1')


if __name__ == '__main__':
    main()
