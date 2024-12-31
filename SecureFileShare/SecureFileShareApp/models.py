from django.db import models

# Create your models here.
class Users(models.Model):
    user_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    mobile = models.CharField(max_length=15)
    email = models.CharField(max_length=100)
    password = models.CharField(max_length=200)
    status = models.BooleanField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    role_id = models.IntegerField()

class UserRole(models.Model):
    user_role_id = models.AutoField(primary_key=True)
    role_name = models.CharField(max_length=200)

class RolePermission(models.Model):
    role_permission_id = models.AutoField(primary_key=True)
    permissions = models.CharField(max_length=200)
    role_id = models.IntegerField()

class FileMetadata(models.Model):
    file_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=300)
    extension = models.CharField(max_length=100)
    type = models.CharField(max_length=200, blank=True, null=True)
    file_path = models.CharField(max_length=500, blank=True, null=True)
    file_url = models.CharField(max_length=500, blank=True, null=True)
    file_size = models.CharField(max_length=500)
    updated_at = models.DateTimeField()
    status = models.CharField(max_length=100)
    updated_by = models.IntegerField()

class ShareFile(models.Model):
    share_file_id = models.AutoField(primary_key=True)
    file_id = models.IntegerField()
    shared_by = models.IntegerField()
    shared_at = models.DateTimeField()
    
class SharedFileUsers(models.Model):
    id = models.AutoField(primary_key=True)
    can_view = models.BooleanField()
    can_download = models.BooleanField()
    share_file_id = models.IntegerField()
    share_to = models.IntegerField()





    
