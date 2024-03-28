var commentTextOnOpenrec = `
// 定义变量
let started_at = '';
let posted_at = '';
let ended_at = '';
let title = '';
let finish = 0;
let openrecCommentArray = [];
let params = {};
let chats_url = '';
let nicoCommentArray = [];

// 获取ID
let m_id = window.location.href.split("/").slice(-1);

// 合并
let detail_url = "https://public.openrec.tv/external/api/v5/movies/" + m_id

// GET详细
fetch(detail_url, {
		method: 'GET'
	})
	.then(response => response.json())
	.then(data => {
		started_at = data.started_at;
		posted_at = data.started_at;
		ended_at = data.ended_at;
		title = data.title;

		get_comment_timer();
	})
	.catch(error => console.error('Error:', error));

function get_comment_timer() {
	let getCommentTimer = setInterval(function() {
		// 参数改变
		params = {
			from_created_at: posted_at,
			limit: "300"
		};
		queryParams = new URLSearchParams(params);

		// 合并
		chats_url = "https://public.openrec.tv/external/api/v5/movies/"+m_id+"/chats?"+queryParams;

		// 获取数组第一个元素 继续向弹幕服务器扒弹幕
		if (finish != 1) {
			fetch(chats_url, {
					method: 'GET'
				})
				.then(response => response.json())
				.then(data => {
					if (data.length == 1) {
						finish = 1;
					} else {
						for (let i = 0; i < data.length; i++) {
							openrecCommentArray.push(data[i]);
							openrecCommentArray.push(data[i]);
						}
						posted_at = data.slice(-1)[0].posted_at;
						let successText = posted_at + " 成功获取了" + data.length + "条评论";
						console.log(successText);
					}
				})
				.catch(error => console.error('Error:', error));
		}

		// 找到NO1
		if (finish == 1) {
			clearInterval(getCommentTimer);
			// 排序
			nicoCommentArray.sort(sort_chat_no);
			// 去重
			let duplicateArray = [];
			for (var i = 0; i < nicoCommentArray.length; i++) {
				if (i == 0) {
					duplicateArray.push(nicoCommentArray[i]);
					continue;
				}
				if (nicoCommentArray[i].chat.no !== nicoCommentArray[i-1].chat.no) {
					duplicateArray.push(nicoCommentArray[i]);
				}
			}
			nicoCommentArray = duplicateArray;
			// 获取lv号&获取标题
			openchats_to_nicochats();
			console.log("---扣取弹幕完毕，请按右键-'Copy object'复制下行---");
			console.log(nicoCommentArray);
			console.log("---扣取弹幕完毕，请按右键-'Copy object'复制上行---");
		}
	}, 2000)
}

// 按no排序
function sort_chat_no(a, b) {
	return a.chat.no - b.chat.no;
}

function openchats_to_nicochats() {
	let nicoTitle = {
		"thread": {
			"resultcode": 0,
			"thread": "离我的美月远点",
			"last_res": "离你的紫月近点",
			"ticket": "离我的华月远点",
			"revision": 1,
			"server_time": 114514,
			"lv": m_id,
			"title": title
		}
	}
	nicoCommentArray.push(nicoTitle);
	
	let startedtime = started_at.replace("T", " ")

	for (var i = 0; i < openrecCommentArray.length; i++) {
		// let s_at = "2024-03-23T20:02:25+09:00".slice(0,19).replace("T", " ")
		// let p_at = "2024-03-23T20:02:28+09:00".slice(0,19).replace("T", " ")
		// let timetamp = (new Date(p_at) - new Date(s_at))/10

		let portedtime = openrecCommentArray[i].posted_at;
		let vpos = (new Date(portedtime).getTime() - new Date(startedtime).getTime())/10-400
		
		let one_chats = {
			"chat": {
				"thread": "MMM",
				"no": openrecCommentArray[i].id,
				"vpos": vpos,
				"date": openrecCommentArray[i].posted_at,
				"date_usec": openrecCommentArray[i].messaged_at,
				"mail": "184",
				"user_id": openrecCommentArray[i].user.openrec_user_id,
				"premium": 1,
				"anonymity": 1,
				"content": openrecCommentArray[i].message
			}
		}
		nicoCommentArray.push(one_chats);
	}
	
}
`