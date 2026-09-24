
function executeWidgetCode(){
require(["DS/WAFData/WAFData","DS/i3DXCompassServices/i3DXCompassServices"],function(WAFData,i3DXCompassServices){

var myWidget={

GEMINI_API_KEY:"AQ.Ab8RN6JjoWU-3cfhDt0jKiaWS23_o7FDPEUR0S6RORNE9zqvhw",
dataFull:[],

renderTable:function(arrData){

if(!arrData || arrData.length===0){
widget.body.innerHTML="<p>No tasks found.</p>";
return;
}

var html="<div style='height:100%;overflow:auto;'>"+
"<div style='margin-bottom:10px;'>"+
"<button id='aiGenerateBtn' style='padding:6px 12px;'>AI Generate</button>"+
"</div>"+
"<table style='width:100%;border-collapse:collapse;border:1px solid #cccccc;'>"+
"<thead><tr>"+
"<th style='border:1px solid #cccccc;padding:5px;'>Select</th>"+
"<th style='border:1px solid #cccccc;padding:5px;'>Title</th>"+
"<th style='border:1px solid #cccccc;padding:5px;'>State</th>"+
"<th style='border:1px solid #cccccc;padding:5px;'>Policy</th>"+
"</tr></thead><tbody>";

for(var i=0;i<arrData.length;i++){
html += "<tr>"+
"<td style='border:1px solid #cccccc;padding:5px;text-align:center;'><input type='checkbox' class='taskCheckbox' data-index='"+i+"'></td>"+
"<td style='border:1px solid #cccccc;padding:5px;'>"+arrData[i].title+"</td>"+
"<td style='border:1px solid #cccccc;padding:5px;'>"+arrData[i].state+"</td>"+
"<td style='border:1px solid #cccccc;padding:5px;'>"+arrData[i].policy+"</td>"+
"</tr>";
}

html += "</tbody></table>"+
"<div id='searchResponse' style='margin-top:10px;padding:10px;border:1px solid #cccccc;background:#f7f7f7;min-height:150px;'>Select one or more tasks and click AI Generate.</div>"+
"</div>";

widget.body.innerHTML = html;

widget.body.querySelector('#aiGenerateBtn').addEventListener('click',function(){
myWidget.generateAI();
});
},

cleanText:function(text){
var div=document.createElement('div');
div.innerHTML=text || '';
return (div.textContent || div.innerText || '')
.replace(/CA-\d+-\d+/gi,'')
.replace(/Approval task to review changes done on/gi,'')
.replace(/[^\w\s]/g,' ')
.replace(/\s+/g,' ')
.trim();
},

generateAI:function(){

var responseDiv=widget.body.querySelector('#searchResponse');
var checked=widget.body.querySelectorAll('.taskCheckbox:checked');

if(!checked || checked.length===0){
responseDiv.innerHTML='<span style="color:red">Please select at least one task.</span>';
return;
}

var titles=[];
checked.forEach(function(cb){
var idx=parseInt(cb.getAttribute('data-index'),10);
titles.push(myWidget.cleanText(myWidget.dataFull[idx].title));
});

var prompt='Suggest IP Classification and provide reasoning for the following tasks:\n\n'+titles.join('\n');

responseDiv.innerHTML='<b>Generating AI response...</b>';

fetch(
'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key='+myWidget.GEMINI_API_KEY,
{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({
contents:[{
parts:[{text:prompt}]
}]
})
}
)
.then(function(resp){return resp.json();})
.then(function(data){
var result='No response received';
if(data && data.candidates && data.candidates.length>0){
result=data.candidates[0].content.parts[0].text;
}
responseDiv.innerHTML='<h3>AI Suggestion</h3><div style="white-space:pre-wrap">'+result+'</div>';
})
.catch(function(err){
responseDiv.innerHTML='<span style="color:red">Gemini API Error</span><br/><pre>'+JSON.stringify(err,null,2)+'</pre>';
});
},

onLoadWidget:function(){
widget.body.innerHTML='<p>Loading Tasks...</p>';
myWidget.callData();
},

callData:function(){
i3DXCompassServices.getServiceUrl({
serviceName:'3DSpace',
platformId:widget.getValue('x3dPlatformId'),
onComplete:function(URLResult){myWidget.tableData(URLResult);},
onFailure:function(error){console.log(error);}
});
},

tableData:function(serviceURL){
var urlWAF=serviceURL+'/resources/v1/modeler/tasks';
WAFData.proxifiedRequest(urlWAF,{
proxy:'passport',
type:'json',
onComplete:function(dataResp){
var tasks=[];
if(dataResp && dataResp.data){
dataResp.data.forEach(function(element){
tasks.push({
title:element.dataelements.title,
state:element.dataelements.state,
policy:element.dataelements.policy
});
});
}
myWidget.dataFull=tasks;
myWidget.renderTable(tasks);
},
onFailure:function(error){
widget.body.innerHTML='<p>Call Failure</p><pre>'+JSON.stringify(error,null,2)+'</pre>';
}
});
}
};

widget.addEvent('onLoad',myWidget.onLoadWidget);
widget.addEvent('onRefresh',myWidget.onLoadWidget);
});
}
