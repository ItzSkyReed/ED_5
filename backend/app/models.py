import json

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
    def get_all_models_as_json_dict(cls):

        data = {}

        for model in cls.objects.all():
            data[model.model] = {
                "brand": model.brand,
                "type": model.type,
                "date": int(model.date.timestamp()),
                "country": model.country,
                "desc": model.desc
            }

        return data