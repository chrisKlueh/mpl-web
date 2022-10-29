from django.urls import re_path
from api import views


urlpatterns = [
    re_path(r'^api/users/$', views.UserList.as_view()),
    re_path(r'^api/users/([0-9]*)$', views.UserDetail.as_view()),
    re_path(r'^api/demos/$', views.DemoList.as_view()),
    re_path(r'^api/demos/([0-9]*)$', views.DemoDetail.as_view()),
    re_path(r'^api/feedback/$', views.FeedbackList.as_view()),
    re_path(r'^api/feedback/([0-9]*)$', views.FeedbackDetail.as_view()),
    re_path(r'^api/instances/$', views.InstanceList.as_view()),
    re_path(r'^api/instances/([0-9]*)$', views.InstanceDetail.as_view()),
    re_path(r'^api/login/$', views.Login.as_view()),
]