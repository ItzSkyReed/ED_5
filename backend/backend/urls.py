"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from app import views
# ОТ ЛИЦА ЮЗЕРА
urlpatterns = [
    path('admin/', admin.site.urls),
    path('post/send_json_form', views.send_json_form),
    path('post/send_json_as_file', views.send_json_as_file),
    path('get/download_data_file', views.download_data_file),
    path('get/get_data_content', views.get_data_content),

    path('post/send_json_form_db', views.send_json_form_db),
    path('get/get_filtered_models', views.get_filtered_models),
    path('put/change_model_db', views.change_model_db),
    path('delete/delete_model_db', views.delete_model_db),
]
