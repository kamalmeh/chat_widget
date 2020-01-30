var chatMainWindow = document.createElement("div");
var chatButtonWindow = document.createElement("div");
var bootstrapForm = session_id = client_id = navigation = null;
var websockets = {};

function openForm(session_id) {
    // chatButtonWindow = document.createElement("div");
    var socketData = websockets[session_id];
    // console.log(socketData['socket']);
    if (document.getElementById(socketData['sender']) == null) {
        bootstrapForm = document.createElement('div');
        bootstrapForm.id = "chatStartForm";
        var messageArea = document.createElement('div');
        messageArea.setAttribute('id', 'messageArea');
        messageArea.setAttribute('class', 'messageArea chatForm');
        messageArea.scrollTop = messageArea.scrollHeight - messageArea.clientHeight;
        bootstrapForm.appendChild(messageArea);
        var sendArea = document.createElement('div');
        sendArea.setAttribute('id', 'sendArea');
        var textarea = document.createElement('textarea');
        textarea.setAttribute('id', 'message-input');
        textarea.setAttribute('description', 'message');
        textarea.setAttribute('placeholder', 'Enter message...');
        textarea.style.height = '33px';
        textarea.style.maxHeight = '33px';
        textarea.style.minHeight = '33px';
        textarea.style.maxWidth = '100%';
        textarea.style.minWidth = '100%';
        var container = document.createElement('div');
        container.setAttribute('class', 'container margin-padding-zero');
        var row = document.createElement('div');
        row.setAttribute('class', 'row margin-padding-zero');
        var col1 = document.createElement('div');
        col1.setAttribute('class', 'col-9 margin-padding-zero');
        col1.appendChild(textarea);
        row.appendChild(col1)
        var sendButton = document.createElement('button');
        sendButton.setAttribute('id', 'send');
        sendButton.setAttribute('type', 'submit');
        sendButton.setAttribute('class', 'btn btn-primary');
        sendButton.setAttribute('style', 'height: 33px; padding: 0px;');
        sendButton.textContent = "Send";
        var col2 = document.createElement('div');;
        col2.setAttribute('class', 'col-3');
        col2.appendChild(sendButton);
        row.appendChild(col2);
        container.appendChild(row);
        bootstrapForm.appendChild(container);
        var closeButton = document.createElement("button");
        closeButton.setAttribute('id', 'close');
        closeButton.setAttribute('class', 'btn btn-primary')
        closeButton.textContent = 'End Chat';
        closeButton.addEventListener('click', () => { closeForm(socketData); })
        bootstrapForm.appendChild(closeButton);
        // chatMainWindow.appendChild(bootstrapForm);
        navigation = document.createElement('div');
        navigation.setAttribute('class', 'navbar navbar-expand-lg navbar-dark bg-dark');
        navigation.setAttribute('style', 'height: 50px; border-radius: 5px');
        navigation.innerHTML = '<label class="nav-link" style="color: white; padding: 7px 0; text-align: center">Chat</label>';
    }
    chatMainWindow.appendChild(navigation);
    chatMainWindow.style.display = "block";
    // document.getElementById('chat-popup-window').style.display = "none";
    chatMainWindow.appendChild(bootstrapForm);
    document.body.appendChild(chatMainWindow);
    // openChatSession(session_id);
    setupCommunicationChannel(session_id);
}

function closeForm(socketData) {
    chatMainWindow.style.display = "none";
    // document.getElementById('chat-popup-window').style.display = "block";
    closeChatSession(socketData['socket']);
}

function createChatWindow(sender) {
    chatMainWindow.setAttribute('class', 'chat-popup');
    chatMainWindow.setAttribute('id', sender);
    // document.body.appendChild(chatMainWindow);
    // openForm();
}

// function genrateSessionId(length) {
//     $.ajax({
//         type: "method",
//         url: "/getSessionId",
//         data: { 'csrftoken': csrftoken },
//         dataType: 'application/json; charset=utf-8',
//         success: function(response) {
//             console.log("Session Id: " + response[0]);
//             return response[0];
//         }
//     });
// }

