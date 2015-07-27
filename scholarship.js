//To get list of all State Ids and their Names in the console use this script


//get names of all states in an array
var statesArray =[],districtArray=[],mandalArray=[],studyLevelArray=[],instituteArray=[],institutes=[];
$("#studyStateId option").each(function()
{
    var state={};
    state.id=$(this).val();
    state.name=$(this).text();
    statesArray.push(state)          
});
//for removing select option
statesArray.splice(0,1);


//get names of study levels in an array
$("#studyLevelId option").each(function()
{
    var studyLevel={};
    studyLevel.id=$(this).val();
    studyLevel.name=$(this).text();
    studyLevelArray.push(studyLevel);          
});
//for removing select option
studyLevelArray.splice(0,1);


//function for getting an array of district objects with their state mapping and mandal objects with their district and state mapping
for(var i=0; i<statesArray.length; i++){
    (function(i) {
       	$.ajax({
			type : "POST",
			url : "ajaxActions.do?mode=getDistrictsMandalsVillagesDropDownList",
			dataType : 'html',
			data : 
			{
				type : 17,
				stateCode : statesArray[i].id,							
				instId : 0,				
				randomNo : Math.random()
			},
			success : function(response) 
			{	
				
				var info = response.split("#");		    									
			    for(var j=0;j<info.length;j++){			    	
    				(function(j) {
    					var districtObj={};
    					districtObj.stateId=statesArray[i].id;
				    	districtObj.districtId=info[j].split('@')[0];
				    	districtObj.districtName=info[j].split('@')[1];
				    	districtArray.push(districtObj);
				       	$.ajax({
							type : "POST",
							url : "ajaxActions.do?mode=getDistrictsMandalsVillagesDropDownList",
							dataType : 'html',
							data : 
							{
								type : 30,
								stateCode : statesArray[i].id,							
								districtCode : districtObj.districtId,
								levelId : 0, 				
								randomNo : Math.random()
							},
							success : function(response) 
							{
								var infoMandal = response.split("#");				
							    for(var k=0;k<infoMandal.length;k++){							    	
							    	var mandalObj={};
							    	mandalObj.stateId=statesArray[i].id;
							    	mandalObj.districtId=districtObj.districtId;
							    	mandalObj.mandalId=infoMandal[k].split('@')[0];
							    	mandalObj.mandalName=infoMandal[k].split('@')[1];			    	
							    	mandalArray.push(mandalObj);
							    }
							},
							error : function(xhr, ajaxOptions, thrownError) {
								//alert(xhr.status);
							}
						});
				     })(j);			    	
			    }
			},
			error : function(xhr, ajaxOptions, thrownError) {
				//alert(xhr.status);
			}
		});
     })(i);
}

//code for getting all institute names mandal wise
//This is not complete


for(var i=0; i<mandalArray.length; i++){	
		(function(i) {			
	       	$.ajax({
				type : "POST",
				url : "ajaxActions.do?mode=getInstitutionsList" ,
				cache : false,
				dataType : "html",
				data : {
					instState : mandalArray[i].stateId, 
					instDist : mandalArray[i].districtId ,
				  	instMandal : mandalArray[i].mandalId,
				  	courseLevel : 0,
				  	random : Math.random()
				},
				success : function(response) 
				{					
					var info = response.split("#");
					// console.log(info)
					for(var k=0;k<info.length;k++){
//To ensure institutes are not repeated for different values of study levels we create a hashmap(array with character as key ) that checks if this institute has already been added to record
						var instututeUuid=info[k].split('@')[0];
							var instituteObj={};
					    	instituteObj.stateId=mandalArray[i].stateId;
					    	instituteObj.districtId=mandalArray[i].districtId;
					    	instituteObj.mandalId=mandalArray[i].mandalId;
					    	instituteObj.instututeUUId=instututeUuid;
					    	instituteObj.mandalName=info[k].split('@')[1];
					    	instituteArray.push(instituteObj);
				    }					
				},
				error : function(xhr, ajaxOptions, thrownError) {
					alert(xhr.status + " --> Error Ocucured while loading course info");
				}
			});
	    })(i);
}