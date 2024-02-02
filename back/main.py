from CardsInfo import CardsInfo
import pandas as pd

if __name__ == "__main__":
    df = CardsInfo.get_collections(['base1'], ['name', 'id', 'images.small'])
    df.to_csv('./files/base_set_cards.csv', index=False)

    print(df)