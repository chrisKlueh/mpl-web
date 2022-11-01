from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import UserGroup, Demo, Instance, FeedbackType, Feedback

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)

        userGroup = UserGroup.objects.get(group_name=attrs['group_name'])
        data['group_name'] = userGroup.group_name
        data['group_id'] = userGroup.id
        data['is_admin'] = userGroup.is_admin
        data['created_at'] = userGroup.created_at
        
        return data

class DemoSerializer(serializers.ModelSerializer):
    file = serializers.FileField(write_only=True)
    name = serializers.SerializerMethodField()

    def get_name(self, demo):
        return(demo.group_id.group_name)
        
    class Meta:
        model = Demo 
        fields = ('id', 'name', 'created_at', 'group_id', 'title', 'short_desc', 'detail_desc', 'file', 'user_groups')

class DemoSerializerShort(serializers.ModelSerializer):
    
    class Meta:
        model = Demo 
        fields = ('id', 'title')

class UserGroupSerializer(serializers.ModelSerializer):
    group_name = serializers.CharField(required=True)
    is_admin = serializers.BooleanField()
    password = serializers.CharField(min_length=8, write_only=True)
    accessible_demos = DemoSerializerShort(many=True, required=False)
    
    class Meta:
        model = UserGroup
        fields = ('id', 'group_name', 'is_admin', 'password', 'created_at', 'accessible_demos')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)  # as long as the fields are the same, we can just use this
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

class InstanceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Instance 
        fields = ('id', 'created_at', 'group_id', 'demo', 'host', 'pid')

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
        fields = ('id', 'created_at', 'details' , 'generated_details', 'type', 'demo', 'demo_title')