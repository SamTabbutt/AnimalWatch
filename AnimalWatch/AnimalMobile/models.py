from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    institute_connection = models.BooleanField(blank=True,null=True)
    institute_connection_name = models.CharField(max_length=200,blank=True,default='')

    def __str__(self):
        return self.username+':'+self.institute_connection_name

animal_class  = sorted([('Wild','Wild'),('Pet','Pet'),('Zoo','Zoo'),('Agriculture','Agriculture')])
animal_environment_choices = [('Wild0','Natural Habitat'),('Wild1','Enclosed'),
                            ('Pet0','Indoors'),('Pet1','Outdoors'),
                            ('Zoo0','Small Enclosure'),('Zoo1','Large Anclosure'),
                            ('Ag0','Enclosed'),('Ag1','Outdoor')]

class Post(models.Model):
    animal_class = models.CharField(choices=animal_class,default='Pet',max_length=100)
    animal_environment = models.CharField(choices=animal_environment_choices,default='',max_length=100)
    video = models.FileField(max_length=100)
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name='posts')

class PostSegment(models.Model):
    start_time = models.CharField(default='00:00:00',max_length=100)
    end_time = models.CharField(default='00:00:01',max_length=100)
    post = models.ForeignKey(Post,on_delete=models.CASCADE,related_name='segments')

class AbsAnimalTag(models.Model):
    post = models.ForeignKey(Post,on_delete=models.CASCADE,related_name='abs_animal_tags')
    animal_type = models.CharField(max_length=200,default='Unknown',blank=False)

class GroupTag(AbsAnimalTag):
    estimated_number_of_animals = models.IntegerField(default=100,blank=False)

perspective_choice_list = ['AnimalBorne','FixedCameraThirdPerson','MovingCameraThirdPerson']
PERSPECTIVE_CHOICES = [(i,i) for i in perspective_choice_list]

class AnimalTag(models.Model):
    post = models.ForeignKey(Post,on_delete=models.CASCADE,related_name='animal_tags')
    animal_type = models.CharField(max_length=200,default='Unknown',blank=False)
    animal_assigned_name = models.CharField(max_length=100,blank=True)
    animal_assigned_number = models.IntegerField(default=0,blank=False)
    perspective = models.CharField(choices=PERSPECTIVE_CHOICES,max_length=30,blank=False,default='MovingCameraThirdPerson')

class AnimalActionTag(models.Model):
    post = models.ForeignKey(Post,on_delete=models.CASCADE,related_name='action_tags')
    post_segment = models.ForeignKey(PostSegment,on_delete=models.CASCADE,related_name='action_tags',default=1)
    subject_list = models.ManyToManyField(AnimalTag,blank=False,related_name='animal_actions')
    verb = models.CharField(default='is still',blank=False,max_length=100)
    object_list = models.ManyToManyField(AnimalTag,blank=True,related_name='animal_objects')