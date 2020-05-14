from rest_framework import serializers
from AnimalMobile.models import User,Post,PostSegment,GroupTag,AnimalTag,ActionTagInstance,ActionTagCategory,ActionTagVerb
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username', 'institute_connection', 'institute_connection_name', 'posts']

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True
    )
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)  # as long as the fields are the same, we can just use this
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super(MyTokenObtainPairSerializer, cls).get_token(user)

        # Add custom claims
        token['institute_connection'] = user.institute_connection
        token['institute_connection_name'] = user.institute_connection_name
        return token

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id','animal_class','animal_environment','video','user','animal_tags','segments','tag_categories']
    
class PostSegmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostSegment
        fields = ['id','start_time','end_time','post','action_tags']

class GroupTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupTag
        fields = ['id','estimated_number_of_animals','animal_type','post']

class AnimalTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnimalTag
        fields = ['id','animal_assigned_number','animal_assigned_name','animal_type','post','perspective']

class ActionTagVerbSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActionTagVerb
        fields = ['id','category','tag_verb','action_tags']

class ActionTagCategorySerializer(serializers.ModelSerializer):
    verbs = ActionTagVerbSerializer(many=True)
    class Meta:
        model = ActionTagCategory
        fields = ['id','post','category_name','verbs']

class ActionTagInstanceSerializer(serializers.ModelSerializer):
    verb = serializers.StringRelatedField()
    class Meta:
        model = ActionTagInstance
        fields = ['id','post_segment','verb']
