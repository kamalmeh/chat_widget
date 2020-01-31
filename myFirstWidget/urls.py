from django.urls import path, include
import oauth2_provider.views as oauth2_views
from django.conf import settings
from .views import CurrentVisitors
from . import views

# OAuth2 provider endpoints
oauth2_endpoint_views = [
    path(r'^authorize/$', oauth2_views.AuthorizationView.as_view(), name="authorize"),
    path(r'^token/$', oauth2_views.TokenView.as_view(), name="token"),
    path(r'^revoke-token/$', oauth2_views.RevokeTokenView.as_view(), name="revoke-token"),
]

if settings.DEBUG:
    # OAuth2 Application Management endpoints
    oauth2_endpoint_views += [
        path(r'^applications/$', oauth2_views.ApplicationList.as_view(), name="list"),
        path(r'^applications/register/$', oauth2_views.ApplicationRegistration.as_view(), name="register"),
        path(r'^applications/(?P<pk>\d+)/$', oauth2_views.ApplicationDetail.as_view(), name="detail"),
        path(r'^applications/(?P<pk>\d+)/delete/$', oauth2_views.ApplicationDelete.as_view(), name="delete"),
        path(r'^applications/(?P<pk>\d+)/update/$', oauth2_views.ApplicationUpdate.as_view(), name="update"),
    ]

    # OAuth2 Token Management endpoints
    oauth2_endpoint_views += [
        path(r'^authorized-tokens/$', oauth2_views.AuthorizedTokensListView.as_view(), name="authorized-token-list"),
        path(r'^authorized-tokens/(?P<pk>\d+)/delete/$', oauth2_views.AuthorizedTokenDeleteView.as_view(),
            name="authorized-token-delete"),
    ]

urlpatterns = [
    path('', views.index_view, name='Home Page'),
    path('users', views.chat_admin_view, name='Chat Admin View'),
    path('users/', views.chat_admin_view, name='Chat Admin View'),
    # path('getCurrentVisitors', views.getCurrentVisitors, name='Get Current Visitors'),
    # path('getCurrentVisitors/', views.getCurrentVisitors, name='Get Current Visitors'),
    path('getSessionId', views.getSessionId, name='Get Valid Session Id'),
    path('getSessionId/', views.getSessionId, name='Get Valid Session Id'),
    path('login', views.login_view, name='Login Form'),
    path('login/', views.login_view, name='Login Form'),
    path(r'^o/', include((oauth2_endpoint_views, 'OAuth2 Server'), namespace="oauth2_provider")),
    path('getCurrentVisitors/', CurrentVisitors.as_view(), name='Get Current Visitors'),
]