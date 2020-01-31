from django.shortcuts import render, redirect
from django.http import HttpResponse
import json, random, string
from django.contrib.auth import authenticate, login
from django.conf import settings
from oauth2_provider.views.generic import ProtectedResourceView
# from django.contrib.auth.decorators import login_required

from .models import Current_Logged_On_User

def index_view(req):
    return render(req, 'testpage.html', {})

def login_view(request):
    if request.method == 'GET':
        return render(request, 'login.html', {})
    else:
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            if request.method == 'POST':
                token_url = HttpRequest.scheme + '://' + request.get_host() + ':' + request.get_port() + '/o/token'
                # params = {''}
                # r = requests.post(token_url, params=request.POST)
                # HttpResponse._headers['Authorization'] = 
                visitors = Current_Logged_On_User.objects.values("session_id")
                return redirect('/users')
        else:
            return render(request, 'login.html', {'error':"Invalid Credentials"})

def chat_admin_view(request):
    if request.user.is_authenticated:
        visitors = Current_Logged_On_User.objects.values("session_id")
        # data = render(req, "users.html", context={'visitors' : visitors})
        return render(request, 'chat_admin_view.html', context={'content' : visitors})
    else:
        return render(request, 'login.html', {})

class CurrentVisitors(ProtectedResourceView):
    # @login_required
    def get(self, request, *args, **kwargs):
        visitors_list = []
        visitors = Current_Logged_On_User.objects.values("session_id")
        for visitor in visitors:
            visitors_list.append(visitor['session_id'])
        return HttpResponse(json.dumps(visitors_list), content_type='application/json')
    
    def post(self, request, *args, **kwargs):
        visitors_list = []
        visitors = Current_Logged_On_User.objects.get("session_id")
        for visitor in visitors:
            visitors_list.append(visitor['session_id'])
        return HttpResponse(json.dumps(visitors_list), content_type='application/json')

def getCurrentUsers(request):
    visitors_list = []
    visitors = Current_Logged_On_User.objects.values("session_id")
    for visitor in visitors:
        visitors_list.append(visitor['session_id'])
    return HttpResponse(json.dumps(visitors_list), content_type='application/json')

def getSessionId(req):
    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    charactersLength = characters.__len__()
    while True:
        session_id = ''.join(random.choice(characters) for i in range(charactersLength))
        visitors = Current_Logged_On_User.objects.filter(session_id=session_id).values()
        if not visitors:
            break
    return HttpResponse(json.dumps(session_id), content_type='application/json')