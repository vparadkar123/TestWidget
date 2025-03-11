function executeWidgetCode() {
    require(["DS/WAFData/WAFData", "DS/i3DXCompassServices/i3DXCompassServices"], function(WAFData, i3DXCompassServices) {
        var myWidget = {
			varServiceURL: "",
            dataFull: [],
            title:"",
            state:"",
            project:"",
            

            displayData: function(arrData) {
                var tableHTML =
                    "<div style='height:100%;overflow:auto;'><table><thead><tr><th>Title</th><th>State</th><th>Policy</th><tbody>";

                for (var i = 0; i < arrData.length; i++) {
                    tableHTML =
                        tableHTML +
                        "<tr><td>" +
                        arrData[i].title +
                        "</td><td>" +
                        arrData[i].state +
                        "</td><td>" +
                        arrData[i].policy +
                        "</td></tr>" 
                       
                }

                tableHTML += "</tbody></table></div>";

                widget.body.innerHTML = tableHTML;
            },

            onLoadWidget: function() {
                myWidget.callData();
                myWidget.displayData(myWidget.dataFull);
            },

           callData: function() {
                var urlWAF = widget.getValue("urlREST");
                var dataWAF = {
                   type: widget.getValue("typeObj"),
                   selects: "attribute[*],current,name,revision"
                };
                var headerWAF = {
                   SecurityContext: "VPLMProjectAdministrator.Company Name.CIMPA DE"
                };
                var methodWAF = "GET";
                WAFData.authenticatedRequest("https://r1132103242220-eu1-space.3dexperience.3ds.com/enovia/resources/v1/application/CSRF", {
					method: methodWAF,
					headers: headerWAF,
					onComplete: function(dataResp) {
							console.log(dataResp);
                    			},
					onFailure: function(error) {
						widget.body.innerHTML += "<p>Call Faillure</p>";
						widget.body.innerHTML += "<p>" + JSON.stringify(error) + "</p>";
					}
                });
            },
			
			tableData: function(serviceURL) {
				var urlWAF = serviceURL + "/resources/v1/modeler/tasks";
				console.log(urlWAF);
                var methodWAF = "GET";
                WAFData.proxifiedRequest(urlWAF, {
                    proxy : 'passport' ,
					type: "json",
					onComplete: function(dataResp) {
                        const tasks=[];
							dataResp.data.forEach(element => {
                                tasks.push({
                                    title : element.dataelements.title,
                                    state:element.dataelements.state,
                                    policy:element.dataelements.policy
								})
                            })
                            myWidget.dataFull=tasks;
                            console.log("datafull",myWidget.dataFull);
                            myWidget.displayData(myWidget.dataFull);
					},
					onFailure: function(error) {
						widget.body.innerHTML += "<p>Call Failure</p>";
						widget.body.innerHTML += "<p>" + JSON.stringify(error) + "</p>";
					}
                });
             }
        };

        widget.addEvent("onLoad", myWidget.onLoadWidget);
        widget.addEvent("onRefresh", myWidget.onLoadWidget);
        
    });
}
