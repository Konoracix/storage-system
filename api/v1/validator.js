function validateRackData(body){
	let validationInfo = {
		message: `Wrong data has been entered!`,
		validationStatus: false
	};
	if(typeof(body.name) == typeof("") && typeof(body.shelves) == typeof(123) && typeof(body.places) == typeof(123)){
		validationInfo.message = "Evrything is good!"
		validationInfo.validationStatus = true;
	}
	return validationInfo;
}



module.exports = { 
	validateRackData,
};