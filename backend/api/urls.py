from django.urls import path, re_path
from rest_framework_simplejwt import views as jwt_views
from .views import CustomTokenObtainPairView, LogoutAndBlacklistRefreshTokenView, UserGroupCreateView, UserGroupList, UserGroupDetail, DemoList, DemoDetail, InstanceList, InstanceDetail, FeedbackList, FeedbackDetail

urlpatterns = [
    path('token/obtain/', CustomTokenObtainPairView.as_view(), name='token_create'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutAndBlacklistRefreshTokenView.as_view(), name='logout'),
    re_path(r'groups/$', UserGroupList.as_view()),
    re_path(r'groups/([0-9]*)$', UserGroupDetail.as_view()),
    re_path(r'demos/$', DemoList.as_view()),
    re_path(r'demos/([0-9]*)$', DemoDetail.as_view()),
    re_path(r'feedback/$', FeedbackList.as_view()),
    re_path(r'feedback/([0-9]*)$', FeedbackDetail.as_view()),
    re_path(r'instances/$', InstanceList.as_view()),
    re_path(r'instances/([0-9]*)$', InstanceDetail.as_view()),
]