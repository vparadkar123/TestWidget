function executeWidgetCode(){ 
require(["DS/WAFData/WAFData","DS/i3DXCompassServices/i3DXCompassServices"],function(WAFData,i3DXCompassServices){ 
var myWidget={ 
varServiceURL:"",dataFull:[],title:"",state:"",project:"", 
displayData:function(arrData){ 
if(!arrData||arrData.length===0){ 
widget.body.innerHTML="<p>No tasks found.</p>"; 
return;}
 
var tableHTML="<div style='height:100%;overflow:auto;'>"+
 "<table style='width:100%;border-collapse:collapse;border:1px solid #cccccc;'>"+
 "<thead>"+"<tr>"+"<th style='border:1px solid #cccccc;padding:5px;'>Title</th>"+"<th style='border:1px solid #cccccc;padding:5px;'>State</th>"+"<th style='border:1px solid #cccccc;padding:5px;'>Policy</th>"+"<th style='border:1px solid #cccccc;padding:5px;'>Search</th>"+"</tr>"+"</thead>"+
 "<tbody>"; 
for(var i=0;i<arrData.length;i++){ 
tableHTML+="<tr>"+
 "<td style='border:1px solid #cccccc;padding:5px;'>"+
arrData[i].title+"</td>"+
 "<td style='border:1px solid #cccccc;padding:5px;'>"+
arrData[i].state+"</td>"+
 "<td style='border:1px solid #cccccc;padding:5px;'>"+
arrData[i].policy+"</td>"+
 "<td style='border:1px solid #cccccc;padding:5px;'>"+"<button class='searchBtn' data-index='"+i+"'>"+"Search"+"</button>"+"</td>"+
 "</tr>";}
 
tableHTML+="</tbody>"+"</table>"+
 "<div id='searchResponse' "+"style='margin-top:10px;padding:10px;border:1px solid #cccccc;background:#f7f7f7;min-height:120px;'>"+"Click Search to get information about the selected title."+"</div>"+
 "</div>"; 
widget.body.innerHTML=tableHTML; 
var buttons=widget.body.querySelectorAll(".searchBtn"); 
buttons.forEach(function(btn){ 
btn.addEventListener("click",function(){ 
var index=parseInt(this.getAttribute("data-index"),10); 
myWidget.searchWikipedia(myWidget.dataFull[index]);}); }); }, 
searchWikipedia:function(taskData){

    var responseDiv = widget.body.querySelector("#searchResponse");

    responseDiv.innerHTML = "<b>Searching Wikipedia...</b>";

    // Clean the title so Wikipedia has a better chance of finding a page
    var searchQuery = taskData.title
        .replace(/CA-\d+-\d+/g, "")
        .replace(/Approval task to review changes done on/gi, "")
        .replace(/[^\w\s]/g, " ")
        .trim();

    if(!searchQuery){
        searchQuery = taskData.title;
    }

    var wikiUrl =
        "https://en.wikipedia.org/api/rest_v1/page/summary/" +
        encodeURIComponent(searchQuery);

    console.log("Wikipedia URL:", wikiUrl);

    WAFData.proxifiedRequest(wikiUrl, {
        type: "json",

        onComplete: function(response){

            console.log("Wikipedia Response:", response);

            var html = "<h3>Search Results</h3>";

            if(response && response.extract){

                html += "<p><b>Title:</b> " +
                        (response.title || searchQuery) +
                        "</p>";

                html += "<p>" +
                        response.extract +
                        "</p>";

                if(response.content_urls &&
                   response.content_urls.desktop &&
                   response.content_urls.desktop.page){

                    html += "<p>" +
                        "" +
                        response.content_urls.desktop.page +
                        "" +
                        "Open Wikipedia Article" +
                        "</a>" +
                        "</p>";
                }

            } else {

                html += "<p>No Wikipedia summary found.</p>";
                html += "<p><b>Search Term:</b> " +
                        searchQuery +
                        "</p>";

                html += "<pre style='white-space:pre-wrap'>" +
                        JSON.stringify(response, null, 2) +
                        "</pre>";
            }

            responseDiv.innerHTML = html;
        },

        onFailure: function(error){

            console.error(error);

            responseDiv.innerHTML =
                "<span style='color:red'>" +
                "Wikipedia API call failed." +
                "</span><br/>" +
                "<pre>" +
                JSON.stringify(error, null, 2) +
                "</pre>";
        }
    });
}, 
onLoadWidget:function(){ 
widget.body.innerHTML="<p>Loading Tasks...</p>"; 
myWidget.callData(); }, 
callData:function(){ 
i3DXCompassServices.getServiceUrl({ 
serviceName:"3DSpace", 
platformId:widget.getValue("x3dPlatformId"), 
onComplete:function(URLResult){ 
myWidget.tableData(URLResult); }, 
onFailure:function(error){ 
console.log(error); }}); }, 
tableData:function(serviceURL){ 
var urlWAF=serviceURL+"/resources/v1/modeler/tasks"; 
console.log("Tasks URL:",urlWAF); 
WAFData.proxifiedRequest(urlWAF,{ 
proxy:"passport", 
type:"json", 
onComplete:function(dataResp){ 
var tasks=[]; 
if(dataResp&&dataResp.data){ 
dataResp.data.forEach(function(element){ 
tasks.push({ 
title:element.dataelements.title, 
state:element.dataelements.state, 
policy:element.dataelements.policy
 }); }); }
 
myWidget.dataFull=tasks; 
console.log("dataFull",myWidget.dataFull); 
myWidget.displayData(myWidget.dataFull); }, 
onFailure:function(error){ 
widget.body.innerHTML="<p>Call Failure</p>"+"<pre>"+
JSON.stringify(error,null,2)+"</pre>"; }
 }); }
 }; 
widget.addEvent("onLoad",myWidget.onLoadWidget); 
widget.addEvent("onRefresh",myWidget.onLoadWidget); }); }function executeWidgetCode() {
 
require(
[
"DS/WAFData/WAFData",
"DS/i3DXCompassServices/i3DXCompassServices"
],
function (WAFData, i3DXCompassServices) {
 
var myWidget = {
 
varServiceURL: "",
dataFull: [],
title: "",
state: "",
project: "",
 
displayData: function (arrData) {
 
if (!arrData || arrData.length === 0) {
 
widget.body.innerHTML =
"<p>No tasks found.</p>";
 
return;
}
 
var tableHTML =
"<div style='height:100%;overflow:auto;'>" +
 
"<table style='width:100%;border-collapse:collapse;border:1px solid #cccccc;'>" +
 
"<thead>" +
"<tr>" +
"<th style='border:1px solid #cccccc;padding:5px;'>Title</th>" +
"<th style='border:1px solid #cccccc;padding:5px;'>State</th>" +
"<th style='border:1px solid #cccccc;padding:5px;'>Policy</th>" +
"<th style='border:1px solid #cccccc;padding:5px;'>Search</th>" +
"</tr>" +
"</thead>" +
 
"<tbody>";
 
for (var i = 0; i < arrData.length; i++) {
 
tableHTML +=
"<tr>" +
 
"<td style='border:1px solid #cccccc;padding:5px;'>" +
arrData[i].title +
"</td>" +
 
"<td style='border:1px solid #cccccc;padding:5px;'>" +
arrData[i].state +
"</td>" +
 
"<td style='border:1px solid #cccccc;padding:5px;'>" +
arrData[i].policy +
"</td>" +
 
"<td style='border:1px solid #cccccc;padding:5px;'>" +
"<button class='searchBtn' data-index='" + i + "'>" +
"Search" +
"</button>" +
"</td>" +
 
"</tr>";
}
 
tableHTML +=
"</tbody>" +
"</table>" +
 
"<div id='searchResponse' " +
"style='margin-top:10px;padding:10px;border:1px solid #cccccc;background:#f7f7f7;min-height:120px;'>" +
"Click Search to get information about the selected title." +
"</div>" +
 
"</div>";
 
widget.body.innerHTML = tableHTML;
 
var buttons =
widget.body.querySelectorAll(".searchBtn");
 
buttons.forEach(function (btn) {
 
btn.addEventListener(
"click",
function () {
 
var index = parseInt(
this.getAttribute("data-index"),
10
);
 
myWidget.searchWikipedia(
myWidget.dataFull[index]
);
}
);
 
});
 
},
 
searchWikipedia: function (taskData) {
 
var responseDiv =
widget.body.querySelector(
"#searchResponse"
);
 
responseDiv.innerHTML =
"<b>Searching Wikipedia...</b>";
 
var searchTerm =
encodeURIComponent(
taskData.title
);
 
var wikiUrl =
"https://en.wikipedia.org/api/rest_v1/page/summary/" +
searchTerm;
 
console.log(
"Wikipedia URL:",
wikiUrl
);
 
WAFData.proxifiedRequest(
wikiUrl,
{
 
type: "json",
 
onComplete: function (
response
) {
 
console.log(
"Wikipedia Response:",
response
);
 
var html =
"<h3>Search Results</h3>";
 
if (
response &&
response.title
) {
 
html +=
"<p><b>Title:</b> " +
response.title +
"</p>";
}
 
if (
response &&
response.extract
) {
 
html +=
"<p>" +
response.extract +
"</p>";
 
if (
response.content_urls &&
response.content_urls.desktop &&
response.content_urls.desktop.page
) {
 
html +=
"<p>" +
response.content_urls.desktop.page +
"Open Wikipedia Article</a></p>";
}
}
else {
 
html +=
"<p>No Wikipedia summary found for:</p>" +
"<p><b>" +
taskData.title +
"</b></p>";
 
html +=
"<pre style='white-space:pre-wrap'>" +
JSON.stringify(
response,
null,
2
) +
"</pre>";
}
 
responseDiv.innerHTML = html;
 
},
 
onFailure: function (
error
) {
 
console.error(error);
 
responseDiv.innerHTML =
"<span style='color:red'>" +
"Search API call failed." +
"</span><br/><pre>" +
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
 
console.log(
"Tasks URL:",
urlWAF
);
 
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
element.dataelements.title,
 
state:
element.dataelements.state,
 
policy:
element.dataelements.policy
 
});
 
}
);
 
}
 
myWidget.dataFull =
tasks;
 
console.log(
"dataFull",
myWidget.dataFull
);
 
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
