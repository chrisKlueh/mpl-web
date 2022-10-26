from django.db import models
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

