const fetch = require("node-fetch");

class AuthService{
    static authenticate(req,res){
        let body = {
            'login': req.body.login,
            'password': req.body.password
        };
        fetch("https://fis-backend-login.herokuapp.com/api/v1/authenticate",{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then(response => {
            return response.json();
        }).then(r =>{
            res.status(200).send(r.token);
        });
    }

    static isAuth(req,res, next){
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
}




module.exports =  AuthService;