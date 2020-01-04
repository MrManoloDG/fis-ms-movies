const fetch = require("node-fetch");

const isAuth = function(req,res, next){
    let token = req.headers['authorization'];

    fetch("https://fis-backend-login.herokuapp.com/api/v1/checkToken",{
        method: 'GET',
        headers:{
            'Content-Type': 'application/json',
            'authorization': token
        }
    }).then(response => {
        if(response.status === 200){
            next()
        }else {
            res.sendStatus(403)
        }
    })
}

module.exports =  isAuth;