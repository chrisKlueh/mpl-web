from rest_framework import serializers
from .models import User, Demo, Instance, Host, FeedbackType, Feedback

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User 
        fields = ('id', 'created_at', 'name', 'is_admin', 'password')

class DemoSerializer(serializers.ModelSerializer):
    file = serializers.FileField(write_only=True)
    name = serializers.SerializerMethodField()

    def get_name(self, demo):
        return(demo.user_id.name)
        
    class Meta:
        model = Demo 
        fields = ('id', 'name', 'created_at', 'user_id', 'title', 'short_desc', 'detail_desc', 'file')

class HostSerializer(serializers.ModelSerializer):

    class Meta:
        model = Host 
        fields = ('id', 'created_at', 'ip_address')

class InstanceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Instance 
        fields = ('id', 'created_at', 'user_id', 'demo', 'host', 'pid')

class FeedbackTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = FeedbackType 
        fields = ('id', 'created_at', 'name')

class FeedbackSerializer(serializers.ModelSerializer):
    demo_title = serializers.SerializerMethodField()

    def get_demo_title(self, feedback):
            return(feedback.demo.title)

    class Meta:
        model = Feedback
        fields = ('id', 'created_at', 'details', 'type', 'demo', 'demo_title')