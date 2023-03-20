let asobiChatArray =  [
    {
        "data": {
            "color": "#e539c2",
            "comment": [
                "へーきへーき、俺も遠いからさ（海の向こう）"
            ],
            "type": "user/send-comment",
            "userName": "Zenka"
        },
        "playtime": 0.277,
        "status": "0",
        "time": "2022-10-23 16:51:49.276889968"
    },
    {
        "data": {
            "color": "#39e58c",
            "comment": [
                "さて"
            ],
            "type": "user/send-comment",
            "userName": "aos"
        },
        "playtime": 3.129,
        "status": "0",
        "time": "2022-10-23 16:51:52.128747196"
    }
]

let newNicoArray = []

asobiChatArray.map((item, index)=>{
	let newNicoItem = {
		"chat": {
			"thread": "asobi",
			"no": index+1,
			"vpos": parseInt(item.playtime.toFixed(2)*100),
			"date": item.time,
			"date_usec": item.time,
			"mail": item.data.color,
			"user_id": "asobi_user",
			"premium": 1,
			"anonymity": 1,
			"content": item.data.comment[0]
		}
	}
	
	newNicoArray.push(newNicoItem);
	
});

// console.log(newNicoArray);

var fs = require("fs");

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

fs.writeFile("./test.txt", JSON.stringify(newNicoArray), (err, data) => {
    if (err) throw err;
});
