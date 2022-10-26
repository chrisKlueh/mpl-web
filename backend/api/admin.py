from django.contrib import admin
from .models import UserGroup
from django.contrib.auth.admin import UserAdmin

class UserAdminConfig(UserAdmin):
    ordering = ('-created_at',)
    list_display = ('id', 'group_name', 'created_at', 'is_admin', 'is_superuser')
    fieldsets = (
        (None, {'fields': ('group_name', 'is_active')}),
        ('Permissions', {'fields': ('is_admin', 'is_staff', 'is_superuser',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('group_name', 'is_admin', 'password1', 'password2', 'is_active', 'is_staff')
        }),
    )

admin.site.register(UserGroup, UserAdminConfig)
