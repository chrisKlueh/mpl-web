from django.contrib import admin
from django.urls import path, re_path
from api import views

urlpatterns = [
    path('admin/', admin.site.urls),
    #re_path(r'^api/students/$', views.students_list),
    #re_path(r'^api/students/([0-9])$', views.students_detail),
    re_path(r'^api/users/$', views.user_list),
    re_path(r'^api/users/([0-9]*)$', views.user_detail),
    re_path(r'^api/demos/$', views.demo_list),
    re_path(r'^api/demos/([0-9]*)$', views.demo_detail),
    re_path(r'^api/feedback/$', views.feedback_list),
    re_path(r'^api/feedback/([0-9]*)$', views.feedback_detail),
    re_path(r'^api/login/$', views.login),
]