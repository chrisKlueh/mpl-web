from rest_framework import serializers
#from .models import Student
from .models import User, Demo, Instance, Host, FeedbackType, Feedback

# class StudentSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = Student 
#         fields = ('pk', 'name', 'email', 'document', 'phone', 'registrationDate')

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User 
        fields = ('id', 'created_at', 'name', 'is_admin', 'password')

class DemoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Demo 
        fields = ('id', 'created_at', 'created_by', 'title', 'short_desc', 'detail_desc', 'file_path')

class HostSerializer(serializers.ModelSerializer):

    class Meta:
        model = Host 
        fields = ('id', 'created_at', 'ip_address')

class InstanceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Instance 
        fields = ('id', 'created_at', 'user_id', 'host_id', 'port')

class FeedbackTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = FeedbackType 
        fields = ('id', 'created_at', 'name')

class FeedbackSerializer(serializers.ModelSerializer):

    class Meta:
        model = Feedback
        fields = ('id', 'created_at', 'details', 'type', 'demo')