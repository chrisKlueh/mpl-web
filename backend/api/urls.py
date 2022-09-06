from django.urls import re_path
from api import views

urlpatterns = [
    re_path(r'^api/users/$', views.user_list),
    re_path(r'^api/users/([0-9]*)$', views.user_detail),
    re_path(r'^api/demos/$', views.demo_list),
    re_path(r'^api/demos/([0-9]*)$', views.demo_detail),
    re_path(r'^api/feedback/$', views.feedback_list),
    re_path(r'^api/feedback/([0-9]*)$', views.feedback_detail),
    re_path(r'^api/login/$', views.login),
]