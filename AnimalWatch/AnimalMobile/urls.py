from django.urls import path
from AnimalMobile import views
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework_simplejwt import views as jwt_views


urlpatterns = [
    path('user/create/', views.CustomUserCreate.as_view(), name="create_user"),
    path('users/', views.UserList.as_view()),
    path('users/<int:pk>/', views.UserDetail.as_view()),
    #path('posts/<str:username>', views.UserPostList.as_view()),
    path('posts/',views.PostCreate.as_view()),
    path('posts/<int:pk>/', views.PostList.as_view()),
    path('postdetail/<int:pk>', views.PostDetail.as_view()),
    path('postsegments/',views.PostSegmentCreate.as_view()),
    path('postsegments/<int:pk>',views.PostSegmentList.as_view()),
    path('animaltags/',views.AnimalTagCreate.as_view()),
    path('animaltags/<int:pk>',views.AnimalTagList.as_view()),
    path('animalactiontags/',views.ActionTagInstanceCreate.as_view()),
    path('animalactiontags/<int:pk>',views.ActionTagInstanceList.as_view()),
    path('actiontagcategory/',views.ActionTagCategoryCreate.as_view()),
    path('actiontagcategory/<int:pk>',views.ActionTagCategoryList.as_view()),
    path('actiontagverb/',views.ActionTagVerbCreate.as_view()),
    path('actiontagverb/<int:pk>',views.ActionTagVerbList.as_view()),
    path('token/obtain/', views.ObtainTokenPairWithInstituteParams.as_view(), name='token_create'),  # override sjwt stock token
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
