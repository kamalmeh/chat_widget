var chatMainWindow = document.createElement("div");;
var chatButtonWindow = document.createElement("div");
var bootstrapForm = chatSession = session_id = client_id = navigation = null;

function createChatButton() {
    chatButtonWindow.setAttribute('class', "chat-button");
    chatButtonWindow.setAttribute('id', 'chat-popup-window');
    chatButtonWindow.style.display = 'block';
    var widgetButtonElement = document.createElement("button");
    widgetButtonElement.type = "submit";
    widgetButtonElement.className = "btn btn-primary";
    widgetButtonElement.textContent = "Chat";
    widgetButtonElement.addEventListener("click", () => { openForm(); });
    chatButtonWindow.appendChild(widgetButtonElement);
    document.body.appendChild(chatButtonWindow);
}

function openForm() {
    chatButtonWindow = document.createElement("div");
    if (document.getElementById('chat-main-window') == null) {
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
        closeButton.addEventListener('click', () => { closeForm(); })
        bootstrapForm.appendChild(closeButton);
        // chatMainWindow.appendChild(bootstrapForm);
        navigation = document.createElement('div');
        navigation.setAttribute('class', 'navbar navbar-expand-lg navbar-dark bg-dark');
        navigation.setAttribute('style', 'height: 50px; border-radius: 5px');
        navigation.innerHTML = '<label class="nav-link" style="color: white; padding: 7px 0; text-align: center">Chat</label>';
    }
    chatMainWindow.appendChild(navigation);
    chatMainWindow.style.display = "block";
    document.getElementById('chat-popup-window').style.display = "none";
    chatMainWindow.appendChild(bootstrapForm);
    document.body.appendChild(chatMainWindow);
    openChatSession();
    setupCommunicationChannel();
}

function closeForm() {
    chatMainWindow.style.display = "none";
    document.getElementById('chat-popup-window').style.display = "block";
    closeChatSession();
}

function createChatWindow() {
    chatMainWindow.setAttribute('class', 'chat-popup');
    chatMainWindow.setAttribute('id', 'chat-main-window');
}

function genrateSessionId(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function openChatSession() {
    if (session_id == null) {
        session_id = genrateSessionId(64);
    }
    var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
    var url = ws_scheme + '://' + window.location.host + "?session_id=" + session_id;
    chatSession = new ReconnectingWebSocket(url);
    console.log(url);

    chatSession.onmessage = function(e) {
        var data = JSON.parse(e.data);
        var message = data['message'];
        var sender = data['sender'];
        var rcvd_client_id = data['client_id'];
        var timestamp = data['timestamp'];
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

    chatSession.onclose = function(e) {
        console.error('Chat socket closed unexpectedly');
    };
    client_id = genrateSessionId(128)
}

function closeChatSession() {
    chatSession.close();
}

function setupCommunicationChannel() {
    document.querySelector('#message-input').focus();
    document.querySelector('#message-input').onkeyup = function(e) {
        if (e.keyCode === 13) {
            document.querySelector("#send").click();
        }
    };
    document.querySelector('#send').onclick = function(e) {
        var messageInputDom = document.querySelector('#message-input');
        var message = messageInputDom.value;
        var sender = session_id;
        if (window.location.pathname == '/admin') {
            sender = 'admin';
        }
        chatSession.send(JSON.stringify({
            'message': message,
            'sender': sender,
            'client_id': client_id
        }));

        messageInputDom.value = '';
    };
}

function createWidget(id) {
    if (id != null) {
        session_id = id;
    }
    createChatButton();
    createChatWindow();
}
createWidget();