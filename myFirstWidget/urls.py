from django.urls import path
from . import views

urlpatterns = [
    path('', views.index_view, name='Home Page'),
    path('users', views.chat_admin_view, name='Chat Admin View'),
    path('users/', views.chat_admin_view, name='Chat Admin View'),
    path('getCurrentVisitors', views.getCurrentVisitors, name='Get Current Visitors'),
    path('getCurrentVisitors/', views.getCurrentVisitors, name='Get Current Visitors'),
    path('getSessionId', views.getSessionId, name='Get Valid Session Id'),
    path('getSessionId/', views.getSessionId, name='Get Valid Session Id'),
]