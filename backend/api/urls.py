from django.urls import path, re_path
from rest_framework_simplejwt import views as jwt_views
from .views import UserGroupCreate, HelloWorldView, UserGroupList, UserGroupDetail, DemoList, DemoDetail, InstanceList, InstanceDetail, FeedbackList, FeedbackDetail

urlpatterns = [
    path('usergroup/create/', UserGroupCreate.as_view(), name='create_user_group'),
    path('hello/', HelloWorldView.as_view(), name='hello_world'),
    path('token/obtain/', jwt_views.TokenObtainPairView.as_view(), name='token_create'),#override sjwt stock token
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    re_path(r'users/$', UserGroupList.as_view()),
    re_path(r'users/([0-9]*)$', UserGroupDetail.as_view()),
    re_path(r'demos/$', DemoList.as_view()),
    re_path(r'demos/([0-9]*)$', DemoDetail.as_view()),
    re_path(r'feedback/$', FeedbackList.as_view()),
    re_path(r'feedback/([0-9]*)$', FeedbackDetail.as_view()),
    re_path(r'instances/$', InstanceList.as_view()),
    re_path(r'instances/([0-9]*)$', InstanceDetail.as_view()),
]