from django.urls import path
from SecureFileShareApp import views

urlpatterns = [
    path('users', views.userAPI),
    path('users/<int:id>', views.userAPI),
    path("users/all", views.get_users_data),

    path('users/role', views.user_role),
    path('users/role/<int:id>', views.user_role),
    
    path('users/register', views.user_register),
    path('users/login', views.user_login),

    path('files', views.fileAPI),
    path('files/uploaded/<int:id>', views.get_file_meta_data_by_user),

    path('files/upload', views.file_upload),
    path('files/view/<int:id>', views.view_file),

    path('files/share', views.share_file)
    
]