//To get list of all State Ids and their Names in the console use this script


//get names of all states in an array
var statesArray =[],districtArray=[],mandalArray=[],studyLevelArray=[],instituteArray=[],institutes=[];
var getDistrictType = 17,getMandalType=30;

//**********saving states data in database************

$("#studyStateId option").each(function()
{
    var state={};
    state.id=$(this).val();
    state.name=$(this).text();
    statesArray.push(state)          
});
//for removing select option
statesArray.splice(0,1);

function saveStateDataInDatabase(statesArray){
 	$.ajax({
		type : "POST",
		url : "http://localhost:4004/saveData",
		dataType : 'json',
		data : 
		{
			type : 'state',
			data : statesArray
		},
		success : function(response) 
		{				
			console.log('states array saved')
		},
		error : function(xhr, ajaxOptions, thrownError) {
			alert(xhr.status);
		}
	});
 }

 saveStateDataInDatabase(statesArray);

 //*******Saving Study Levels in Database*******

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

 function saveStudyLevelsInDatabase(studyLevelArray){
 	$.ajax({
		type : "POST",
		url : "http://localhost:4004/saveData",
		dataType : 'json',
		data : 
		{
			type : 'studyLevel',
			data : studyLevelArray
		},
		success : function(response) 
		{
			console.log('study Level array saved')
		},
		error : function(xhr, ajaxOptions, thrownError) {
			alert(xhr.status);
		}
	});
 }

 saveStudyLevelsInDatabase(studyLevelArray);

//**********getting districts data and then saving it in database**********

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
			districtArrayTemp=[];
		    for(var j=0;j<info.length;j++){
				(function(j) {
					var districtObj={};
					districtObj.stateId=stateId;
			    	districtObj.districtId=info[j].split('@')[0];
			    	districtObj.districtName=info[j].split('@')[1];			    	
			    	districtArrayTemp.push(districtObj);
			    	districtArray.push(districtObj)
			     })(j);
		    }
		    saveDistrictDataInDatabase(districtArray);
		},
		error : function(xhr, ajaxOptions, thrownError) {
			alert(xhr.status);
		}
	});    
}

function saveDistrictDataInDatabase(districtArray){ 	
 	$.ajax({
		type : "POST",
		url : "http://localhost:4004/saveData",
		dataType : 'json',
		data : 
		{
			type : 'district',
			data : districtArray
		},
		success : function(response) 
		{
			console.log(response)			
		},
		error : function(xhr, ajaxOptions, thrownError) {
			//alert(xhr.status);
		}
	});
 }

for(var i=0;i<statesArray.length;i++){	
	(function(i) {
		getDistrictsForState(statesArray[i].id);
     })(i);
}

//get mandals from saved states and district data 
function getSavedDistrictsFromDatabase(){
	$.ajax({
		type : "GET",
		url : "http://localhost:4004/getDistricts",
		dataType : 'json',		
		success : function(response) 
		{
			districtArray=response;			
		},
		error : function(xhr, ajaxOptions, thrownError) {
			//alert(xhr.status);
		}
	});
}

getSavedDistrictsFromDatabase();

function saveMandaDataInDatabase(mandalsArray){ 	
 	$.ajax({
		type : "POST",
		url : "http://localhost:4004/saveData",
		dataType : 'json',
		data : 
		{
			type : 'mandal',
			data : mandalsArray
		},
		success : function(response) 
		{
			console.log(response)
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
			mandalArrayTemp=[];			
		    for(var k=0;k<infoMandal.length;k++){							    	
		    	var mandalObj={};		    	
		    	mandalObj.district_id=districtId;
		    	mandalObj.mandal_id=parseInt(infoMandal[k].split('@')[0]);
		    	mandalObj.mandal_name=infoMandal[k].split('@')[1];		    	
		    	mandalArrayTemp.push(mandalObj);
		    	saveMandaDataInDatabase(mandalArrayTemp);
		    	mandalArray.push(mandalObj);
		    }
		},
		error : function(xhr, ajaxOptions, thrownError) {
			//alert(xhr.status);
		}
	});
}

for(var i=0;i<districtArray.length;i++){	
	(function(i) {
		getMandalsForDistrict(districtArray[i].state_id,districtArray[i].district_id);
     })(i);
}

//*************get institutes from mandal information taken from database **********


function getSavedMandalsFromDatabase(){
	$.ajax({
		type : "GET",
		url : "http://localhost:4004/getMandals",
		dataType : 'json',		
		success : function(response) 
		{
			mandalArray=response;			
		},
		error : function(xhr, ajaxOptions, thrownError) {
			alert(xhr.status);
		}
	});
}

getSavedMandalsFromDatabase();

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

for(var i=0;i<1000;i++){	
	(function(i) {
		getInstitutesForMandal(mandalArray[i].state_id,mandalArray[i].district_id,mandalArray[i].mandal_id);
     })(i);
}

//save institutes in database

var index=0;
saveInstitutesInDatabase();
function saveInstitutesInDatabase(){
	(function(i) {
		$.ajax({
			type : "POST",
			url : "http://localhost:4004/saveInstitutes" ,
			cache : false,
			dataType : "html",
			data : {				
			  	data : instituteArray[index]
			},
			success : function(response) 
			{			
				console.log(response);
				if(index < instituteArray.length){
					index++;
					saveInstitutesInDatabase();
				}				
			},
			error : function(xhr, ajaxOptions, thrownError) {
				alert(xhr.status + " --> Error Ocucured while loading course info");
			}
		});
	 })(i);
}
