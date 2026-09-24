
function executeWidgetCode() {
 
require(
[
"DS/WAFData/WAFData",
"DS/i3DXCompassServices/i3DXCompassServices"
],
function (WAFData, i3DXCompassServices) {
 
var myWidget = {
 
varServiceURL: "",
dataFull: [],
 
config: {
 
anythingLLMUrl:
"http://localhost:3001/api/v1/workspace/my-workspace/query",
 
apiKey:
"Y6BYR6K-GDN4PS9-J1TXRXY-AVB1WPX",
 
promptTemplate:
"Provide an IP Classification recommendation for the following title: {{title}}"
 
},
 
buildPrompt: function (taskData) {
 
return this.config.promptTemplate
.replace(
"{{title}}",
taskData.title || ""
);
},
 
displayData: function (arrData) {
 
var tableHTML =
"<div style='height:100%;overflow:auto;'>" +
"<table style='width:100%;border-collapse:collapse;border:1px solid #cccccc;'>" +
"<thead>" +
"<tr>" +
"<th style='border:1px solid #cccccc;padding:4px;'>Title</th>" +
"<th style='border:1px solid #cccccc;padding:4px;'>State</th>" +
"<th style='border:1px solid #cccccc;padding:4px;'>Policy</th>" +
"<th style='border:1px solid #cccccc;padding:4px;'>AI Suggestion</th>" +
"</tr>" +
"</thead>" +
"<tbody>";
 
for (var i = 0; i < arrData.length; i++) {
 
tableHTML +=
"<tr>" +
"<td style='border:1px solid #cccccc;padding:4px;'>" +
arrData[i].title +
"</td>" +
"<td style='border:1px solid #cccccc;padding:4px;'>" +
arrData[i].state +
"</td>" +
"<td style='border:1px solid #cccccc;padding:4px;'>" +
arrData[i].policy +
"</td>" +
"<td style='border:1px solid #cccccc;padding:4px;'>" +
"<button class='aiBtn' data-index='" + i + "'>" +
"AI Suggestion" +
"</button>" +
"</td>" +
"</tr>";
}
 
tableHTML +=
"</tbody>" +
"</table>" +
 
"<div id='aiResponse' " +
"style='margin-top:10px;padding:10px;border:1px solid #cccccc;background:#f5f5f5;'>" +
"Click 'AI Suggestion' to get recommendation." +
"</div>" +
 
"</div>";
 
widget.body.innerHTML = tableHTML;
 
var buttons =
widget.body.querySelectorAll(".aiBtn");
 
buttons.forEach(function (btn) {
 
btn.addEventListener(
"click",
function () {
 
var idx = parseInt(
this.getAttribute("data-index"),
10
);
 
myWidget.getAISuggestion(
myWidget.dataFull[idx]
);
}
);
});
},
 
onLoadWidget: function () {
 
widget.body.innerHTML =
"<p>Loading Tasks...</p>";
 
myWidget.callData();
},
 
callData: function () {
 
i3DXCompassServices.getServiceUrl({
 
serviceName: "3DSpace",
 
platformId:
widget.getValue(
"x3dPlatformId"
),
 
onComplete: function (
URLResult
) {
 
myWidget.tableData(
URLResult
);
},
 
onFailure: function (
error
) {
 
console.log(error);
}
});
},
 
tableData: function (
serviceURL
) {
 
var urlWAF =
serviceURL +
"/resources/v1/modeler/tasks";
 
console.log(urlWAF);
 
WAFData.proxifiedRequest(
urlWAF,
{
 
proxy: "passport",
 
type: "json",
 
onComplete: function (
dataResp
) {
 
var tasks = [];
 
if (
dataResp &&
dataResp.data
) {
 
dataResp.data.forEach(
function (
element
) {
 
tasks.push({
 
title:
element
.dataelements
.title,
 
state:
element
.dataelements
.state,
 
policy:
element
.dataelements
.policy
});
}
);
}
 
myWidget.dataFull = tasks;
 
myWidget.displayData(
myWidget.dataFull
);
},
 
onFailure: function (
error
) {
 
widget.body.innerHTML =
"<p>Call Failure</p>" +
"<pre>" +
JSON.stringify(
error,
null,
2
) +
"</pre>";
}
}
);
},
 
getAISuggestion: function (
taskData
) {
 
var responseDiv =
widget.body.querySelector(
"#aiResponse"
);
 
responseDiv.innerHTML =
"<b>Getting AI suggestion...</b>";
 
var prompt =
myWidget.buildPrompt(
taskData
);
 
/*
* AnythingLLM /query payload
*/
var payload = {
 
query: prompt
 
};
 
console.log(
"AnythingLLM Request:",
payload
);
 
WAFData.authenticatedRequest(
myWidget.config
.anythingLLMUrl,
{
 
method: "POST",
 
headers: {
 
"Content-Type":
"application/json",
 
"Authorization":
"Bearer " +
myWidget.config
.apiKey
},
 
data: JSON.stringify(
payload
),
 
onComplete: function (
response
) {
 
console.log(
"AnythingLLM Response:",
response
);
 
var answer = "";
 
if (
response &&
response.textResponse
) {
 
answer =
response.textResponse;
 
} else if (
response &&
response.response
) {
 
answer =
response.response;
 
} else {
 
answer =
JSON.stringify(
response,
null,
2
);
}
 
responseDiv.innerHTML =
"<h3>IP Classification Recommendation</h3>" +
"<pre style='white-space:pre-wrap;'>" +
answer +
"</pre>";
},
 
onFailure: function (
error
) {
 
console.error(
error
);
 
responseDiv.innerHTML =
"<span style='color:red'>" +
"AnythingLLM API Call Failed" +
"</span><br><pre>" +
JSON.stringify(
error,
null,
2
) +
"</pre>";
}
}
);
}
};
 
widget.addEvent(
"onLoad",
myWidget.onLoadWidget
);
 
widget.addEvent(
"onRefresh",
myWidget.onLoadWidget
);
}
);
}
