var uri_comment = "wss://replay.asobistore.jp/shinycolors_283unitlive_mugenbeat_day2_ch1/archive";

var ws = new WebSocket(uri_comment)

var commentArray = [];

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
				commentArray.push(cArray[i]);
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
			commentArray.sort((a, b)=> {return a.playtime - b.playtime});
			time_5 += 5;
			ws.send(`{"func":"archive-get","time": "${time_5}"}`);
		}
		
		if (time_5 > 14400 || finish == 1) {
			clearInterval(getCommentTimer);
			console.log(commentArray);
		}
		
	}, 200);
}

get_comment_timer();