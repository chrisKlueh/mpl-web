from functools import partial
from django.http import Http404

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework import status, exceptions, generics
from rest_framework.permissions import BasePermission

from django.db.models.signals import pre_delete, pre_save
from django.dispatch.dispatcher import receiver

from .models import User, Demo, Instance, Host, FeedbackType, Feedback
from .serializers import *

class OnlyAdminPermission(BasePermission):
    def __init__(self, key, restricted_methods):
        super().__init__()
        self.key = key
        self.restricted_methods = restricted_methods
        
    def has_permission(self, request, view):
        print("checking for has_permission")
        print(request.data)
        if request.method in self.restricted_methods:
            try:
                user = User.objects.get(pk=request.data[self.key])
                if not user.is_admin:
                    raise exceptions.PermissionDenied(detail="Only admins can perform this action.")
                else:
                    return user.is_admin
            except User.DoesNotExist:
                raise exceptions.NotFound(detail="User does not exist.")
        else:
            return True

    #not called for list views
    def has_object_permission(self, request, view, obj):
        print("checking for has_object_permission")
        print(request)
        print(view)
        print(obj)
        return True
class UserList(APIView):
    def get(self, request, format=None):
        
        userList = User.objects.values('name', 'id', 'created_at', 'is_admin')
        serializer = UserSerializer(userList, context={'request': request}, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDetail(APIView):
    def get_object(self, pk):
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        user = self.get_object(pk)
        serializer = UserSerializer(user, context={'request': request})
        return Response(serializer.data)

    def delete(self, request, pk, format=None):
        user = self.get_object(pk)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class DemoList(APIView):
    permission_classes = [partial(OnlyAdminPermission, 'user_id', ['POST'])]
    def get(self, request, format=None):
        
        demoList = Demo.objects.all()
        serializer = DemoSerializer(demoList, context={'request': request}, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = DemoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DemoDetail(APIView):
    permission_classes = [partial(OnlyAdminPermission, 'user_id', ['PUT', 'DELETE'])]
    def get_object(self, pk):
        try:
            return Demo.objects.get(pk=pk)
        except Demo.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        demo = self.get_object(pk)
        serializer = DemoSerializer(demo, context={'request': request})
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        demo = self.get_object(pk)
        serializer = DemoSerializer(demo, data=request.data,context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        demo = self.get_object(pk)
        demo.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class FeedbackList(APIView):
    def get(self, request, format=None):
        
        feedbackList = Feedback.objects.all()
        serializer = FeedbackSerializer(feedbackList, context={'request': request}, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = FeedbackSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FeedbackDetail(APIView):
    permission_classes = [partial(OnlyAdminPermission, 'user_id', ['GET', 'DELETE'])]
    def get_object(self, pk):
        try:
            return Feedback.objects.get(pk=pk)
        except Feedback.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        feedbackDetail = self.get_object(pk)
        serializer = FeedbackSerializer(feedbackDetail, context={'request': request})
        return Response(serializer.data)

    def delete(self, request, pk, format=None):
        feedbackDetail = self.get_object(pk)
        feedbackDetail.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

#todo
class Login(APIView):
    def get_object(self, name):
        try:
            return User.objects.get(name=name)
        except User.DoesNotExist:
            raise Http404

    def post(self, request, format=None):
        print(request.data)
        user = self.get_object(request.data["username"])
        serializer = UserSerializer(user, context={'request': request})
        return Response(serializer.data)

@receiver(pre_delete, sender=Demo)
def demo_file_delete(sender, instance, **kwargs):
    instance.file.delete(False)

@receiver(pre_save, sender=Demo)
def demo_file_delete_outdated(sender, instance, **kwargs):
    #delete old file if instance already exists (= update)
    if instance.pk != None:
        demo = Demo.objects.get(pk=instance.pk)
        demo.file.delete(False)