from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import User, Post, PostSegment, AnimalActionTag, AnimalTag
class UserAdmin(admin.ModelAdmin):
    model = User

admin.site.register(User, UserAdmin)
admin.site.register(Post)
admin.site.register(PostSegment)
admin.site.register(AnimalActionTag)
admin.site.register(AnimalTag)