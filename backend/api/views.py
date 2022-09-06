import os
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from django.db.models.signals import pre_delete, pre_save
from django.dispatch.dispatcher import receiver

#from .models import Student
from .models import User, Demo, Instance, Host, FeedbackType, Feedback
from .serializers import *

@api_view(['GET', 'POST'])
def user_list(request):
    if request.method == 'GET':
        #data = User.objects.all()
        data = User.objects.values('name', 'id', 'created_at', 'is_admin')

        serializer = UserSerializer(data, context={'request': request}, many=True)

        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'DELETE'])
def user_detail(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UserSerializer(user, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'DELETE':
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
def demo_list(request):
    if request.method == 'GET':
        data = Demo.objects.all()

        serializer = DemoSerializer(data, context={'request': request}, many=True)

        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = DemoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def demo_detail(request, pk):
    try:
        demo = Demo.objects.get(pk=pk)
    except Demo.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = DemoSerializer(demo, context={'request': request})
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = DemoSerializer(demo, data=request.data,context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        demo.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
def feedback_list(request):
    if request.method == 'GET':
        data = Feedback.objects.all()

        serializer = FeedbackSerializer(data, context={'request': request}, many=True)

        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = FeedbackSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'DELETE'])
def feedback_detail(request, pk):
    try:
        feedback = Feedback.objects.get(pk=pk)
    except Feedback.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = FeedbackSerializer(feedback, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'DELETE':
        feedback.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

#todo
@api_view(['POST'])
def login(request):
    try:
        print(request.data["username"])
        user = User.objects.get(name=request.data["username"])
    except Feedback.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'POST':
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