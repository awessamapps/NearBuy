module.exports.rejectAuth = (res, msg)=>{

    res.status(403);
    res.json(simpleResponse(false, msg, {}));
}


module.exports.invalidData = (res, msg)=>{

    if (msg===undefined){
        msg = "Invalid data format";
    }
    res.status(400);
    res.json( simpleResponse(false, msg, {}) );
}

module.exports.simpleSuccess = (res,msg, data)=>{

    if (msg === undefined){
        msg = "Success";
    }

    res.status(200);
    res.json(simpleResponse(true, msg, data=== undefined? {} : data ));
    
}

module.exports.simpleFail = (res,msg, data)=>{

    if (msg === undefined){
        msg = "Success";
    }
    res.status(500);
    res.json(simpleResponse(false, msg, data=== undefined? {} : data));
    
}


module.exports.simpleBadRequest = (res, msg, data)=>{

    if (msg === undefined){
        msg = "Failed";
    }

    res.status(400);
    res.json(simpleResponse(false, msg, data=== undefined? {} : data));
    
}


module.exports.notAdmin = (res, msg, data)=>{
   
   module.exports.simpleBadRequest(res, msg , data);
}

module.exports.doesNotExist = (res, msg, data)=>{
    if (msg === undefined){
        msg = "Route does not exist";
    }

    res.status(400);
    res.json(simpleResponse(false, msg, data=== undefined? {} : data));
}

function simpleResponse(success, message, data){

    return {
        success: success,
        message : message,
        data : data
    }
}