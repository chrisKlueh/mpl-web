from django.contrib import admin
from django.urls import path, re_path
from webserver import views

urlpatterns = [
    path('admin/', admin.site.urls),
    #re_path(r'^api/students/$', views.students_list),
    #re_path(r'^api/students/([0-9])$', views.students_detail),
    re_path(r'^api/user/$', views.user_list),
    re_path(r'^api/user/([0-9])$', views.user_detail),
]