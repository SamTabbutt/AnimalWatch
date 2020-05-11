from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from AnimalMobile.models import User, Post,PostSegment,GroupTag,AnimalTag,AnimalActionTag
from AnimalMobile.serializers import MyTokenObtainPairSerializer,UserProfileSerializer, UserSerializer,PostSerializer, PostSegmentSerializer,GroupTagSerializer,AnimalTagSerializer,AnimalActionTagSerializer
from rest_framework import generics, status, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView


class ObtainTokenPairWithInstituteParams(TokenObtainPairView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = MyTokenObtainPairSerializer

class CustomUserCreate(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format='json'):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                json = serializer.data
                return Response(json, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer

class UserPostList(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def get(self,request,username):
        userposts = Post.objects.filter(pk=1)
        first_post = userposts[0]
        serialized_post = PostSerializer(first_post)
        return Response(data=serialized_post.data, status=status.HTTP_200_OK)

class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

class PostSegmentList(generics.ListCreateAPIView):
    queryset = PostSegment.objects.all()
    serializer_class = PostSegmentSerializer

    def list(self,request,*args,**kwargs):
        queryset = Post.objects.get(pk=kwargs['pk']).segments
        serializer = PostSegmentSerializer(queryset,many=True)
        return Response(serializer.data)

class PostSegmentCreate(generics.ListCreateAPIView):
    queryset = PostSegment.objects.all()
    serializer_class = PostSegmentSerializer

    def create(self,request,*args,**kwargs):
        post = Post.objects.get(pk=request.data['post'])
        start_time = request.data['start_time']
        end_time = request.data['end_time']
        newSeg = PostSegment.objects.create(start_time=start_time,end_time=end_time,post=post)
        newSeg.save
        return Response(data={'Verified':'True'})

class GroupTagList(generics.ListCreateAPIView):
    queryset = GroupTag.objects.all()
    serializer_class = GroupTagSerializer

class GroupTagDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = GroupTag.objects.all()
    serializer_class = GroupTagSerializer

class AnimalTagCreate(generics.ListCreateAPIView):
    queryset = AnimalTag.objects.all()
    serializer_class = AnimalTagSerializer

    def create(self,request,*args,**kwargs):
        post = Post.objects.get(pk=request.data['post'])
        pers = request.data['perspective']
        an_type = request.data['animal_type']
        name = request.data['animal_assigned_name']
        number = request.data['animal_assigned_number']
        newTag = AnimalTag.objects.create(perspective=pers,animal_type=an_type,animal_assigned_name=name,animal_assigned_number=number,post=post)
        newTag.save
        return Response(data={'Verified':'True'})

class AnimalTagList(generics.ListCreateAPIView):
    queryset = AnimalTag.objects.all()
    serializer_class = AnimalTagSerializer

    def list(self,request,*args,**kwargs):
        queryset = Post.objects.get(pk=kwargs['pk']).animal_tags
        serializer = AnimalTagSerializer(queryset,many=True)
        print('Retrieving animal tags')
        return Response(serializer.data)

class AnimalActionTagList(generics.ListCreateAPIView):
    queryset = AnimalActionTag.objects.all()
    serializer_class = AnimalActionTagSerializer

    def list(self,request,*args,**kwargs):
        queryset = PostSegment.objects.get(pk=kwargs['pk']).action_tags
        serializer = AnimalActionTagSerializer(queryset,many=True)
        print('Retrieving animal action tags')
        return Response(serializer.data)


class AnimalActionTagDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = AnimalActionTag.objects.all()
    serializer_class = AnimalActionTagSerializer