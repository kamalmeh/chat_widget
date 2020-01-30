from channels.generic.websocket import WebsocketConsumer
import json, re
from django.utils import timezone
from .models import Current_Logged_On_User
from asgiref.sync import async_to_sync
from urllib.parse import parse_qs

class ChatConsumer(WebsocketConsumer):
    rooms = set()
    
    def connect(self):
        query_string = str(self.scope['query_string'])
        query_string = re.sub("^b'","",query_string)
        query_string = re.sub("'","",query_string)
        params = parse_qs(query_string)
        self.session_id = params['session_id'][0]
        self.is_admin = 'no'
        try:
            self.is_admin = params['is_admin'][0]
        except Exception as e:
            self.is_admin = 'no'
            print(e)

        if self.is_admin != 'yes':
            try:
                new_visitor = Current_Logged_On_User(session_id=self.session_id)
                new_visitor.save()
            except Exception as e:
                # print(e)
                pass

        async_to_sync(self.channel_layer.group_add)(
            self.session_id,
            self.channel_name
        )
        
        self.accept()
        self.rooms.add(self.session_id)
    
    def disconnect(self, code):       
        async_to_sync(self.channel_layer.group_discard)(
            self.session_id,
            self.channel_name
        )

        if self.is_admin != 'yes':
            try:
                Current_Logged_On_User.objects.filter(session_id=self.session_id).delete()
            except Exception as e:
                print(e)
        try:
            self.rooms.remove(self.session_id)
        except Exception as e:
            # print(e)
            pass

    def receive(self, text_data):
        chat_message_json = json.loads(text_data)
        message = chat_message_json['message']
        sender = chat_message_json['sender']
        client_id = chat_message_json['client_id']
        timestamp = timezone.now().strftime("%I:%M:%S %p")

        async_to_sync(self.channel_layer.group_send)(
            self.session_id, {
                'type': 'chat_message',
                'message': message,
                'sender' : sender, 
                'client_id': client_id,
                'timestamp': timestamp
            }
        )
    
    def chat_message(self, event):
        message = event['message']
        sender = event['sender']
        client_id = event['client_id']
        timestamp = event['timestamp']

        self.send(text_data=json.dumps({
            'message': message,
            'sender' : sender,
            'client_id': client_id,
            'timestamp': timestamp
        }))
    