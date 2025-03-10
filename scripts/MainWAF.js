function executeWidgetCode() {
    require(["DS/WAFData/WAFData"], function(WAFData) {
        var myWidget = {
            dataFull: [],

            displayData: function(arrData) {
                var tableHTML =
                    "<div style='height:100%;overflow:auto;'><table><thead><tr><th>Type</th><th>Name</th><th>Revision</th><th>State</th></tr></thead><tbody>";

                for (var i = 0; i < arrData.length; i++) {
                    tableHTML =
                        tableHTML +
                        "<tr><td>" +
                        arrData[i].type +
                        "</td><td>" +
                        arrData[i].name +
                        "</td><td>" +
                        arrData[i].revision +
                        "</td><td>" +
                        arrData[i].current +
                        "</td></tr>";
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
                   		   SecurityContext: widget.getValue("ctx")
				   cookie: "JSESSIONID=2DFD573DAD45221D54E6E4D2F3E60AAB; SERVERID=MT_Metadata_1_7025"
				   token: "P7LH-7PDS-CIDA-C92Q-HGNW-P011-O583-SMXM"
				   libraryId: "a"
                };
                var methodWAF = "GET";
                WAFData.authenticatedRequest(urlWAF, {
					method: methodWAF,
					headers: headerWAF,
					data: dataWAF,
					type: "json",
					onComplete: function(dataResp) {
                       	if (dataResp.msg === "OK") {
							myWidget.dataFull = dataResp.data;
							myWidget.displayData(myWidget.dataFull);
							console.log(myWidget.dataFull);
                       } else {
							widget.body.innerHTML += "<p>Error in WebService Response</p>";
							widget.body.innerHTML += "<p>" + JSON.stringify(dataResp) + "</p>";
                       }
					},
					onFailure: function(error) {
						widget.body.innerHTML += "<p>Call Faillure</p>";
						widget.body.innerHTML += "<p>" + JSON.stringify(error) + "</p>";
					}
                });
            }
        };

        widget.addEvent("onLoad", myWidget.onLoadWidget);
        widget.addEvent("onRefresh", myWidget.onLoadWidget);
        
    });
}
