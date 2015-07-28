//To get list of all State Ids and their Names in the console use this script


//get names of all states in an array
var statesArray =[],districtArray=[],mandalArray=[],studyLevelArray=[],instituteArray=[],institutes=[];
var getDistrictType = 17,getMandalType=30;
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
var i=0;
var stateIndex=0,districtIndex=0,mandalIndex=0;
getDistrictsForState(statesArray[stateIndex].id);

function getDistrictsForState(stateId){
	$.ajax({
		type : "POST",
		url : "ajaxActions.do?mode=getDistrictsMandalsVillagesDropDownList",
		dataType : 'html',
		data : 
		{
			type : getDistrictType,
			stateCode : stateId,
			instId : 0,				
			randomNo : Math.random()
		},
		success : function(response) 
		{				
			var info = response.split("#");
			districtArray=[];		    									
		    for(var j=0;j<info.length;j++){			    	
				(function(j) {
					var districtObj={};
					districtObj.stateId=stateId;
			    	districtObj.districtId=info[j].split('@')[0];
			    	districtObj.districtName=info[j].split('@')[1];
			    	getMandalsForDistrict(stateId,districtObj.districtId)
			    	districtArray.push(districtObj);			       	
			     })(j);
		    }
		},
		error : function(xhr, ajaxOptions, thrownError) {
			//alert(xhr.status);
		}
	});    
}



function getMandalsForDistrict(stateId,districtId){
	$.ajax({
		type : "POST",
		url : "ajaxActions.do?mode=getDistrictsMandalsVillagesDropDownList",
		dataType : 'html',
		data : 
		{
			type : getMandalType,
			stateCode : stateId,							
			districtCode : districtId,
			levelId : 0, 				
			randomNo : Math.random()
		},
		success : function(response) 
		{
			var infoMandal = response.split("#");
			mandalArray=[];			
		    for(var k=0;k<infoMandal.length;k++){							    	
		    	var mandalObj={};
		    	mandalObj.stateId=stateId;
		    	mandalObj.districtId=districtId;
		    	mandalObj.mandalId=parseInt(infoMandal[k].split('@')[0]);
		    	mandalObj.mandalName=infoMandal[k].split('@')[1];
		    	getInstitutesForMandal(stateId,districtId,mandalObj.mandalId)
		    	mandalArray.push(mandalObj);
		    }
		},
		error : function(xhr, ajaxOptions, thrownError) {
			//alert(xhr.status);
		}
	});
}

function getInstitutesForMandal(stateId,districtId,mandalId){
	$.ajax({
		type : "POST",
		url : "ajaxActions.do?mode=getInstitutionsList" ,
		cache : false,
		dataType : "html",
		data : {
			instState : stateId,
			instDist : districtId ,
		  	instMandal : mandalId,
		  	courseLevel : 0,
		  	random : Math.random()
		},
		success : function(response) 
		{			
			var info = response.split("#");			
			instituteArray=[];
			for(var k=0;k<info.length;k++){
				var instututeId=info[k].split('@')[0];
				var instituteObj={};
		    	instituteObj.stateId=stateId;
		    	instituteObj.districtId=districtId;
		    	instituteObj.mandalId=mandalId;
		    	instituteObj.instututeId=parseInt(instututeId);
		    	instituteObj.mandalName=info[k].split('@')[1];
		    	instituteArray.push(instituteObj);
		    }					
		},
		error : function(xhr, ajaxOptions, thrownError) {
			alert(xhr.status + " --> Error Ocucured while loading course info");
		}
	});
}
