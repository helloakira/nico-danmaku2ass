var commentStopText = `// 获取lv号&获取标题
LV = document.URL.split("/").slice(-1)[0];
fristObj["thread"]["lv"] = LV.indexOf("?")>-1 ? LV.substr(0, LV.indexOf("?")) : LV;
fristObj["thread"]["title"] = jsonToXml_RegExp(document.title);
danmakuChatArray.unshift(fristObj);

console.log("---扣取弹幕完毕，请按右键-'Copy object'复制下行---");
console.log(danmakuChatArray);
console.log("---扣取弹幕完毕，请按右键-'Copy object'复制上行---");
`
