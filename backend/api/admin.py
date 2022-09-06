from django.contrib import admin
from .models import User, Demo, Host, Instance, FeedbackType, Feedback 

# Register your models here.
admin.site.register(User)
admin.site.register(Demo)
admin.site.register(Host)
admin.site.register(Instance)
admin.site.register(FeedbackType)
admin.site.register(Feedback)