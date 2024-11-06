from datetime import datetime

from django.core.exceptions import ValidationError
from django.db import models


class DBModel(models.Model):
    model = models.CharField(max_length=32)
    brand = models.CharField(max_length=32)
    type = models.CharField(max_length=32)
    desc = models.TextField()
    country = models.CharField(max_length=32)
    date = models.DateField()

    def __str__(self):
        return f"{self.brand} - {self.type}"

    @classmethod
    def model_exists(cls, model_value):
        return cls.objects.filter(model=model_value).exists()

    @classmethod
    def add_to_database(cls, model_value: str, brand: str, type: str, desc: str, country: str, date: str):
        new_model = cls(model=model_value, brand=brand, type=type, desc=desc, country=country, date=date)
        new_model.save()
        return new_model

    @classmethod
    def update_model(cls, model_id: int, model_value: str, brand: str, type: str, desc: str, country: str, date: str):
        if cls.objects.filter(model=model_value).exclude(id=model_id).exists():
            raise ValidationError(f"Модель с именем '{model_value}' уже существует.")

        existing_model = cls.objects.get(id=model_id)

        existing_model.model = model_value
        existing_model.brand = brand
        existing_model.type = type
        existing_model.desc = desc
        existing_model.country = country
        existing_model.date = date

        existing_model.save()
        return existing_model

    @classmethod
    def delete_from_database(cls, model_id: int):
        try:
            model_to_delete = cls.objects.get(id=model_id)
            model_to_delete.delete()
        except cls.DoesNotExist:
            raise cls.DoesNotExist

    @classmethod
    def get_all_models_as_json_dict(cls):
        data = {}

        for model in cls.objects.all():
            # Если model.date — это строка, сначала преобразуем её в datetime  # Убедитесь, что формат совпадает с вашим

            data[model.model] = {
                "id": model.id,
                "brand": model.brand,
                "type": model.type,
                "date": int(datetime.strptime(str(model.date), '%Y-%m-%d').timestamp()),  # Теперь можно вызвать timestamp()
                "country": model.country,
                "desc": model.desc
            }
        return data
