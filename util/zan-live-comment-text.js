var commentTextOnZan_live = `

// 找live开始时间
let openTime = "";

let document_scripts_array = document.scripts;

// 找含有index的
let has_liveTickets_scripts_index = 0;
for (let i = 0; i < document.scripts.length; i++) {
	if (document.scripts[i].text.indexOf("liveTickets") != -1) {
		has_liveTickets_scripts_index = i;
	}
}

let liveTickets_start_index = document.scripts[has_liveTickets_scripts_index].text.indexOf("JSON.parse(");
let liveTickets_end_index = document.scripts[has_liveTickets_scripts_index].text.indexOf(":null}]");

let liveTickets_txt = document.scripts[has_liveTickets_scripts_index].text.substring(liveTickets_start_index+12, liveTickets_end_index+7);
let liveTickets_array = JSON.parse(liveTickets_txt);

let URL_array = document.URL.split("/");
let URL_liveId = parseInt(URL_array[URL_array.length-1]-1)

for (let i = 0; i < liveTickets_array.length; i++) {
	if (liveTickets_array[i].liveId == URL_liveId) {
		openTime = liveTickets_array[i].openLiveDate.replace("T", " ").substring(0, 19);
	}
}

// 时间戳转换
let openTimestamp = new Date(openTime).getTime();

let zan_comment_array = [];
let zantonico_array = [];

let vod_comment_manifest_url = document.getElementsByName("vod-comment-manifest-url")[0].content;

let xhrGetUrl = new XMLHttpRequest()
xhrGetUrl.open('GET', vod_comment_manifest_url)
xhrGetUrl.send()
xhrGetUrl.onreadystatechange = function() {
	if (xhrGetUrl.readyState === 4 && xhrGetUrl.status === 200) {
		let urls = JSON.parse(xhrGetUrl.responseText);
		let vod_comment_manifest_url_array = Object.keys(urls.comments);

		for (let i = 0; i < vod_comment_manifest_url_array.length; i++) {

			let xhrGetComment = new XMLHttpRequest()
			xhrGetComment.open('GET', vod_comment_manifest_url_array[i])
			xhrGetComment.send()
			xhrGetComment.onreadystatechange = function() {
				if (xhrGetComment.readyState === 4 && xhrGetComment.status === 200) {
					let comments = JSON.parse(xhrGetComment.responseText);
					zan_comment_array = zan_comment_array.concat(comments);
				}
			}
		}
	}
}


setTimeout("zantonico_func()", 6000)

function zantonico_func() {
	zan_comment_array.sort((a, b) => a.id - b.id)

	// 转NICO弹幕
	let newNicoArray = []

	zan_comment_array.map((item, index) => {
		// 转换时间戳 created_at: "2024-06-09T09:15:52.253Z"
		let zanTime = item.created_at.replace("T", " ").substring(0, 19);
		let zanTimestamp = new Date(zanTime).getTime();
		let zanVpos = (zanTimestamp - openTimestamp)/10;

		let newNicoItem = {
			"chat": {
				"thread": "zan-live",
				"no": item.id,
				"vpos": zanVpos,
				"date": item.created_at,
				"date_usec": item.created_at,
				"mail": "184",
				"user_id": item.user_id,
				"premium": 1,
				"anonymity": 1,
				"content": item.content.text
			}
		}

		newNicoArray.push(newNicoItem);
	})

	var fObj = {
		"thread": {
			"resultcode": 0,
			"thread": "zan-live",
			"last_res": newNicoArray.length,
			"ticket": "0x473ad00",
			"revision": 1,
			"server_time": 114514,
			"lv": "lv114514",
			"title": "其它",
		}
	}

	newNicoArray.unshift(fObj);
	console.log("---扣取弹幕完毕，请按右键-'Copy object'复制下行---");
	console.log(newNicoArray);
	console.log("---扣取弹幕完毕，请按右键-'Copy object'复制上行---")

}
`