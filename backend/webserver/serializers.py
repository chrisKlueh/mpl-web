from rest_framework import serializers
#from .models import Student
from .models import User, Demo, Instance, Host, FeedbackType, Feedback

# class StudentSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = Student 
#         fields = ('pk', 'name', 'email', 'document', 'phone', 'registrationDate')

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User 
        fields = ('id', 'created_at', 'name', 'password', 'is_admin')

class DemoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Demo 
        fields = ('demo_id', 'created_at', 'user_id', 'title', 'short_desc', 'detail_desc', 'file_path')

class HostSerializer(serializers.ModelSerializer):

    class Meta:
        model = Host 
        fields = ('host_id', 'created_at', 'ip_address')

class InstanceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Instance 
        fields = ('instance_id', 'created_at', 'user_id', 'host_id', 'port')

class FeedbackTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = FeedbackType 
        fields = ('type_id', 'created_at', 'name')

class FeedbackSerializer(serializers.ModelSerializer):

    class Meta:
        model = Feedback
        fields = ('feedback_id', 'created_at', 'details', 'type_id', 'demo_id')