var commentText = `// 从生放送网页提取nico服务器websocket的链接与用户ID
const embeddedData = JSON.parse(document.getElementById("embedded-data").getAttribute("data-props"));
const url_system = embeddedData.site.relive.webSocketUrl;
// const user_id = embeddedData.user.id
const user_id = "guest"

// 使用websocket发送相关session的信息
const message_system_1 = '{"type":"startWatching","data":{"stream":{"quality":"super_high","protocol":"hls","latency":"low","chasePlay":false},"room":{"protocol":"webSocket","commentable":true},"reconnect":false}}';
const message_system_2 ='{"type":"getAkashic","data":{"chasePlay":false}}'
const message_system_3 ='{"type":"getResume"}'

// 初始化变量
let uri_comment
let threadID
let threadkey
let mes_comment
let when
let liveStartTime
let liveEndTime
let frist = 0
let fristObj
let finish = 0
let danmakuChatArray = []
let danmakuChatNoArray = []

// 与nico服务器建立websocket方法定义
function connect_WebSocket_system()
{
  websocket_system = new WebSocket(url_system);
  websocket_system.onopen = function(evt) { onOpen_system(evt) };
  websocket_system.onclose = function(evt) { onClose_system(evt) };
  websocket_system.onmessage = function(evt) { onMessage_system(evt) };
  websocket_system.onerror = function(evt) { onError_system(evt) };
}

function onOpen_system(evt)
{
  console.log("连接NICO服务器");
  doSend_system(message_system_1);
	doSend_system(message_system_2);
  doSend_system(message_system_3);
}

function onClose_system(evt)
{
  console.log("断开NICO服务器");
  websocket_comment.close();
}

function onMessage_system(evt)
{
  // console.log('NICO服务器返回的信息：' + evt.data);
  is_room = evt.data.indexOf("room")
  is_ping = evt.data.indexOf("ping")
	is_schedule = evt.data.indexOf("schedule")

  if(is_room>0){
		// 返回的数据提取相关信息
		evt_data_json = JSON.parse(evt.data);
		uri_comment = evt_data_json.data.messageServer.uri
		threadID = evt_data_json.data.threadId
		threadkey = evt_data_json.data.yourPostKey
  }

	if (is_schedule>0) {
		evt_data_json = JSON.parse(evt.data);
		liveStartTime = new Date(evt_data_json.data.begin).getTime()/1000;
		liveEndTime = new Date(evt_data_json.data.end).getTime()/1000+10000;
		console.log(liveStartTime,liveEndTime);
		
		message_comment = '[{"ping":{"content":"rs:0"}},{"ping":{"content":"ps:0"}},{"thread":{"thread":"'+threadID+'","version":"20061206","user_id":"'+user_id+'","res_from":-1000,"with_global":1,"scores":1,"nicoru":0,"waybackkey":"","when":'+liveEndTime+'}},{"ping":{"content":"pf:0"}},{"ping":{"content":"rf:0"}}]'
		// 与弹幕api开启websocket的session连接
		connect_WebSocket_comment();
	}

  // 发送pong keepSeat持续获取观看权
  if(is_ping>0){
    doSend_system('{"type":"pong"}');
    doSend_system('{"type":"keepSeat"}');
  }
}

function onError_system(evt)
{
  // console.log('与NICO服务器发生错误：' + evt.data);
}

function doSend_system(message)
{
  // console.log("发送到NICO服务器：" + message);
  websocket_system.send(message);
}

// 与弹幕api建立session方法定义
function connect_WebSocket_comment()
{
  websocket_comment = new WebSocket(uri_comment, 'msg.nicovideo.jp#json', {
    headers: {
      'Sec-WebSocket-Extensions': 'permessage-deflate; client_max_window_bits',
      'Sec-WebSocket-Protocol': 'msg.nicovideo.jp#json',
    },
  });
  websocket_comment.onopen = function(evt) { onOpen_comment(evt) };
  websocket_comment.onclose = function(evt) { onClose_comment(evt) };
  websocket_comment.onmessage = function(evt) { onMessage_comment(evt) };
  websocket_comment.onerror = function(evt) { onError_comment(evt) };
}

function onOpen_comment(evt)
{
  console.log("连接弹幕服务器");
  if (websocket_comment.readyState === 1) {
  	doSend_comment(message_comment);
  }
}

function onClose_comment(evt)
{
  console.log("断开弹幕服务器");
}

function onMessage_comment(evt)
{
	if (finish != 1) {
		console.log('弹幕服务器返回的信息：' + evt.data);
	}

	is_thread = evt.data.indexOf("thread")
	is_chat = evt.data.indexOf("chat")
	is_resultcode = evt.data.indexOf("resultcode")
	is_disconnect = evt.data.indexOf("/disconnect")
	
	if (is_chat>0) {
		danmakuChatNoArray.sort((a, b)=>{return a - b});
		is_noIndex = danmakuChatNoArray.indexOf(JSON.parse(evt.data).chat.no);
		if (is_noIndex == -1) {
			danmakuChatArray.push(JSON.parse(evt.data));
			danmakuChatNoArray.push(JSON.parse(evt.data).chat.no);
		}
	}
	
	if (is_resultcode>0 && JSON.parse(evt.data).thread.hasOwnProperty("last_res") == false ) {
		finish = 1;
	} else {
		if (frist == 0 && is_thread>0) {
			fristObj = JSON.parse(evt.data)
			frist +=1
		}
	}
	
	if (is_disconnect>0) {
		get_comment_timer();
	}
}

function onError_comment(evt)
{
  console.log('与弹幕服务器发生错误：' + evt.data);
}

function doSend_comment(message)
{
  console.log("发送到弹幕服务器：" + message);
  websocket_comment.send(message);
}

// XML特殊符号转义
function jsonToXml_RegExp(text) {
	let text_RegExp = "";
	
	// 替换转义字符
	var reg1 = new RegExp('<',"g"); // <
	var reg2 = new RegExp('>',"g"); // >
	var reg3 = new RegExp('&',"g"); // &
	var reg4 = new RegExp("'","g"); // '
	var reg5 = new RegExp('"',"g"); // "
	
	text_RegExp = text.replace(reg1, "").replace(reg2, "").replace(reg3, "").replace(reg4, "").replace(reg5, '');
	// text_RegExp = text.replace(reg1, "&lt;").replace(reg2, "&gt;").replace(reg3, "&amp;").replace(reg4, "&apos;").replace(reg5, '&quot;');
	return text_RegExp;
}

// 设置获取弹幕计时器
function get_comment_timer() {
	let getCommentTimer = setInterval(function(){
		// 获取数组第一个元素 继续向弹幕服务器扒弹幕
		if (finish != 1) {
			danmakuChatArray.sort((a, b)=>{return a.chat.no - b.chat.no});
			
			if (danmakuChatNoArray.indexOf(1) !=-1) {
				liveEndTime = danmakuChatArray[0].chat.date;
			} else{
				liveEndTime = danmakuChatArray[0].chat.date +10;
			}
			
			message_comment = '[{"ping":{"content":"rs:0"}},{"ping":{"content":"ps:0"}},{"thread":{"thread":"'+threadID+'","version":"20061206","user_id":"'+user_id+'","res_from":-1000,"with_global":1,"scores":1,"nicoru":0,"waybackkey":"","when":'+liveEndTime+'}},{"ping":{"content":"pf:0"}},{"ping":{"content":"rf:0"}}]'
			doSend_comment(message_comment);
		}

		// 找到NO1
		if (danmakuChatNoArray.indexOf(1) !=-1 && finish == 1 && danmakuChatArray[0].hasOwnProperty("thread") != true) {
			clearInterval(getCommentTimer);
			// 获取lv号&获取标题
			LV = document.URL.split("/").slice(-1)[0];
			fristObj["thread"]["lv"] = LV.indexOf("?")>-1 ? LV.substr(0, LV.indexOf("?")) : LV;
			fristObj["thread"]["title"] = jsonToXml_RegExp(document.title);
			danmakuChatArray.unshift(fristObj);

			console.log("---扣取弹幕完毕，请按右键-'Copy object'复制下行---");
			console.log(danmakuChatArray);
			console.log("---扣取弹幕完毕，请按右键-'Copy object'复制上行---");
		}
		
		

	}, 2000)
}

// 执行连接nico的websocket方法
connect_WebSocket_system();`
