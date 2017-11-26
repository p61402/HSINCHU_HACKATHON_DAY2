import pandas as pd

file_name = 'spot.csv'

df = pd.read_csv(file_name)

# print(df)


with open('spot.txt', 'w', encoding='utf8') as f:
    for index, row in df.iterrows():
        f.write('["{}", "{}", "{}", {}, {}],\n'.format(row['景點名稱'], row['地址'], row['景點介紹'], row['x'], row['y']))