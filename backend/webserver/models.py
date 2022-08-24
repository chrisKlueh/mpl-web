from django.db import models

# Create your models here.

#class Student(models.Model):
#    name = models.CharField("Name", max_length=240)
#    email = models.EmailField()
#    document = models.CharField("Document", max_length=20)
#    phone = models.CharField(max_length=20)
#    registrationDate = models.DateField("Registration Date", auto_now_add=True)
#
#    def __str__(self):
#        return self.name

class User(models.Model):
    id = models.AutoField("user_id", primary_key=True)
    created_at = models.DateTimeField("created_at", auto_now_add=True)
    name = models.CharField("name", max_length=240)
    password = models.CharField("password", max_length=240)
    is_admin = models.BooleanField("is_admin")
    
    def __str__(self):
        return self.name

class Demo(models.Model):
    id = models.AutoField("demo_id", primary_key=True)
    created_at = models.DateTimeField("created_at", auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField("title", max_length=240)
    short_desc = models.CharField("short_desc", max_length=240)
    detail_desc = models.CharField("detail_desc", max_length=240)
    file_path = models.FilePathField("file_path")
    
    def __str__(self):
        return self.name

class Host(models.Model):
    id = models.AutoField("host_id", primary_key=True)
    created_at = models.DateTimeField("created_at", auto_now_add=True)
    ip_address = models.GenericIPAddressField("host")
    
    def __str__(self):
        return self.name

class Instance(models.Model):
    id = models.AutoField("instance_id", primary_key=True)
    created_at = models.DateTimeField("created_at", auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    host = models.ForeignKey(Host, on_delete=models.CASCADE)
    port = models.IntegerField("port")
    
    def __str__(self):
        return self.name

class FeedbackType(models.Model):
    id = models.AutoField("type_id", primary_key=True)
    created_at = models.DateTimeField("created_at", auto_now_add=True)
    name = models.CharField("name", max_length=240)
    
    def __str__(self):
        return self.name

class Feedback(models.Model):
    id = models.AutoField("feedback_id", primary_key=True)
    created_at = models.DateTimeField("created_at", auto_now_add=True)
    details = models.CharField("name", max_length=240)
    type = models.ForeignKey(FeedbackType, on_delete=models.CASCADE)
    demo = models.ForeignKey(Demo, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.name

