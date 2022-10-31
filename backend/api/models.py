from django.db import models
from django.core.validators import FileExtensionValidator
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class UserGroupManager(BaseUserManager):
    def create_user(self, group_name, password, **other_fields):
        if not group_name:
            raise ValueError('You must provide a group name')

        user = self.model(group_name=group_name, **other_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, group_name, password, **other_fields):
        other_fields.setdefault('is_admin', True)
        other_fields.setdefault('is_staff', True)
        other_fields.setdefault('is_superuser', True)

        if other_fields.get('is_staff') is not True:
            raise ValueError('Superuser must be assigned to is_staff=True')

        if other_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must be assigned to is_superuser=True')

        return self.create_user(group_name, password, **other_fields)


class UserGroup(AbstractBaseUser, PermissionsMixin):
    id = models.AutoField('id', primary_key=True)
    created_at = models.DateTimeField('created at', auto_now_add=True)
    group_name = models.CharField('group name', max_length=50, unique=True)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    objects = UserGroupManager()

    USERNAME_FIELD = 'group_name'
    
    def __str__(self):
        return self.group_name

class Demo(models.Model):
    id = models.AutoField("demo id", primary_key=True)
    created_at = models.DateTimeField("created at", auto_now=True)
    group_id = models.ForeignKey(UserGroup, on_delete=models.CASCADE)
    title = models.CharField("title", max_length=240, unique=True)
    short_desc = models.CharField("short desc", max_length=240)
    detail_desc = models.CharField("detail desc", max_length=240)
    file = models.FileField(upload_to='demo_files', validators=[FileExtensionValidator( ['py'] ) ])
    user_groups = models.ManyToManyField(UserGroup, related_name='accessible_demos', blank=True)
    
    def __str__(self):
        return str(self.id)

class Instance(models.Model):
    id = models.AutoField("instance id", primary_key=True)
    created_at = models.DateTimeField("created at", auto_now_add=True)
    group_id = models.ForeignKey(UserGroup, on_delete=models.CASCADE)
    demo = models.ForeignKey(Demo, on_delete=models.CASCADE)
    host = models.CharField("host", max_length=240, blank=True, default="")
    pid = models.IntegerField("pid", blank=True, default=0)
    
    def __str__(self):
        return str(self.id)

class FeedbackType(models.Model):
    id = models.AutoField("type id", primary_key=True)
    created_at = models.DateTimeField("created at", auto_now_add=True)
    name = models.CharField("name", max_length=240, unique=True)
    
    def __str__(self):
        return str(self.id)

class Feedback(models.Model):
    id = models.AutoField("feedback id", primary_key=True)
    created_at = models.DateTimeField("created at", auto_now_add=True)
    #details should be models.TextField?
    details = models.CharField("details", max_length=240)
    generated_details = models.CharField("generated details", max_length=1500, blank=True, default='')
    type = models.ForeignKey(FeedbackType, on_delete=models.CASCADE)
    demo = models.ForeignKey(Demo, on_delete=models.CASCADE)
    
    def __str__(self):
        return str(self.id)