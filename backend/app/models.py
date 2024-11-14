from datetime import datetime

from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import When, Case, Value, IntegerField, Q


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
    def model_exists(cls, model_value, brand):
        return cls.objects.filter(model=model_value, brand=brand).exists()

    @classmethod
    def add_to_database(cls, model_value: str, brand: str, model_type: str, desc: str, country: str, date: str):
        new_model = cls(model=model_value, brand=brand, type=model_type, desc=desc, country=country, date=date)
        new_model.save()
        return new_model

    @classmethod
    def update_model(cls, model_id: int, model_value: str, brand: str, model_type: str, desc: str, country: str, date: str):
        if cls.objects.filter(model=model_value, brand=brand).exclude(id=model_id).exists():
            raise ValidationError(f"Модель '{model_value}' с брендом '{brand}' уже существует.")

        existing_model = cls.objects.get(id=model_id)

        existing_model.model = model_value
        existing_model.brand = brand
        existing_model.type = model_type
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
    def get_filtered_models(cls, query=None):
        data = {}
        models = cls.objects.all()

        if query:
            models = models.annotate(
                relevance=Case(
                    When(model__iexact=query, then=Value(1)),
                    When(brand__iexact=query, then=Value(2)),
                    When(type__iexact=query, then=Value(3)),
                    When(country__iexact=query, then=Value(4)),
                    When(desc__iexact=query, then=Value(5)),
                    default=Value(6),
                    output_field=IntegerField()
                )
            ).filter(
                Q(model__icontains=query) |
                Q(brand__icontains=query) |
                Q(type__icontains=query) |
                Q(country__icontains=query) |
                Q(desc__icontains=query)
            ).order_by('relevance')

        for model in models:
            data[model.model] = {
                "id": model.id,
                "brand": model.brand,
                "type": model.type,
                "date": int(datetime(model.date.year, model.date.month, model.date.day).timestamp()),
                "country": model.country,
                "desc": model.desc
            }
        return data
