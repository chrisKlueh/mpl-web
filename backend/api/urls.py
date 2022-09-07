from django.urls import re_path
from api import views
from api.views import UserList, UserDetail, DemoList, DemoDetail, FeedbackList, FeedbackDetail, Login


urlpatterns = [
    re_path(r'^api/users/$', UserList.as_view()),
    re_path(r'^api/users/([0-9]*)$', UserDetail.as_view()),
    re_path(r'^api/demos/$', DemoList.as_view()),
    re_path(r'^api/demos/([0-9]*)$', DemoDetail.as_view()),
    re_path(r'^api/feedback/$', FeedbackList.as_view()),
    re_path(r'^api/feedback/([0-9]*)$', FeedbackDetail.as_view()),
    re_path(r'^api/login/$', Login.as_view()),
]