import os
from datetime import datetime

import json


def write_to_data(json_data: dict):
    if not os.path.exists('data.json'):
        with open('data.json', 'w', encoding='utf-8') as file:
            json.dump({}, file, ensure_ascii=False, indent=4)

    # Читаем существующие данные из файла
    with open('data.json', encoding='utf-8') as file:
        data: dict = json.load(file)

    json_data['date'] = int(datetime.strptime(json_data['date'], '%Y-%m-%d').timestamp())

    data[json_data.pop("model")] = json_data

    with open('data.json', 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)


def get_data_json() -> str:
    with open(r'data.json', encoding='utf-8') as file:
        return file.read()
