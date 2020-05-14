from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import User, Post, PostSegment, ActionTagInstance, AnimalTag,ActionTagCategory,ActionTagVerb
class UserAdmin(admin.ModelAdmin):
    model = User

admin.site.register(User, UserAdmin)
admin.site.register(Post)
admin.site.register(PostSegment)
admin.site.register(ActionTagInstance)
admin.site.register(AnimalTag)
admin.site.register(ActionTagVerb)
admin.site.register(ActionTagCategory)