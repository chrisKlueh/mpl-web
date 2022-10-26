from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from .views import UserGroupCreate, HelloWorldView

urlpatterns = [
    path('usergroup/create/', UserGroupCreate.as_view(), name='create_user_group'),
    path('hello/', HelloWorldView.as_view(), name='hello_world'),
    path('token/obtain/', jwt_views.TokenObtainPairView.as_view(), name='token_create'),#override sjwt stock token
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
]