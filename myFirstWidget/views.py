from django.shortcuts import render
from django.http import HttpResponse
import json, random, string


from .models import Current_Logged_On_User

def index_view(req):
    return render(req, 'testpage.html', {})

def chat_admin_view(req):
    visitors = Current_Logged_On_User.objects.values("session_id")
    data = render(req, "users.html", context={'visitors' : visitors})
    return render(req, 'chat_admin_view.html', context={'content' : data})

def getCurrentVisitors(req):
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