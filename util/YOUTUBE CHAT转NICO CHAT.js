let youtubeChatArray = [
    {
        "action_type": "add_chat_item",
        "author": {
            "id": "UCy7sPvhvzAZlIEpjZHdjNwA",
            "images": [
                {
                    "id": "source",
                    "url": "https://yt4.ggpht.com/diEAnZgF4DOcC8EDOFsT7WtrWUSx1A1z7F6UhRCl9QbnBZYXgeyRNR1YXWjbrUhEtA9J0U97"
                },
                {
                    "height": 32,
                    "id": "32x32",
                    "url": "https://yt4.ggpht.com/diEAnZgF4DOcC8EDOFsT7WtrWUSx1A1z7F6UhRCl9QbnBZYXgeyRNR1YXWjbrUhEtA9J0U97=s32-c-k-c0x00ffffff-no-rj",
                    "width": 32
                },
                {
                    "height": 64,
                    "id": "64x64",
                    "url": "https://yt4.ggpht.com/diEAnZgF4DOcC8EDOFsT7WtrWUSx1A1z7F6UhRCl9QbnBZYXgeyRNR1YXWjbrUhEtA9J0U97=s64-c-k-c0x00ffffff-no-rj",
                    "width": 64
                }
            ],
            "name": "\u3048\u3073"
        },
        "message": "\u30af\u30fc\u30eb",
        "message_id": "CjkKGkNQcTBockhWa19jQ0ZiUWhyUVlkMlBvR0xBEhtDTUhUOC12VGtfY0NGZEZORHdJZE9WOFBpZzA%3D",
        "message_type": "text_message",
        "time_in_seconds": 60.509,
        "time_text": "1:00",
        "timestamp": 1649943196572338
    }, 
    {
        "action_type": "add_chat_item",
        "author": {
            "id": "UCy7sPvhvzAZlIEpjZHdjNwA",
            "images": [
                {
                    "id": "source",
                    "url": "https://yt4.ggpht.com/diEAnZgF4DOcC8EDOFsT7WtrWUSx1A1z7F6UhRCl9QbnBZYXgeyRNR1YXWjbrUhEtA9J0U97"
                },
                {
                    "height": 32,
                    "id": "32x32",
                    "url": "https://yt4.ggpht.com/diEAnZgF4DOcC8EDOFsT7WtrWUSx1A1z7F6UhRCl9QbnBZYXgeyRNR1YXWjbrUhEtA9J0U97=s32-c-k-c0x00ffffff-no-rj",
                    "width": 32
                },
                {
                    "height": 64,
                    "id": "64x64",
                    "url": "https://yt4.ggpht.com/diEAnZgF4DOcC8EDOFsT7WtrWUSx1A1z7F6UhRCl9QbnBZYXgeyRNR1YXWjbrUhEtA9J0U97=s64-c-k-c0x00ffffff-no-rj",
                    "width": 64
                }
            ],
            "name": "\u3048\u3073"
        },
        "message": "\u3044\u3044\u3067\u3059\u3088\u306d",
        "message_id": "CjkKGkNJeUF6b25Xa19jQ0ZkTVFyUVlkbXI4SlB3EhtDTUhUOC12VGtfY0NGZEZORHdJZE9WOFBpZzM%3D",
        "message_type": "text_message",
        "time_in_seconds": 246.788,
        "time_text": "4:06",
        "timestamp": 1649943382294577
    }
]

let newNicoArray = []

youtubeChatArray.map((item, index)=>{
	let newNicoItem = {
		"chat": {
			"thread": "youtube",
			"no": index+1,
			"vpos": parseInt(item.time_in_seconds.toFixed(2)*100),
			"date": item.timestamp,
			"date_usec": item.timestamp,
			"mail": "184",
			"user_id": "youtube_user",
			"premium": 1,
			"anonymity": 1,
			"content": item.message
		}
	}
	
	newNicoArray.push(newNicoItem);
	
});

var fs = require("fs");

var fObj = {
	"thread": {
		"resultcode": 0,
		"thread": "youtube",
		"last_res": newNicoArray.length,
		"ticket": "0x473ad00",
		"revision": 1,
		"server_time": 114514,
		"lv": "lv114514",
		"title": "其它",
	}
}

newNicoArray.unshift(fObj);

fs.writeFile("./test.txt", JSON.stringify(newNicoArray), (err, data) => {
    if (err) throw err;
});

// console.log(newNicoArray);