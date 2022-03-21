//import express
const express=require('express');
//create an app using express
const app=express();
// to import cors(cors for integrating frontend and back end)
const cors=require('cors')

// to use cors

app.use (cors({
    origin:'http://localhost:4200'
}))

//set port for server
app.listen(3000,()=>{
     console.log("the server started at port no:3000");})
//resolve http req:get
// app.get('/',(req,res)=>{
//     res.send("GET METHOD")
// })
// //post
// app.post('/',(req,res)=>{
//     res.send("POST METHOD;")
//  })
// //put
// app.put('/',(req,res)=>{
//     res.send("PUT METHOD;")
// })
// //patch
// app.patch('/',(req,res)=>{
//     res.send("PATCH METHOD;")
// })
// //DELETE
// app.delete('/',(req,res)=>{
//     res.send("DELETE METHOD;")
// })

//bank app server side
//import dataservice
const dataService=require('./services/data.service');
//to parse JSON
app.use(express.json());
//to get jwttoken here
const jwt=require('jsonwebtoken');


//create a router specific middlewware
const jwtMiddleware=(req,res,next)=>{
    try{
        const token=req.headers["x-access-token"];
        const data=jwt.verify(token,'supersecretkey123456');
        req.currentAcc=data.currentAcc;
        
        
        next();
    }
    catch{
        res.status(422).json({
            statusCode: 422,
            status: false,
            message: "Pls Login!!"
        })
    }
}


// application specific middleware
const logMiddleware=(req,res,next)=>{
    console.log("logMiddleware");
    next();
}
//to use middleware
app.use(logMiddleware);
//register API-->post metod to create data

//aynchronouse due to connection with mongoose
app.post('/register',(req,res)=>{console.log(req.body.acno);
    dataService.register(req.body.acno,req.body.uname,req.body.password).then(result=>{
    res.status(result.statusCode).json(result)
        
    })
})
//before mongoose
/*app.post('/register',(req,res)=>{console.log(req.body.acno);
   const result=dataService.register(req.body.acno,req.body.uname,req.body.password)
   res.status(result.statusCode).json(result)*/
//    if(result)
//    {
//        res.send("registered successfully")
//    }
//    else{
//        res.send("user already exists")
//   }
//})


//login
app.post('/login',(req,res)=>{
    dataService.login(req.body.acno,req.body.password).then(result=>{
        res.status(result.statusCode).json(result);
    })
})

//before mongoose
// app.post('/login',(req,res)=>{
//     const result=dataService.login(req.body.acno,req.body.password);
//     res.status(result.statusCode).json(result);
// })


//deposit

app.post('/deposit',jwtMiddleware,(req,res)=>{
    dataService.deposit(req.body.acno,req.body.password,req.body.amt,req).then(result=>{
        res.status(result.statusCode).json(result);
    
    }

    )
  
})
//before mongoose
// app.post('/deposit',jwtMiddleware,(req,res)=>{
//     const result=dataService.deposit(req.body.acno,req.body.password,req.body.amt);
//     res.status(result.statusCode).json(result);
//     console.log(dataService.database[req.body.acno].transaction);
// })
//withdarw
app.post('/withdraw',jwtMiddleware,(req,res)=>{
        dataService.withdraw(req.body.acno,req.body.password,req.body.amt,req).then(result=>{
            res.status(result.statusCode).json(result);
         
        })
       
    })

//before mongoose

//     app.post('/withdraw',jwtMiddleware,(req,res)=>{
//     const result=dataService.withdraw(req.body.acno,req.body.password,req.body.amt,req.currentAcc);
//     res.status(result.statusCode).json(result);
//     console.log(dataService.database[req.body.acno].transaction);
// })

//transaction 
app.post('/transaction',(req,res)=>{
    dataService.getTransaction(req.body.acno).then(result=>{
        res.status(result.statusCode).json(result);
    });
    
    
})


//befor mongoose
// app.post('/transaction',(req,res)=>{
//     const result=dataService.getTransaction(req.body.acno);
//     res.status(result.statusCode).json(result);
//     console.log(dataService.database[req.body.acno].transaction);
// })


//....delete account API
app.delete('/deleteAcc/:acno',(req,res)=>{
    dataService.deleteAcc(req.params.acno).then(result=>{
        res.status(result.statusCode).json(result)
    })
})

