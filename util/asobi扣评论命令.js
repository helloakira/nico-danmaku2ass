var uri_comment = "wss://replay.asobistore.jp/shinycolors_over_the_prism_re_day2_ch1/archive";

var ws = new WebSocket(uri_comment)

var asobiChatArray = [];

var finish = 0;

ws.onopen = function(evt) {
	console.log("开始连接");
	ws.send(`{"func":"archive-get","time":"0"}`);
}

ws.onmessage = function(evt) {
	console.log("收到信息：" + evt.data);
	
	is_archive = evt.data.indexOf("archive");
	if(is_archive > 0) {
		let cArray = JSON.parse(evt.data).archive;
		if (cArray.length > 0) {
			for (let i = 0; i < cArray.length; i++) {
				asobiChatArray.push(cArray[i]);
			}
		}
	}
}

ws.onclose = function(evt) {
	console.log("关闭连接");
}

var time_5 = 0;

function get_comment_timer() {
	let getCommentTimer = setInterval(function() {
		if (finish != 1) {
			asobiChatArray.sort((a, b)=> {return a.playtime - b.playtime});
			time_5 += 5;
			ws.send(`{"func":"archive-get","time": "${time_5}"}`);
		}
		
		if (time_5 > 14400 || finish == 1) {
			clearInterval(getCommentTimer);
			console.log(asobiChatArray);
			let newNicoArray = [];
			asobiChatArray.map((item, index)=>{
				let newNicoItem = {
					"chat": {
						"thread": "asobi",
						"no": index+1,
						"vpos": parseInt(item.playtime.toFixed(2)*100),
						"date": item.time,
						"date_usec": item.time,
						"mail": item.data.color,
						"user_id": item.data.userName,
						"premium": 1,
						"anonymity": 1,
						"content": item.data.comment[0],
						"type": item.data.type
					}
				}
				newNicoArray.push(newNicoItem);
			});
			
			var fObj = {
				"thread": {
					"resultcode": 0,
					"thread": "asobi",
					"last_res": newNicoArray.length,
					"ticket": "0x473ad00",
					"revision": 1,
					"server_time": 114514,
					"lv": "lv114514",
					"title": "其它",
				}
			}
			newNicoArray.unshift(fObj);
			console.log(newNicoArray);
		}
		
	}, 200);
}

get_comment_timer();