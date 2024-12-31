from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import render
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
from datetime import datetime
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from django.utils.timezone import now
from django.http import FileResponse, Http404
import mimetypes
import base64
import bcrypt
import json
import os

from SecureFileShareApp.models import Users, UserRole, ShareFile, SharedFileUsers, FileMetadata
from SecureFileShareApp.serializers import UsersSerializer, UsersRoleSerializer, RolePermissionSerializer, FileMetadataSerializer, ShareFileSerializer, SharedFileUsersSerializer


@csrf_exempt
def userAPI(request, id=0):
    """
    This view handles different HTTP methods for the Users model.

    GET: Retrieves all user records and serializes them to JSON format.
    POST: Retrieves a specific user's data based on the provided id and serializes it.
    PUT: Updates a specific user's data with the provided data, handling the case where the user does not exist.
    DELETE: Deletes a specific user based on the provided id.

    Each method handles exceptions and returns appropriate JSON responses with status codes.
    """
    if request.method == 'GET':
        try:
            # Retrieve all user records
            users = Users.objects.all()
            # Serialize user data
            users_serializer = UsersSerializer(users, many=True)
            res_data = {
                "message": "users data fetched...",
                "data": users_serializer.data
            }
            return JsonResponse(res_data, safe=False)
        except Exception as e:
            # Handle any exceptions during the data fetch
            res_data = {
                "message": "An error occurred fetching user data.",
                "error": str(e) 
            }
            return JsonResponse(res_data, safe=False, status=500)

    if request.method == 'POST':
        try:
            # Retrieve user data based on the provided id
            user_data = Users.objects.get(pk=id)
            # Serialize the retrieved user data
            user_serializer = UsersSerializer(instance=user_data)
            res_data = {
                "message": "Users data fetched...",
                "data": user_serializer.data
            }
            return JsonResponse(res_data, safe=False)
        except Users.DoesNotExist:
            # Handle case where the user does not exist
            res_data = {
                "message": "User not found",
                "data": None
            }
            return JsonResponse(res_data, safe=False, status=404)    
        
    if request.method == 'PUT':
        try:
            # Parse the incoming JSON request data
            data = JSONParser().parse(request)
            # Set additional fields for the user data
            data['status'] = True
            data['created_at'] = datetime.now().isoformat()
            data['updated_at'] = datetime.now().isoformat()
            data['role_id'] = 1

            # Retrieve existing user data based on the provided id
            user_data = Users.objects.get(pk=id)
            # Update the existing user data with the new data
            serializer = UsersSerializer(user_data, data=data, partial=True)
            
            if serializer.is_valid():
                # Save the updated user data
                serializer.save()

                res_data = {
                    "message": "User data updated successfully.",
                    "data": serializer.data
                }
                return JsonResponse(res_data, safe=False)
        except Users.DoesNotExist:
            # Handle case where the user does not exist
            res_data = {
                "message": "User not found",
                "data": None
            }
            return JsonResponse(res_data, safe=False, status=404)
        
        except Exception as e:
            # Handle any other exceptions during the update process
            res_data = {
                "message": "An error occurred during updating user",
                "error": str(e)
            }
            return JsonResponse(res_data, safe=False, status=404)
    
    if request.method == 'DELETE':
        try:
            # Retrieve the user record based on the provided id
            user = Users.objects.get(pk=id)
            # Delete the retrieved user record
            user.delete()
            res_data = {
                "message": "User data deleted...",
                "data": None
            }
            return JsonResponse(res_data, safe=False )

        except Users.DoesNotExist:
            # Handle case where the user
            res_data = {
                "message": f"User data not found for Id: {id} ",
                "data": None
            }
            return JsonResponse(res_data, safe=False )

