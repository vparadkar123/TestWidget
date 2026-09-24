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
myWidget.searchGoogle(myWidget.dataFull[index]);}); }); }, 
searchGoogle:function(taskData){

    var responseDiv =
        widget.body.querySelector("#searchResponse");

    responseDiv.innerHTML =
        "<b>Preparing Google Search...</b>";

    function stripHtml(html){

        if(!html){
            return "";
        }

        var div = document.createElement("div");
        div.innerHTML = html;

        return (
            div.textContent ||
            div.innerText ||
            ""
        )
        .replace(/\s+/g," ")
        .trim();
    }

    try{

        var cleanTitle = stripHtml(taskData.title);

        cleanTitle = cleanTitle
            .replace(/CA-\d+-\d+/gi, "")
            .replace(/Approval task to review changes done on/gi, "")
            .replace(/https?:\/\/\S+/gi, "")
            .replace(/[^\w\s]/g, " ")
            .replace(/\s+/g, " ")
            .trim();

        if(!cleanTitle){
            cleanTitle = taskData.title;
        }

        console.log("Original Title:", taskData.title);
        console.log("Search Query:", cleanTitle);

        var googleUrl =
            "https://www.google.com/search?q=" +
            encodeURIComponent(cleanTitle);

        console.log("Google URL:", googleUrl);

        responseDiv.innerHTML =
            "<h3>Google Search</h3>" +
            "<p><b>Search Term:</b> " +
            cleanTitle +
            "</p>" +
            "<p><a href='" +
            googleUrl +
       
            "Open Google Search Results" +
            "</a></p>";

        window.open(
            googleUrl,
            "_blank"
        );

    }
    catch(e){

        console.error("Google Search Error", e);

        responseDiv.innerHTML =
            "<span style='color:red'>" +
            "Failed to generate Google search." +
            "</span><br/><pre>" +
            JSON.stringify(e,null,2) +
            "</pre>";
    }
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
widget.addEvent("onRefresh",myWidget.onLoadWidget); }); }
