from rest_framework import status
from rest_framework.response import Response


class MarkJSON:

    @staticmethod
    def validate(json_data: dict) -> Response:

        # Проверяем структуру данных
        if not isinstance(json_data, dict):
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'error': 'Некорректный JSON формат, ожидается объект'})

        # Проверяем валидность полей
        if not MarkJSON.validate_fields(json_data):
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'error': 'Обнаружены лишние JSON поля'})

        # Проверяем лимиты длины
        if not MarkJSON.check_limits(json_data):
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'error': 'Обнаружены пустые строки, или слишком длинные значения'})

        return Response(status=status.HTTP_200_OK)

    @staticmethod
    def validate_fields(json_data: dict) -> bool:
        required_fields = {
            'brand': str,
            'model': str,
            'type': str,
            'date': str,
            'country': str,
            'desc': str
        }

        # Проверяем, что в model_data есть все необходимые поля
        if any(field not in json_data for field in required_fields):
            return False

        # Проверяем, что в model_data нет лишних полей
        if len(json_data) != len(required_fields):
            return False

        # Проверяем типы значений в model_data
        for field, field_type in required_fields.items():
            if not isinstance(json_data[field], field_type):
                return False

        return True

    @staticmethod
    def check_limits(json_data: dict) -> bool:
        limits = {"brand": 32, "type": 32, "desc": 2000, "country": 32, "date": 11}

        # Проверяем длину значений в model_data
        if any(len(json_data[key]) == 0 or len(json_data[key]) > limit for key, limit in limits.items()):
            return False

        return True