@csrf_exempt
def user_role(request, id=0):
    if request.method == 'GET':
        users_role = UserRole.objects.all()
        user_role_serializer = UsersRoleSerializer(users_role, many=True)

        res_data = {
            "message": "users role data fetched...",
            "data": user_role_serializer.data
        }
        return JsonResponse(res_data, safe=False)
    
    if request.method == 'POST':
        user_role_data = JSONParser().parse(request)
        user_role_serializer = UsersRoleSerializer(data=user_role_data)

        if user_role_serializer.is_valid():
            user_role_serializer.save()
            # print("saved--data  ", user_role_serializer.data)
            message = "User Role Added Success..."
        else:
            message = "Failed to add user role..."

        res_data = {
            "message": message,
            "data": user_role_serializer.data
        }
        return JsonResponse(res_data, safe=False)
    
    if request.method == 'PUT':
        try:
            # Fetch the object to be updated
            user_role = UserRole.objects.get(pk=id)
        except UserRole.DoesNotExist:
            res_data = {
                    "message": "User role not updated...",
                    "error": "UserRole not found"
                }
            return JsonResponse(res_data, status=status.HTTP_404_NOT_FOUND)

    
        data = JSONParser().parse(request)
        serializer = UsersRoleSerializer(user_role, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()  # Save the updated data
            res_data = {
                    "message": "User role updated...",
                    "data": serializer.data
                }
            return JsonResponse(res_data, status=status.HTTP_200_OK)
        res_data = {
                "message": "User role not updated...",
                "error": serializer.errors
            }
        return JsonResponse(res_data, status=status.HTTP_400_BAD_REQUEST)
        
    
    if request.method == 'DELETE':
        try:
            users_role = UserRole.objects.get(pk=id)  # Use 'pk' for primary key
            users_role.delete()
            res_data = {
                "message": "User role data deleted...",
                "data": None
            }
            return JsonResponse(res_data, safe=False )

        except UserRole.DoesNotExist:
            res_data = {
                "message": f"User role data not found for Id: {id} ",
                "data": None
            }
            return JsonResponse(res_data, safe=False )


@csrf_exempt
def user_register(request, id=0):
    if request.method == 'POST':
        user_data = JSONParser().parse(request) # name, mobile, email, password
        user_data['status'] = True
        user_data['created_at'] = datetime.now().isoformat()
        user_data['updated_at'] = datetime.now().isoformat()
        user_data['role_id'] = 1
        # print("user data for registration -->> ",user_data)

        try:
            # validating email exists or not
            email = user_data.get('email')
            if Users.objects.filter(email=email).exists():
                res_data = {
                    "message": "User with this email already exists.",
                    "data": None
                }
                return JsonResponse(res_data, safe=False, status=400)
            
            # Hashing the password
            plain_password = user_data.get('password')
            if plain_password:
                hashed_password = bcrypt.hashpw(
                    plain_password.encode('utf-8'),
                    bcrypt.gensalt()
                )
                user_data['password'] = hashed_password.decode('utf-8')


            user_serializer = UsersSerializer(data=user_data)

            if user_serializer.is_valid():
                user_serializer.save()
                # print("success --->> ", user_serializer.data)
                res_data = {
                    "message": "User registered...",
                    "data": user_serializer.data
                }
                return JsonResponse(res_data, safe=False)
            else:
                res_data = {
                    "message": "User registration failed.",
                    "errors": user_serializer.errors
                }
                return JsonResponse(res_data, safe=False)
        except Exception as e:
            res_data = {
                "message": "An error occurred during user registration.",
                "error": str(e)  
            }
            return JsonResponse(res_data, safe=False, status=500)


@csrf_exempt
def user_login(request, id=0):
    if request.method == 'POST':
        login_data = JSONParser().parse(request) # name, mobile, email, password
        # print("user data for registration -->> ",user_data)
        try:
            email = login_data.get('email')
            plain_password = login_data.get('password')

            try:
                user = Users.objects.get(email=email)  # Fetch user by email
            except Users.DoesNotExist:
                return JsonResponse(
                    {"message": "User does not exist with this email."},
                    safe=False,
                    status=401
                )
            
            stored_hashed_password = user.password
            if bcrypt.checkpw(plain_password.encode('utf-8'), stored_hashed_password.encode('utf-8')):
                # Login successful
                refresh = CustomRefreshToken.for_user(user)
                access_token = str(refresh.access_token)
                role = UserRole.objects.get(pk=user.role_id)
                res_data = {
                    "message": "Login successful.",
                    "data": {
                        "id": user.user_id,
                        "name": user.name,
                        "email": user.email,
                        "mobile": user.mobile,
                        "role": role.role_name,
                        "token": access_token,
                    }
                }
                return JsonResponse(res_data, safe=False, status=200)
            else:
                # Invalid password
                return JsonResponse(
                    {"message": "Incorrect password, try again."},
                    safe=False,
                    status=401
                )
            
        except Exception as e:
            # Handle unexpected errors
            res_data = {
                "message": "An error occurred during login.",
                "error": str(e)  # Include error message for debugging
            }
            return JsonResponse(res_data, safe=False, status=500)


@csrf_exempt
def fileAPI(request, id=0):
    if request.method == 'GET':
        try:
            files = FileMetadata.objects.all()
            files_serializers = FileMetadataSerializer(files, many=True)
            res_data = {
                    "message": "Files fatched...",
                    "files": files_serializers.data
            }
            return JsonResponse(res_data, safe=False, status=500)
        except Exception as e:
            res_data = {
                    "message": "An Error occured.",
                    "error": str(e) 
            }
            return JsonResponse(res_data, safe=False, status=500)


@csrf_exempt
def file_upload(request, id=0):
    if request.method == 'POST': 
        try:
            file = request.FILES.get('file')
            meta_data_json = request.POST.get('metaData', '{}')
            print('meta_data -->> ', meta_data_json);

            try:
                meta_data = json.loads(meta_data_json)
                print("meta data inside try ---->> ", meta_data)
            except json.JSONDecodeError:
                return JsonResponse({'error': 'Invalid metaData format'}, status=400)

            if not file:
                res_data = {
                        "message": "file not found",
                          # Include error message for debugging
                }
                return JsonResponse(res_data, safe=False, status=500)

            key = b'6v9X$2bF+P3@q!Wz'
            decrypted_data = decrypt_file(file, key)
            file_extension = meta_data['extension']
        
            new_file_meta_data = {
                "title": meta_data['title'],
                "extension": meta_data['extension'],
                "file_path": "",
                "file_url": "",
                "type": meta_data['type'],
                "file_size": str(meta_data['fileSize']),
                "updated_at": now(),
                "status": "active",
                "updated_by": meta_data['updatedBy']
            }

            print(new_file_meta_data)

            new_file_meta_data_serializer = FileMetadataSerializer(data=new_file_meta_data)

            if new_file_meta_data_serializer.is_valid():
                saved_metaData = new_file_meta_data_serializer.save()
                # print("file_id  --->> ", saved_metaData.file_id)


                uploads_folder = 'uploads'
                if not os.path.exists(uploads_folder):
                    os.makedirs(uploads_folder)
                
                file_name = f"{saved_metaData.file_id}.{file_extension}"
                file_path = os.path.join(uploads_folder, file_name)

                saved_metaData.file_path = f"{file_path}"
                saved_metaData.save()


                with open(file_path, 'wb') as f: 
                    f.write(decrypted_data)

                res_data = {
                    "message": "File uploaded",
                    "data": saved_metaData.file_size
                }
                return JsonResponse(res_data, safe=False, status=200)

            else:
                res_data = {
                    "message": "File uploaded failed",
                    "error": str(new_file_meta_data_serializer.errors)
                }
                return JsonResponse(res_data, safe=False, status=500)
        
        except ValueError as e:
            res_data = {
                "message": "An error occurred during File upload.",
                "error": str(e)  
            }
            return JsonResponse(res_data, safe=False, status=500)
        
        except Exception as e:
            res_data = {
                "message": "An error occurred during File upload.",
                "error": str(e) 
            }
            return JsonResponse(res_data, safe=False, status=500)
        

@csrf_exempt
def get_file_meta_data_by_user(request, id=0):
    if request.method == 'GET':
        try:
            file_metadata_records = FileMetadata.objects.filter(updated_by=id)
            serializer = FileMetadataSerializer(file_metadata_records, many=True)

            
            response_data = []

            for i in serializer.data:
                print(" i  ------>>> ", i)
                user_data = Users.objects.get(pk=id)
                user_serializer = UsersSerializer(instance=user_data)
                temp_data = {
                    "file_id": i['file_id'], 
                    "title": i['title'],
                    "extension": i['extension'],
                    "type": i['type'], # if i.type!=None else "",
                    "size": i['file_size'],
                    "updated_at": i['updated_at'],
                    "updated_by": id,
                    "user_name": user_serializer.data['name'],
                    "shared": False
                }
                response_data.append(temp_data)

            
            # adding shared files
            try:
                shared_files_user = SharedFileUsers.objects.filter(share_to=id)
                sahre_file_user_serializer = SharedFileUsersSerializer(shared_files_user, many=True)
                # print("share_file_user_record -->> ", sahre_file_user_serializer.data)
            except Exception as e:
                res_data = {
                    "message": "a error occured in shared_file_user",
                    "data": str(e)
                }

            for i in sahre_file_user_serializer.data:
                can_view = i['can_view']
                can_download = i['can_download']
                share_file_id = i['share_file_id']

                # fatching share file data
                try:
                    share_file_records = ShareFile.objects.get(pk=share_file_id)
                    share_file_serializer = ShareFileSerializer(share_file_records)
                    file_id = share_file_serializer.data['file_id']
                    # print("got file id for share file  --->> ", file_id)
                except Exception as e:
                    res_data = {
                    "message": "a error occured in fetching share file record",
                    "data": str(e)
                }


                # fatching file metadata data
                try:
                    file_metadata_share_records = FileMetadata.objects.get(pk=file_id)
                    file_metadata_share_serializer = FileMetadataSerializer(file_metadata_share_records)
                    # print("file metadata for shared file -->> ", file_metadata_share_serializer.data)
                except Exception as e:
                    res_data = {
                    "message": "a error occured in fetching file metadata",
                    "data": str(e)
                }

                # fetching shared by user name 
                try:
                    user_data_shared_by = Users.objects.get(pk=share_file_serializer.data['shared_by'])
                    user_serializer_shared_by = UsersSerializer(instance=user_data_shared_by)
                    # print("shared by user data -->> ", user_serializer_shared_by.data)
                except Exception as e:
                    res_data = {
                    "message": "a error occured in fetching shared by user data",
                    "data": str(e)
                }
                    
                
                # print("find it -->> ", user_serializer_shared_by.data['name'])

                temp_share_file_data = {
                    "file_id": file_id, 
                    "title": file_metadata_share_serializer.data['title'],
                    "extension": file_metadata_share_serializer.data['extension'],
                    "type": file_metadata_share_serializer.data['type'], # if i.type!=None else "",
                    "size": file_metadata_share_serializer.data['file_size'],
                    "updated_at": file_metadata_share_serializer.data['updated_at'],
                    "updated_by": share_file_serializer.data['shared_by'],
                    "user_name": user_serializer_shared_by.data['name'],
                    "shared": True,
                    "can_view": can_view,
                    "can_download": can_download
                }
                # print("temp data -->> ", temp_share_file_data)
                response_data.append(temp_share_file_data)


            res_data = {
                "message": "uploaded files data fetched successfully.",
                "data": response_data
            }
            return JsonResponse(res_data, safe=False, status=200)
        except Exception as e:
            res_data = {
                "message": "An error occurred during loding File metada",
                "error": str(e)
            }
            return JsonResponse(res_data, safe=False, status=500)


@csrf_exempt
def view_file(request, id=0):
    if request.method in ['GET', 'POST']:
        try:
            print("got inside --------- >> ")
            file_data = FileMetadata.objects.get(pk=id)
            file_name = f"{file_data.file_id}.{file_data.extension}"
            client_file_name = f"{file_data.title}.{file_data.extension}"
            print("file id -->> ", file_data.file_id)
            file_path = f"uploads/{file_name}"
            file_mime_type, _ = mimetypes.guess_type(file_path)

            
            file_type = file_data.type if file_data.type == "application/pdf" else "application/octet-stream"
            print("content type",file_data.type, " -- ",  file_type)
            response = FileResponse(open(file_path, 'rb'), content_type=file_type)
            response['Content-Disposition'] = f'inline; filename="{client_file_name}"'  # Or 'attachment' for download
            return response
        
        
        except FileMetadata.DoesNotExist:
            print("eror -->> ", "File not found")
            return JsonResponse({"message": "File not found"}, status=404)

        except FileNotFoundError:
            print("eror -->> ", "File not found on server")
            return JsonResponse({"message": "File not found on server"}, status=404)
        
        except Exception as e:
            print("eror -->> ", str(e))
            res_data = {
                "message": "An error occured while loading file.",
                "error": str(e)
            }
            return JsonResponse(res_data, safe=False, status=500)


@csrf_exempt
def get_users_data(request):
    if request.method == 'GET':
        try:
            users = Users.objects.all()
            users_serializer = UsersSerializer(users, many=True)
            user_data = []
            for user in users_serializer.data:
                if(user['status']):
                    temp_user = {
                        "user_id": user['user_id'],
                        "name": user['name']
                    }
                    user_data.append(temp_user)
            res_data = {
                "message": "users data fetched...",
                "data": user_data
            }
            return JsonResponse(res_data, safe=False)
        except Exception as e:
            print("eror -->> ", str(e))
            res_data = {
                "message": "An error occured while loading users data.",
                "error": str(e)
            }
            return JsonResponse(res_data, safe=False, status=500)
        

@csrf_exempt
def share_file(request, id=0):
    if request.method == 'POST':
        try:
            # print("---->>>>>>>>>>>>>>>>>>>>>>")
            shared_file_data_json = request.POST.get('shareFileData', '{}')
            print("json -->> ", shared_file_data_json)

            try:
                shared_file_data = json.loads(shared_file_data_json)
                print("request data -->> ", shared_file_data)
            except json.JSONDecodeError:
                return JsonResponse({'error': 'Invalid sharedata format'}, status=400)
            

            data_for_share_file_table = {
                'file_id': shared_file_data['file_id'],
                'shared_by': shared_file_data['shared_by'],
                'shared_at': now()
            }

            # print("share_file object -->> ", data_for_share_file_table)


            share_file_serializer = ShareFileSerializer(data=data_for_share_file_table)
            if(share_file_serializer.is_valid()):
                saved_share_file_data = share_file_serializer.save()
                # print("saved share file data -->> ", saved_share_file_data.share_file_id)

                for i in shared_file_data['shared_to']:
                    print("inside shared to loop -->> ", i)
                    share_file_users_table_data = {
                        'share_file_id': saved_share_file_data.share_file_id,
                        'share_to': i['user_id'],
                        'can_view': shared_file_data['can_view'],
                        'can_download': shared_file_data['can_download']
                    }

                    # print("share file user data -->> ", share_file_users_table_data)

                    share_file_user_serializer = SharedFileUsersSerializer(data=share_file_users_table_data)
                    if share_file_user_serializer.is_valid():
                        saved_share_file_user_data = share_file_user_serializer.save()
                        # print("saved share_file_user_data -->> ", saved_share_file_user_data)
            
            res_data = {
                "message": "File shared successfully",
            }
            return JsonResponse(res_data, safe=False, status=200)
        except Exception as e:
            print("eror -->> ", str(e))
            res_data = {
                "message": "An error occured while updating shared file data.",
                "error": str(e)
            }
            return JsonResponse(res_data, safe=False, status=500)





#################### Helper functions ######################
def decrypt_file(encrypted_file, key):
    encrypted_data = encrypted_file.read()  # Read the file as binary data
    encrypted_data = base64.b64decode(encrypted_data)  # Decode Base64 string
    
    # Ensure key and IV match frontend
    iv = b'1234567890123456'  # Same IV as used in encryption
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    decryptor = cipher.decryptor()

    decrypted_data = decryptor.update(encrypted_data) + decryptor.finalize()
    return decrypted_data


class CustomRefreshToken(RefreshToken):
    def __init__(self, user):
        super().__init__()
        # Add custom claims (like user_id) here
        self.payload['user_id'] = user.user_id  # Set custom primary key

    @classmethod
    def for_user(cls, user):
        # Use the customized token
        return cls(user)