from django.core.exceptions import SuspiciousOperation
from django.core.handlers.wsgi import WSGIRequest
from rest_framework.response import Response
from rest_framework import status


class LimitRequestSize:
    MAX_REQUEST_SIZE = 1 * 1024 * 1024  # 1MB

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request: WSGIRequest):
        if request.method == 'POST':
            content_length = request.META.get('CONTENT_LENGTH')

            if content_length:
                try:
                    content_length = int(content_length)
                except ValueError:
                    raise SuspiciousOperation("Invalid Content-Length header")

                # Проверяем, превышает ли размер максимальный лимит
                if content_length > self.MAX_REQUEST_SIZE:
                    return Response(
                        '{"error": "Request too large"}',
                        status=413,
                        content_type='application/json'
                    )

        # Если проверка пройдена, продолжаем обработку запроса
        return self.get_response(request)