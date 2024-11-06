import json
from datetime import datetime

from django.core.exceptions import ValidationError
from django.core.handlers.wsgi import WSGIRequest
from django.http import StreamingHttpResponse, JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .services import MarkJSON
from .utils import write_to_data, get_data_json
from .models import DBModel


@api_view(['PUT'])
def change_model_db(request: WSGIRequest):
    if not request.body:
        return Response({'error': 'Пустое тело запроса'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        mark_data = json.loads(request.body)
    except json.JSONDecodeError:
        return Response({'error': 'Некорректный JSON'}, status=status.HTTP_400_BAD_REQUEST)

    # Проверяем данные с помощью `MarkJSON.validate` и продолжаем только при успехе
    mark_id = mark_data.pop('id', None)
    response = MarkJSON.validate(mark_data)
    if response.status_code == status.HTTP_200_OK:
        try:
            DBModel.update_model(
                mark_id,
                mark_data["model"],
                mark_data["brand"],
                mark_data["type"],
                mark_data["desc"],
                mark_data["country"],
                mark_data["date"]
            )
            return Response(status=status.HTTP_200_OK)

        except ValidationError as e:
            return Response({'error': f'{e.message}'}, status=status.HTTP_400_BAD_REQUEST)
    return Response(response.data, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def send_json_form_db(request: WSGIRequest):
    if not request.body:
        return Response({'error': 'Пустое тело запроса'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        mark_data = json.loads(request.body)
    except json.JSONDecodeError:
        return Response(status=status.HTTP_400_BAD_REQUEST, data={'error': 'Некорректный JSON'})

    response: Response = MarkJSON.validate(mark_data)
    if response.status_code == status.HTTP_200_OK:
        if not DBModel.model_exists(mark_data["model"]):
            DBModel.add_to_database(mark_data["model"], mark_data["brand"], mark_data["type"], mark_data["desc"], mark_data["country"], mark_data["date"])
            return Response(status=status.HTTP_200_OK)


@api_view(['GET'])
def get_filtered_models(request: WSGIRequest):
    search_query = request.GET.get('query', '')
    return JsonResponse(DBModel.get_filtered_models(search_query), status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_model_db(request):
    try:
        DBModel.delete_from_database(json.loads(request.body)["id"])
        return Response({"message": "Модель успешно удалена."}, status=status.HTTP_204_NO_CONTENT)
    except DBModel.DoesNotExist:
        return Response({"error": "Модель не найдена."}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def send_json_form(request: WSGIRequest):
    if not request.body:
        return Response({'error': 'Пустое тело запроса'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        mark_data = json.loads(request.body)
    except json.JSONDecodeError:
        return Response(status=status.HTTP_400_BAD_REQUEST, data={'error': 'Некорректный JSON'})

    response: Response = MarkJSON.validate(mark_data)
    if response.status_code == status.HTTP_200_OK:
        write_to_data(mark_data)
    return response


@api_view(['POST'])
def send_json_as_file(request: WSGIRequest):
    if 'file' not in request.FILES:
        return Response(status=status.HTTP_400_BAD_REQUEST, data={'error': 'Файл не найден'})
    json_file = request.FILES['file']

    try:
        mark_data = json.load(json_file)
    except json.JSONDecodeError:
        return Response(status=status.HTTP_400_BAD_REQUEST, data={'error': 'Некорректный JSON в файле'})

    response: Response = MarkJSON.validate(mark_data)
    if response.status_code == status.HTTP_200_OK:
        try:
            datetime.strptime(mark_data['date'], '%Y-%m-%d')
        except ValueError:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'error': 'Некорректный формат даты, он должен соответствовать "%Y-%m-%d"'})
        write_to_data(mark_data)
    return response


@api_view(['GET'])
def download_data_file(request: WSGIRequest):
    result = get_data_json()
    response = StreamingHttpResponse(result, content_type='application/json', status=status.HTTP_200_OK)

    # Устанавливаем заголовок Content-Disposition для загрузки файла
    response['Content-Disposition'] = f'attachment; filename="data.json"'

    return response


@api_view(['GET'])
def get_data_content(request: WSGIRequest):
    result = get_data_json()
    return JsonResponse(json.loads(result), status=status.HTTP_200_OK)