// 去重
let uniqueDanmakuChatArray = [];
			
danmakuChatArray.map((item,index)=>{
	if (index == 0 || index == 1) {
		return true;
	}
	
	
	if (item.chat.vpos == danmakuChatArray[index-1].chat.vpos && item.chat.date_usec == danmakuChatArray[index-1].chat.date_usec) {
		return true;
	} else {
		uniqueDanmakuChatArray.push(item);
	}
})

// 获取lv号&获取标题
LV = document.URL.split("/").slice(-1)[0];
fristObj["thread"]["lv"] = LV.indexOf("?")>-1 ? LV.substr(0, LV.indexOf("?")) : LV;
fristObj["thread"]["title"] = document.title;
uniqueDanmakuChatArray.unshift(fristObj);

console.log(uniqueDanmakuChatArray);