function genrateSessionId(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function openChatSession(session_id) {
    var socketData = websockets[session_id];
    // console.log("openChatSession() - " + JSON.stringify(socketData));
    if (socketData == null) {
        console.log("Unexpected Error, socket appears to be null");
        return;
    }
    var mysocket = socketData['socket'];

    mysocket.onmessage = function(e) {
        var data = JSON.parse(e.data);
        var message = data['message'];
        var sender = data['sender'];
        var rcvd_client_id = data['client_id'];
        var timestamp = data['timestamp'];
        // console.log("Sender: " + sender);
        if (document.getElementById(sender + "_Chat_Window") == null) {
            // console.log("creating chat window..." + sender);
            createChatWindow(sender);
            openForm(session_id);
        }
        // console.log(e.data);
        setupCommunicationChannel(session_id);
        var new_msg = document.createElement("div");
        var cls = "container sender-guest"
        if (rcvd_client_id == client_id) {
            cls = "sender-guest sender-admin"
        }
        new_msg.setAttribute('class', cls)
        new_msg.innerHTML = `
        <div class="row"><div class="col">
        <p>${message}</p></div></div>
        <div class="row"><div class="col align-text-bottom">
        <span class="align-text-bottom"><i>${timestamp}</i></span></div></div>`;
        document.getElementById("messageArea").appendChild(new_msg);
        var messageBody = document.querySelector('#messageArea');
        messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
    };

    mysocket.onclose = function(e) {
        console.error('Chat socket closed unexpectedly');
    };
}

function closeChatSession(mysocket) {
    mysocket.close();
}

function setupCommunicationChannel(session_id) {
    var socketData = websockets[session_id];
    // console.log(socketData['socket']);
    document.querySelector('#message-input').focus();
    document.querySelector('#message-input').onkeyup = function(e) {
        if (e.keyCode === 13) {
            document.querySelector("#send").click();
        }
    };
    document.querySelector('#send').onclick = function(e) {
        var messageInputDom = document.querySelector('#message-input');
        var message = messageInputDom.value;
        var sender = socketData['sender'];
        if (window.location.pathname == '/admin') {
            sender = 'admin';
        }
        // console.log("I am here:" + JSON.stringify(socketData['socket']));
        socketData['socket'].send(JSON.stringify({
            'message': message,
            'sender': sender,
            'client_id': socketData['client_id']
        }));

        messageInputDom.value = '';
    };
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function getCurrentUsers() {
    // using jQuery
    // console.log("csrftoken: " + csrftoken);

    // Ajax call here
    $.ajax({
        type: "GET",
        url: "/getCurrentVisitors",
        processData: false,
        contentType: false,
        // data: { 'csrftoken': csrftoken },
        success: function(session_Id_array) {
            // console.log(session_Id_array);
            var sessions = Object.keys(websockets);
            for (var i = 0; i < sessions.length; i++) {
                // console.log("Debug - 04");
                websockets[sessions[i]]["display"] = "none";
            }
            for (var i = 0; i < session_Id_array.length; i++) {
                var session_id = session_Id_array[i];
                // console.log("Debug - 01");
                if (session_id in websockets) {
                    // console.log("Debug - 02");
                    // console.log(websockets[session_id]);
                    websockets[session_id]["display"] = "block";
                } else {
                    // console.log("Debug - 03");
                    var id_col = document.createElement('div');
                    id_col.setAttribute('class', 'col-10')
                    id_col.innerHTML = `<label class="admin-guest">${session_id}</label>`;
                    var row = document.createElement('div');
                    row.setAttribute('id', session_id);
                    // row.setAttribute('style', 'width:90%;padding: 15px;');
                    row.setAttribute('class', 'row');
                    row.appendChild(id_col);
                    var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
                    var url = ws_scheme + '://' + window.location.host + "/users?session_id=" + session_id + "&is_admin=yes";
                    // console.log("URL - " + url);
                    websockets[session_id] = {};
                    websockets[session_id]["display"] = "block";
                    websockets[session_id]["socket"] = new WebSocket(url);
                    websockets[session_id]["client_id"] = client_id;
                    websockets[session_id]["sender"] = client_id + "_Chat_Window";
                    // console.log(websockets[session_id]);
                    openChatSession(session_id);
                    var btn_col = document.createElement('div');
                    btn_col.setAttribute('class', 'col-2')
                    btn_col.innerHTML = '<button class="btn btn-primary" type="button" onclick="openForm(\'' + session_id + '\')">Chat</button>';
                    row.appendChild(btn_col);
                    document.getElementById('currentusers').appendChild(row);
                }
            }
            // console.log("All Websocket Sessions: " + sessions);
            for (var i = 0; i < sessions.length; i++) {
                // console.log("Debug - 05");
                // console.log("WebSocket Session: " + sessions[i]);
                if (websockets[sessions[i]]["display"] == "none") {
                    document.getElementById(sessions[i]).remove();
                    // console.log("removing " + JSON.stringify(websockets[sessions[i]]));
                    delete websockets[sessions[i]];
                    // console.log("Checking " + JSON.stringify(websockets[sessions[i]]));
                }
            }
        },
        complete: function(data) {
            // console.log("Global Websockets - " + JSON.stringify(websockets));
            setTimeout(function() { getCurrentUsers() }, 10000);
        }
    });
}
var csrftoken = getCookie('csrftoken');

$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

client_id = genrateSessionId(128);
getCurrentUsers();