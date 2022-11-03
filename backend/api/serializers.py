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
        fields = ('id', 'group_name')

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

class DemoSerializer(serializers.ModelSerializer):
    file = serializers.FileField(write_only=True)
    creator = serializers.SerializerMethodField()
    user_groups = UserGroupSerializer(many=True, required=False)

    def get_creator(self, demo):
        return(demo.group_id.group_name)
        
    class Meta:
        model = Demo 
        fields = ('id', 'creator', 'created_at', 'group_id', 'title', 'short_desc', 'detail_desc', 'file', 'user_groups')

    def create(self, validated_data):
        print("create")
        print(validated_data)
        user_groups = validated_data.pop('user_groups')
        demo = Demo.objects.create(**validated_data)
        print(demo)
        for user_group in user_groups:
            print(user_group)
            print(user_group.id)
            demo.user_groups.add(user_group)
        return demo
    
    def update(self, instance, validated_data):
        print("update")
        print(instance)
        print(validated_data)
        user_groups = validated_data.pop('user_groups')
        #demo = Demo.objects.create(**validated_data)
        #print(demo)
        instance.group_id = validated_data.get('group_id', instance.group_id)
        instance.title = validated_data.get('title', instance.title)
        instance.short_desc = validated_data.get('short_desc', instance.short_desc)
        instance.detail_desc = validated_data.get('detail_desc', instance.detail_desc)
        instance.file = validated_data.get('file', instance.file)
        instance.user_groups.clear()
        for user_group in user_groups:
            print(user_group)
            print(user_group.id)
            instance.user_groups.add(user_group)
        instance.save()
        return instance

    def to_internal_value(self, data):
        print("to_internal_value")
        print(data)
        print("super().to_internal_value")
        userGroupObjects = []
        for user_group in data['user_groups'].split(','):
            print(user_group)
            print(UserGroup.objects.get(pk=user_group))
            userGroupObjects.append(UserGroup.objects.get(pk=user_group))
        print(userGroupObjects)
        data['user_groups'] = userGroupObjects
        #creator = UserGroup.objects.get(pk=data['group_id'])
        #creator = 1
        #print(creator)
        #print(type(creator))
        #data['group_id'] = creator
        validated_data = super().to_internal_value(data)
        #validated_data = list(validated_data.items()).append(('user_groups',userGroupObjects))
        #print(validated_data)
        #validated_data = OrderedDict(validated_data)
        validated_data['user_groups'] = userGroupObjects
        print(validated_data)
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