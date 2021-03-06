from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from AnimalMobile.models import User, Post,PostSegment,AnimalTag,ActionTagInstance,ActionTagCategory,ActionTagVerb
from AnimalMobile.serializers import MyTokenObtainPairSerializer,UserProfileSerializer, UserSerializer,PostSerializer, PostSegmentSerializer,AnimalTagSerializer,ActionTagInstanceSerializer,ActionTagCategorySerializer,ActionTagVerbSerializer
from rest_framework import generics, status, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework import mixins



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

class PostCreate(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def create(self,request,*args,**kwargs):
        video = request.data['video']
        user = User.objects.get(pk=request.data['post'][0])
        animal_class = request.data['animal_class'][0]
        animal_environment = request.data['animal_environment'][0]
        newPost = Post.objects.create(video=video,user=user,animal_class=animal_class,animal_environment=animal_environment)
        newPost.save()
        return Response({'Verfied':'True'})

    def get(self,request):
        serializer = PostSerializer()
        data = serializer.data
        data.pop('animal_tags')
        data.pop('segments')
        data.pop('tag_categories')
        return Response(data)

class PostDetail(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def get(self,request,*args,**kwargs):
        queryset = Post.objects.get(pk=kwargs['pk'])
        serializer = PostSerializer(queryset)
        return Response(serializer.data)

class PostList(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def list(self,request,*args,**kwargs):
        queryset = Post.objects.all()
        serializer = PostSerializer(queryset,many=True)
        return Response(serializer.data)


class PostSegmentList(generics.ListCreateAPIView):
    queryset = PostSegment.objects.all()
    serializer_class = PostSegmentSerializer

    def list(self,request,*args,**kwargs):
        queryset = Post.objects.get(pk=kwargs['pk']).segments.order_by('-created_datetime')
        serializer = PostSegmentSerializer(queryset,many=True)
        return Response(serializer.data)

class PostSegmentCreate(generics.ListCreateAPIView):
    queryset = PostSegment.objects.all()
    serializer_class = PostSegmentSerializer

    def CheckAvailable(self,start,end,requested_verb):
        thisverb = requested_verb
        category = thisverb.category
        delete_list = []
        allow = True
        print(category.verbs.all())
        for verb in category.verbs.all():
            for actiontag in verb.action_tags.all():
                segment = actiontag.post_segment
                if(start>float(segment.start_time) and start<float(segment.end_time)):
                    delete_list.append(segment.pk)
                    allow = False
                if(end>float(segment.start_time) and end<float(segment.end_time)):
                    delete_list.append(segment.pk)
                    allow = False
        return allow,delete_list

    def create(self,request,*args,**kwargs):
        print(request.data)
        post = Post.objects.get(pk=request.data['post'])
        start_time = request.data['start_time']
        end_time = request.data['end_time']
        print(request.data['action_verb'])
        requested_verb = ActionTagVerb.objects.get(pk=request.data['action_verb'])
        clearedToDelete = request.data['clear']
        available, deleteList = self.CheckAvailable(start_time,end_time,requested_verb)
        if(available or clearedToDelete):
            newSeg = PostSegment.objects.create(start_time=start_time,end_time=end_time,post=post)
            newSeg.save()
            for toDelete in deleteList:
                try:
                    p = PostSegment.objects.get(pk=toDelete)
                    p.delete()
                except:
                    print('not found')
            return Response(data={'pk':newSeg.pk})
        else:
            print('not')
            return Response(data={'VerifyDelete':True})
    
    def get(self,request):
        serializer = PostSegmentSerializer()
        data = serializer.data
        data.pop('post')
        data.pop('action_tags')
        return Response(data)
    
    def delete(self, request, *args, **kwargs):
        deleteInst = PostSegment.objects.get(pk=request.data['pk'])
        deleteInst.delete(keep_parents=True)
        return Response({'Deleted':'True'})

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
    
    def get(self,request):
        serializer = AnimalTagSerializer()
        data = serializer.data
        data.pop('post')
        return Response(data)

    def delete(self, request, *args, **kwargs):
        deleteInst = AnimalTag.objects.get(pk=request.data['pk'])
        deleteInst.delete(keep_parents=True)
        return Response({'Deleted':'True'})

class AnimalTagList(generics.ListCreateAPIView):
    queryset = AnimalTag.objects.all()
    serializer_class = AnimalTagSerializer

    def list(self,request,*args,**kwargs):
        queryset = Post.objects.get(pk=kwargs['pk']).animal_tags
        serializer = AnimalTagSerializer(queryset,many=True)
        print('Retrieving animal tags')
        return Response(serializer.data)

class ActionTagInstanceList(generics.ListCreateAPIView):
    queryset = ActionTagInstance.objects.all()
    serializer_class = ActionTagInstanceSerializer

    def list(self,request,*args,**kwargs):
        queryset = PostSegment.objects.get(pk=kwargs['pk']).action_tags
        serializer = ActionTagInstanceSerializer(queryset,many=True)
        print('Retrieving animal action tags')
        return Response(serializer.data)


class ActionTagInstanceCreate(generics.ListCreateAPIView):
    queryset = ActionTagInstance.objects.all()
    serializer_class = ActionTagInstanceSerializer

    def create(self,request,*args,**kwargs):
        print(request.data)
        post_seg = PostSegment.objects.get(pk=request.data['post'])
        verb = ActionTagVerb.objects.get(pk=request.data['verb'])
        newTag = ActionTagInstance.objects.create(post_segment=post_seg,verb=verb)
        newTag.save()
        return Response(ActionTagInstanceSerializer(newTag).data)

    def get(self,request):
        serializer = ActionTagInstanceSerializer()
        data = serializer.data
        data.pop('post_segment')
        return Response(data)

    def delete(self, request, *args, **kwargs):
        deleteInst = ActionTagInstance.objects.get(pk=request.data['pk'])
        deleteInst.delete(keep_parents=True)
        return Response({'Deleted':'True'})

class ActionTagCategoryList(generics.ListCreateAPIView):
    queryset = ActionTagCategory.objects.all()
    serializer_class = ActionTagCategorySerializer

    def list(self,request,*args,**kwargs):
        queryset = Post.objects.get(pk=kwargs['pk']).tag_categories
        serializer = ActionTagCategorySerializer(queryset,many=True)
        return Response(serializer.data)

class ActionTagCategoryCreate(generics.ListCreateAPIView):
    queryset = ActionTagCategory.objects.all()
    serializer_class = ActionTagCategorySerializer

    def create(self,request,*args,**kwargs):
        post = Post.objects.get(pk=request.data['post'])
        cat_name = request.data['category_name']
        newCategory = ActionTagCategory.objects.create(post=post,category_name=cat_name)
        newCategory.save()
        return Response({'Verified':'True'})
    
    def get(self,request):
        serializer = ActionTagCategorySerializer()
        data = serializer.data
        data.pop('verbs')
        data.pop('post')
        return Response(data)
    
    def delete(self, request, *args, **kwargs):
        deleteInst = ActionTagCategory.objects.get(pk=request.data['pk'])
        deleteInst.delete(keep_parents=True)
        return Response({'Deleted':'True'})

class ActionTagVerbList(generics.ListCreateAPIView):
    queryset = ActionTagVerb.objects.all()
    serializer_class = ActionTagVerbSerializer

    def list(self,request,*args,**kwargs):
        queryset = ActionTagCategory.objects.get(pk=kwargs['pk']).verbs
        serializer = ActionTagVerbSerializer(queryset,many=True)
        return Response(serializer.data)

class ActionTagVerbCreate(generics.ListCreateAPIView):
    queryset = ActionTagVerb.objects.all()
    serializer_class = ActionTagVerbSerializer

    def create(self,request,*args,**kwargs):
        category = ActionTagCategory.objects.get(pk=request.data['post'])
        verb = request.data['tag_verb']
        color = request.data['color']
        newVerb = ActionTagVerb.objects.create(category=category,tag_verb=verb,colorcode=color)
        newVerb.save()
        return Response({'Verified':'True'})

    def get(self,request):
        serializer = ActionTagVerbSerializer()
        data=serializer.data
        data.pop('category')
        data.pop('action_tags')
        return Response(data)

    def delete(self, request, *args, **kwargs):
        deleteInst = ActionTagVerb.objects.get(pk=request.data['pk'])
        deleteInst.delete(keep_parents=True)
        return Response({'Deleted':'True'})