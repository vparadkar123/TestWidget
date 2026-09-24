// AI Widget using dseng:EngItem/search
// Displays Part Name, Description and Current State

function executeWidgetCode(){
require(["DS/WAFData/WAFData","DS/i3DXCompassServices/i3DXCompassServices"],function(WAFData,i3DXCompassServices){

var myWidget={
 dataFull:[],

 displayData:function(arrData){
  var html = "<div style='font-family:Arial;padding:8px'>";
  html += "<button id='aiGenerateBtn' style='background:#0055A4;color:white;border:none;padding:10px 18px;font-weight:bold;border-radius:4px;margin-bottom:10px;'>AI Generate</button>";
  html += "<table style='width:100%;border-collapse:collapse'>";
  html += "<thead><tr style='background:#eef3f8'>";
  html += "<th style='padding:8px;border:1px solid #ccc;font-weight:bold'>Select</th>";
  html += "<th style='padding:8px;border:1px solid #ccc;font-weight:bold'>Part Name</th>";
  html += "<th style='padding:8px;border:1px solid #ccc;font-weight:bold'>Description</th>";
  html += "<th style='padding:8px;border:1px solid #ccc;font-weight:bold'>Current State</th>";
  html += "</tr></thead><tbody>";

  for(var i=0;i<arrData.length;i++){
   html += "<tr>";
   html += "<td style='padding:8px;border:1px solid #ccc;text-align:center'><input type='checkbox' class='partCB' data-index='"+i+"'></td>";
   html += "<td style='padding:8px;border:1px solid #ccc'>"+(arrData[i].partName||'')+"</td>";
   html += "<td style='padding:8px;border:1px solid #ccc'>"+(arrData[i].description||'')+"</td>";
   html += "<td style='padding:8px;border:1px solid #ccc'>"+(arrData[i].current||'')+"</td>";
   html += "</tr>";
  }

  html += "</tbody></table>";
  html += "<div id='searchResponse' style='margin-top:15px;border:1px solid #ccc;padding:10px;min-height:150px;background:#fafafa'></div>";
  html += "</div>";

  widget.body.innerHTML = html;

  document.getElementById('aiGenerateBtn').onclick=function(){
   var selected=[];
   var cbs=widget.body.querySelectorAll('.partCB:checked');

   cbs.forEach(function(cb){
    var idx=parseInt(cb.getAttribute('data-index'),10);
    selected.push(myWidget.dataFull[idx]);
   });

   var payload={
    model:'generic-ai-model',
    action:'IP Classification',
    timestamp:new Date().toISOString(),
    parts:selected
   };

   widget.body.querySelector('#searchResponse').innerHTML=
    '<h3>AI Suggestion Demo</h3>'+
    '<p><b>Classification:</b> Internal</p>'+
    '<p><b>Payload that would be sent to AI:</b></p>'+
    '<pre>'+JSON.stringify(payload,null,2)+'</pre>';
  };
 },

 onLoadWidget:function(){
  widget.body.innerHTML='Loading Engineering Items...';
  myWidget.callData();
 },

 callData:function(){
  i3DXCompassServices.getServiceUrl({
   serviceName:'3DSpace',
   platformId:widget.getValue('x3dPlatformId'),
   onComplete:function(url){myWidget.tableData(url);}
  });
 },

 tableData:function(serviceURL){
  var urlWAF = serviceURL + '/resources/v1/modeler/dseng/dseng:EngItem/search?$top=100';

  WAFData.proxifiedRequest(urlWAF,{
   proxy:'passport',
   type:'json',
   onComplete:function(dataResp){

    var parts=[];

    if(dataResp && dataResp.member){
      dataResp.member.forEach(function(item){
       parts.push({
        partName:item.name || '',
        description:item.description || '',
        state:item.current || item.state || ''
       });
      });
    }

    myWidget.dataFull=parts;
    myWidget.displayData(parts);
   },
   onFailure:function(err){
    widget.body.innerHTML='<pre>'+JSON.stringify(err,null,2)+'</pre>';
   }
  });
 }
};

widget.addEvent('onLoad',myWidget.onLoadWidget);
widget.addEvent('onRefresh',myWidget.onLoadWidget);
});
}
