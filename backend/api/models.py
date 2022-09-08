from django.db import models
from django.core.validators import FileExtensionValidator

class User(models.Model):
    id = models.AutoField("user_id", primary_key=True)
    created_at = models.DateTimeField("created_at", auto_now_add=True)
    name = models.CharField("name", max_length=240, unique=True)
    #temporary solution until password authentication is actually implemented
    password = models.CharField("password", max_length=240)
    is_admin = models.BooleanField("is_admin")
    
    def __str__(self):
        return str(self.id)

class Demo(models.Model):
    id = models.AutoField("demo_id", primary_key=True)
    created_at = models.DateTimeField("created_at", auto_now_add=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField("title", max_length=240, unique=True)
    short_desc = models.CharField("short_desc", max_length=240)
    #detail_desc should be models.TextField?
    detail_desc = models.CharField("detail_desc", max_length=240)
    file = models.FileField(upload_to='demo_files', validators=[FileExtensionValidator( ['py'] ) ])
    
    def __str__(self):
        return str(self.id)

class Host(models.Model):
    id = models.AutoField("host_id", primary_key=True)
    created_at = models.DateTimeField("created_at", auto_now_add=True)
    ip_address = models.GenericIPAddressField("ip_address", unique=True)
    
    def __str__(self):
        return str(self.id)

class Instance(models.Model):
    id = models.AutoField("instance_id", primary_key=True)
    created_at = models.DateTimeField("created_at", auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    demo = models.ForeignKey(Demo, on_delete=models.CASCADE)
    host = models.ForeignKey(Host, on_delete=models.CASCADE)
    port = models.IntegerField("port")
    pid = models.IntegerField("pid")
    
    class Meta:
        unique_together = ("host", "port", "pid")

    def __str__(self):
        return str(self.id)

class FeedbackType(models.Model):
    id = models.AutoField("type_id", primary_key=True)
    created_at = models.DateTimeField("created_at", auto_now_add=True)
    name = models.CharField("name", max_length=240, unique=True)
    
    def __str__(self):
        return str(self.id)

class Feedback(models.Model):
    id = models.AutoField("feedback_id", primary_key=True)
    created_at = models.DateTimeField("created_at", auto_now_add=True)
    #details should be models.TextField?
    details = models.CharField("name", max_length=240)
    type = models.ForeignKey(FeedbackType, on_delete=models.CASCADE)
    demo = models.ForeignKey(Demo, on_delete=models.CASCADE)
    
    def __str__(self):
        return str(self.id)

