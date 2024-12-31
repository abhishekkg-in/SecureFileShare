from rest_framework import serializers
from SecureFileShareApp.models import Users, UserRole, RolePermission, FileMetadata, ShareFile, SharedFileUsers

class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ('user_id', 'name', 'mobile', 'email', 'password',  'status', 'created_at',  'updated_at', 'role_id')

class UsersRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRole
        fields = ('user_role_id', 'role_name')

class RolePermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RolePermission
        fields = ('role_permission_id', 'permissions', 'role_id')

class FileMetadataSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileMetadata
        fields = ('file_id', 'title', 'extension', 'type', 'file_path', 'file_url', 'file_size', 'updated_at', 'status',  'updated_by')

class ShareFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShareFile
        fields = ('share_file_id', 'file_id', 'shared_by', 'shared_at')

class SharedFileUsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = SharedFileUsers
        fields = ('id', 'can_view', 'can_download', 'share_file_id', 'share_to')



