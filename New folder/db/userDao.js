
const validSellerTokens = [];
const validBuyerTokens = [];

for (let i=0; i<100 ; i++){

    validSellerTokens.push({token: `seller-token${i}`, sellerId : `seller${i}` });
    validSellerTokens.push({token: `buyer-token${i}`, sellerId : `buyer${i}` });
}


module.exports.verifyAdmin = (username,password)=>{
    return new Promise ((resolve, reject)=>{
        (username == "theadmin" && password == "thepassword") ? resolve() : reject({msg : "You are not authorized"});
    })
}

module.exports.verifySellerLoggedIn = (sellerId, token)=>{

    return new Promise(  (resolve,rejecct) =>{

                for (let i=0; i<100 ; i++){

                    let data = validSellerTokens[i];

                    if (data.token===token && data.sellerId === sellerId){
                        resolve();
                        return;
                    }

                }

              reject();
        
    });
}