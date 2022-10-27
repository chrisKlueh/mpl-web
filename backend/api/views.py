import subprocess
import signal
import os

from uuid import getnode
from functools import partial
from django.http import Http404
from django.db.models.signals import pre_delete, pre_save
from django.dispatch.dispatcher import receiver

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework import status, permissions, exceptions, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.permissions import BasePermission

from .models import UserGroup, Demo, Instance, FeedbackType, Feedback
from .serializers import *


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserGroupCreateView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format='json'):
        serializer = UserGroupSerializer(data=request.data)
        if serializer.is_valid():
            user_group = serializer.save()
            if user_group:
                json = serializer.data
                return Response(json, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class HelloWorldView(APIView):
    def get(self, request):
        return Response(data={"hello":"world"}, status=status.HTTP_200_OK)

#logs user out and blacklists user's refresh token
class LogoutAndBlacklistRefreshTokenView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

#########################################

class OnlyAdminPermission(BasePermission):
    def __init__(self, restricted_methods):
        super().__init__()
        self.restricted_methods = restricted_methods
        
    def has_permission(self, request, view):
        print("checking for has_permission")
        print(request.data)
        if request.method in self.restricted_methods:
            try:
                userGroup = UserGroup.objects.get(pk=request.data['group_id'])
                if not userGroup.is_admin:
                    raise exceptions.PermissionDenied(detail="Only admins can perform this action.")
                else:
                    return userGroup.is_admin
            except UserGroup.DoesNotExist:
                raise exceptions.NotFound(detail="User group does not exist.")
        else:
            return True

    #not called for list views
    def has_object_permission(self, request, view, obj):
        print("checking for has_object_permission")
        print(request)
        print(view)
        print(obj)
        return True

class UserGroupList(APIView):
    def get(self, request, format=None):
        userGroupList = UserGroup.objects.values('group_name', 'id', 'created_at', 'is_admin')
        serializer = UserGroupSerializer(userGroupList, context={'request': request}, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = UserGroupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserGroupDetail(APIView):
    def get_object(self, pk):
        try:
            return UserGroup.objects.get(pk=pk)
        except UserGroup.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        userGroup = self.get_object(pk)
        serializer = UserGroupSerializer(userGroup, context={'request': request})
        return Response(serializer.data)

    def delete(self, request, pk, format=None):
        userGroup = self.get_object(pk)
        userGroup.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class DemoList(APIView):
    permission_classes = [permissions.IsAuthenticated, partial(OnlyAdminPermission, ['POST'])]
    def get(self, request, format=None):
        demoList = Demo.objects.all().order_by('-created_at')
        serializer = DemoSerializer(demoList, context={'request': request}, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = DemoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DemoDetail(APIView):
    permission_classes = [permissions.IsAuthenticated, partial(OnlyAdminPermission, ['PUT', 'DELETE'])]
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
        
        feedbackList = Feedback.objects.all().order_by('-created_at')
        serializer = FeedbackSerializer(feedbackList, context={'request': request}, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = FeedbackSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class InstanceList(APIView):
    def spawnInstance(self, demoId, instanceId, userGroupId):
        hostId = hex(getnode())
        demoFile = Demo.objects.get(pk=demoId).file
        demoFileString = str(demoFile).split("/")[1]
        print(demoFileString)
        demoFileString = demoFileString[:len(demoFileString) - 3]
        print(demoFileString)
        p = subprocess.Popen(('python3 ./api/remotePlotStream.py' + " --instance_id " + str(instanceId) + " --group_id " + str(userGroupId) + " --demo " + str(demoFileString)).split(), shell=False)
        return hostId, p.pid
        
    def get(self, request, format=None): 
        instanceList = Instance.objects.all()
        serializer = InstanceSerializer(instanceList, context={'request': request}, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        instanceData = {'group_id': request.data["group_id"], 'demo': request.data["demo"]}
        print(instanceData)
        #try:
        serializer = InstanceSerializer(data=instanceData)
        if serializer.is_valid():
            instance = serializer.save()
            host, pid = self.spawnInstance(instanceData['demo'], instance.id, instanceData['group_id'])
            instanceData['host'] = host
            instanceData['pid'] = pid
            InstanceDetail.get_object(self, instance.id)
            serializer = InstanceSerializer(instance, data=instanceData,context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                instance = self.get_object(id)
                instance.delete()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        #except:
        #    return Response(status=status.HTTP_503_SERVICE_UNAVAILABLE)

class InstanceDetail(APIView):
    def get_object(self, pk):
        try:
            return Instance.objects.get(pk=pk)
        except Instance.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        instance = self.get_object(pk)
        serializer = InstanceSerializer(instance, context={'request': request})
        return Response(serializer.data)

    def delete(self, request, pk, format=None):
        instance = self.get_object(pk)
        group_id = instance.group_id.id
        #print(group_id)
        #print(request.data["group_id"])
        #host = instance.host
        #pid = instance.pid
        #if request.data["host"] == str(host) and request.data["pid"] == str(pid) and request.data["user_id"] == str(user_id):
        if request.data["group_id"] == str(group_id):
            try:
                instance.delete()
                os.kill(instance.pid, signal.SIGSTOP)
            except Exception as e:
                if type(e) == ProcessLookupError:
                    return Response(status=status.HTTP_404_NOT_FOUND)        
                else:
                    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)    
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        

class FeedbackDetail(APIView):
    permission_classes = [permissions.IsAuthenticated, partial(OnlyAdminPermission, ['DELETE'])]
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
#class Login(APIView):
#    def get_object(self, name):
#        try:
#            return User.objects.get(name=name)
#        except User.DoesNotExist:
#            raise Http404
#
#    def post(self, request, format=None):
#        print(request.data)
#        user = self.get_object(request.data["username"])
#        serializer = UserSerializer(user, context={'request': request})
#        return Response(serializer.data)

@receiver(pre_delete, sender=Demo)
def demo_file_delete(sender, instance, **kwargs):
    instance.file.delete(False)

@receiver(pre_save, sender=Demo)
def demo_file_delete_outdated(sender, instance, **kwargs):
    #delete old file if instance already exists (= update)
    if instance.pk != None:
        demo = Demo.objects.get(pk=instance.pk)
        demo.file.delete(False)