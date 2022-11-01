var commentTextOnNicochannel = `var sm = window.location.href.split("/").slice(-1);

var comment_group_id = "";
var comment_token = "";
// 其它信息
var sm_code = "";
var sm_title = "";

// 获取group_id
var xhrGetId = new XMLHttpRequest()
xhrGetId.open('GET', "https://nfc-api.nicochannel.jp/fc/video_pages/"+sm)
xhrGetId.send()
xhrGetId.onreadystatechange = function() {
	if (xhrGetId.readyState === 4 && xhrGetId.status === 200) {
		let responseText = JSON.parse(xhrGetId.responseText);
		comment_group_id = responseText.data.video_page.video_comment_setting.comment_group_id;
		sm_code = responseText.data.video_page.content_code;
		sm_title = responseText.data.video_page.title;
		console.log(comment_group_id);
	}
}

// 获取token
var xhrGetToken = new XMLHttpRequest()
xhrGetToken.open('GET', "https://nfc-api.nicochannel.jp/fc/video_pages/"+sm+"/comments_user_token")
xhrGetToken.send()
xhrGetToken.onreadystatechange = function() {
	if (xhrGetToken.readyState === 4 && xhrGetToken.status === 200) {
		let responseText = JSON.parse(xhrGetToken.responseText);
		comment_token = responseText.data.access_token;
		console.log(comment_token);
	}
}

// 通过POST获取弹幕
var nicochannelCommentArray = [];

setTimeout(()=>{
	var url = "https://comm-api.sheeta.com/messages.history?limit=114514&sort_direction=asc";
	var params = {
		group_id: comment_group_id,
		token: comment_token
	};
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onload = function(e) {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				// console.log(JSON.parse(xhr.responseText));
				nicochannelCommentArray = JSON.parse(xhr.responseText);
				
				// 转NICO弹幕
				let newNicoArray = []
				
				nicochannelCommentArray.map((item, index)=> {
					if (item.playback_time > 32398) {
						item.playback_time = item.playback_time - 32398;
					}
					
					let newNicoItem = {
						"chat": {
							"thread": "nicochannel",
							"no": index+1,
							"vpos": item.playback_time*100,
							"date": item.created_at,
							"date_usec": item.created_at,
							"mail": "184",
							"user_id": item.id,
							"premium": item.sender_id==-1?3:1,
							"anonymity": 1,
							"content": item.message
						}
					}
					
					newNicoArray.push(newNicoItem);
				})
				
				var fObj = {
					"thread": {
						"resultcode": 0,
						"thread": "nicochannel",
						"last_res": newNicoArray.length,
						"ticket": "0x473ad00",
						"revision": 1,
						"server_time": 114514,
						"lv": sm_code,
						"title": sm_title,
					}
				}
				
				newNicoArray.unshift(fObj);
				console.log("---扣取弹幕完毕，请按右键-'Copy object'复制下行---");
				console.log(newNicoArray);
				console.log("---扣取弹幕完毕，请按右键-'Copy object'复制上行---")
				
			} else {
				console.error(xhr.statusText);
			}
		}
	};
	xhr.onerror = function(e) {
		console.error(xhr.statusText);
	};
	xhr.send(JSON.stringify(params));
},1000);`