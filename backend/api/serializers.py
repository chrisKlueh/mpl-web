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

class UserGroupSerializerShort(serializers.ModelSerializer):
    
    class Meta:
        model = UserGroup 
        fields = ('id',)

class DemoSerializerShort(serializers.ModelSerializer):
    
    class Meta:
        model = Demo 
        fields = ('id',)

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
        accessible_demos = validated_data.pop('accessible_demos', None)
        instance = UserGroup.objects.create(**validated_data)
        if password is not None:
            instance.set_password(password)
        if accessible_demos is not None:
            for accessible_demo in accessible_demos:
                instance.accessible_demos.add(accessible_demo)
        return instance

    def update(self, instance, validated_data):
        accessible_demos = validated_data.pop('accessible_demos')
        instance.group_name = validated_data.get('group_name', instance.group_name)
        instance.is_admin = validated_data.get('is_admin', instance.is_admin)
        instance.password = validated_data.get('password', instance.password)
        instance.accessible_demos.clear()
        for accessible_demo in accessible_demos:
            instance.accessible_demos.add(accessible_demo)
        instance.save()
        return instance

    def to_internal_value(self, data):
        accessibleDemoObjects = []
        for accessible_demo in data['accessible_demos'].split(','):
            accessibleDemoObjects.append(Demo.objects.get(pk=accessible_demo))
        validated_data = super().to_internal_value(data)
        validated_data['accessible_demos'] = accessibleDemoObjects
        return validated_data

class DemoSerializer(serializers.ModelSerializer):
    file = serializers.FileField(write_only=True)
    creator = serializers.SerializerMethodField()
    user_groups = UserGroupSerializerShort(many=True, required=False)

    def get_creator(self, demo):
        return(demo.group_id.group_name)
        
    class Meta:
        model = Demo 
        fields = ('id', 'creator', 'created_at', 'group_id', 'title', 'short_desc', 'detail_desc', 'file', 'user_groups')

    def create(self, validated_data):
        user_groups = validated_data.pop('user_groups')
        demo = Demo.objects.create(**validated_data)
        for user_group in user_groups:
            demo.user_groups.add(user_group)
        return demo
    
    def update(self, instance, validated_data):
        user_groups = validated_data.pop('user_groups')
        instance.group_id = validated_data.get('group_id', instance.group_id)
        instance.title = validated_data.get('title', instance.title)
        instance.short_desc = validated_data.get('short_desc', instance.short_desc)
        instance.detail_desc = validated_data.get('detail_desc', instance.detail_desc)
        instance.file = validated_data.get('file', instance.file)
        instance.user_groups.clear()
        for user_group in user_groups:
            instance.user_groups.add(user_group)
        instance.save()
        return instance

    def to_internal_value(self, data):
        userGroupObjects = []
        for user_group in data['user_groups'].split(','):
            userGroupObjects.append(UserGroup.objects.get(pk=user_group))
        validated_data = super().to_internal_value(data)
        validated_data['user_groups'] = userGroupObjects
        return validated_data
        

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