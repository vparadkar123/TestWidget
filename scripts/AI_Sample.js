function executeWidgetCode(){
require(["DS/WAFData/WAFData","DS/i3DXCompassServices/i3DXCompassServices"],function(WAFData,i3DXCompassServices){

var myWidget={
    dataFull:[],

    displayData:function(arrData){

        if(!arrData || arrData.length===0){
            widget.body.innerHTML='<p>No tasks found.</p>';
            return;
        }

        var tableHTML='';

        tableHTML += "<div style='font-family:Arial,sans-serif;padding:8px;'>";
        tableHTML += "<div style='margin-bottom:12px;'>";
        tableHTML += "<button id='aiGenerateBtn' style='background:#0055A4;color:white;border:none;padding:10px 18px;border-radius:4px;font-weight:bold;cursor:pointer;'>AI Generate</button>";
        tableHTML += "</div>";

        tableHTML += "<table style='width:100%;border-collapse:collapse;border:1px solid #d0d0d0;font-size:13px;'>";
        tableHTML += "<thead><tr style='background:#f0f4f8;'>";
        tableHTML += "<th style='border:1px solid #d0d0d0;padding:8px;font-weight:bold;'>Select</th>";
        tableHTML += "<th style='border:1px solid #d0d0d0;padding:8px;font-weight:bold;'>Title</th>";
        tableHTML += "<th style='border:1px solid #d0d0d0;padding:8px;font-weight:bold;'>State</th>";
        tableHTML += "<th style='border:1px solid #d0d0d0;padding:8px;font-weight:bold;'>Policy</th>";
        tableHTML += "</tr></thead><tbody>";

        for(var i=0;i<arrData.length;i++){
            tableHTML += "<tr>";
            tableHTML += "<td style='border:1px solid #d0d0d0;padding:8px;text-align:center;'><input type='checkbox' class='taskCheckbox' data-index='"+i+"'></td>";
            tableHTML += "<td style='border:1px solid #d0d0d0;padding:8px;'>"+arrData[i].title+"</td>";
            tableHTML += "<td style='border:1px solid #d0d0d0;padding:8px;'>"+arrData[i].state+"</td>";
            tableHTML += "<td style='border:1px solid #d0d0d0;padding:8px;'>"+arrData[i].policy+"</td>";
            tableHTML += "</tr>";
        }

        tableHTML += "</tbody></table>";

        tableHTML += "<div id='searchResponse' style='margin-top:15px;padding:12px;border:1px solid #d0d0d0;background:#fafafa;min-height:150px;'>Select one or more tasks and click AI Generate.</div>";
        tableHTML += "</div>";

        widget.body.innerHTML=tableHTML;

        widget.body.querySelector('#aiGenerateBtn').addEventListener('click',function(){
            myWidget.generateAI();
        });
    },

    generateAI:function(){

        var responseDiv=widget.body.querySelector('#searchResponse');
        var checked=widget.body.querySelectorAll('.taskCheckbox:checked');

        if(!checked || checked.length===0){
            responseDiv.innerHTML='<span style="color:red;font-weight:bold;">Please select at least one task.</span>';
            return;
        }

        var selectedTasks=[];

        checked.forEach(function(cb){
            var idx=parseInt(cb.getAttribute('data-index'),10);

            selectedTasks.push({
                title:myWidget.dataFull[idx].title,
                state:myWidget.dataFull[idx].state,
                policy:myWidget.dataFull[idx].policy
            });
        });

        var requestJson={
            model:'generic-ai-model',
            action:'IP Classification',
            timestamp:new Date().toISOString(),
            prompt:'Suggest IP Classification and provide reasoning for selected tasks.',
            tasks:selectedTasks
        };

        responseDiv.innerHTML=
            '<h3 style="color:#0055A4;">AI Suggestion Demo</h3>'+
            '<p><b>Classification:</b> Internal</p>'+
            '<p><b>Reasoning:</b> This is a demo response. The payload below represents the information that would be sent to an AI/LLM service.</p>'+
            '<hr>'+
            '<h4>Generated JSON Payload</h4>'+
            '<pre style="white-space:pre-wrap;overflow:auto;background:#f4f4f4;padding:10px;border-radius:4px;">'+
            JSON.stringify(requestJson,null,2)+
            '</pre>';
    },

    onLoadWidget:function(){
        widget.body.innerHTML='<p>Loading Tasks Using Webservice...</p>';
        myWidget.callData();
    },

    callData:function(){
        i3DXCompassServices.getServiceUrl({
            serviceName:'3DSpace',
            platformId:widget.getValue('x3dPlatformId'),
            onComplete:function(URLResult){
                myWidget.tableData(URLResult);
            },
            onFailure:function(error){
                console.log(error);
            }
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
                myWidget.displayData(tasks);
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
