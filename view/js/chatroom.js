(function(){      
        var socket = io.connect();
        var info = document.getElementById('info');
        var signin_wrapper = document.getElementById('signin_wrapper');
        var nickname_confirm = document.getElementById('nickname_confirm');
        var nickname = document.getElementById('nickname');
        var send = document.getElementById('send');
        var draft = document.getElementById('draft');
        var message = document.getElementById('message');
        var block = document.getElementById('block');
        var nicknameValue = 'unkonwn';
        var img = document.getElementById('img');
        socket.on('connect', function(){
            setTimeout(function(){
                if(info)
                    info.innerText = 'Please enter your nickname.';
                if(signin_wrapper && signin_wrapper.className.toLowerCase().indexOf('hidden')!==-1){
                    var start = signin_wrapper.className.toLowerCase().indexOf('hidden');
                    signin_wrapper.className = signin_wrapper.className.substring(0, start) + signin_wrapper.className.substring(start+6);
                }
            }, 1000);

        });
        if(nickname_confirm){
            nickname_confirm.onclick = function(){
                if(nickname && nickname.value){
                    socket.emit('signin', encodeURIComponent(nickname.value));
                }
            }
        }
        if(send && draft){
            send.onclick = function(){
                var data = {
                    sender: nicknameValue,
                    message: encodeURIComponent(draft.value)
                };
                socket.emit('send', data);
            }
        }
        socket.on('nickname_repeat', function(){
            if(info)
                info.innerText = 'nickname repeats.'
        });
        socket.on('recieve', function(data){
            if(message){
                var newMessage = document.createElement('div');
                newMessage.innerText = data.sender+ ':' + data.message;
                message.appendChild(newMessage);
            }
        });
        socket.on('signin_success', function(data){
            block.className += ' hidden';
            nicknameValue = data;
        });
        img.onchange = function(){
            if(this.files.length>0){
                var file = this.files[0];
                var reader = new FileReader();
                reader.onload = function(evt){
                    var data = {
                        sender: nicknameValue,
                        img: evt.target.result
                    }
                    socket.emit('send_img', data);
                }
                reader.readAsDataURL(file);
            }else{
                console.log('no file choosen.');
            }
        }
        socket.on('recieve_img', function(data){
            var newImg = document.createElement('img');
            newImg.setAttribute('src', data.img);
            newImg.setAttribute('class', 'image');
            var newDiv = document.createElement('div');
            var newSpan = document.createElement('span');
            newSpan.innerText = data.sender + ":";
            newDiv.appendChild(newSpan);
            newDiv.appendChild(newImg);
            message && message.appendChild(newDiv);
        });
})();