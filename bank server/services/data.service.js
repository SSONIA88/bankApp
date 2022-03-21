//for json webtoken
const jwt = require('jsonwebtoken')

//to import db.js
const db = require('./db')


// database = {
//   1000: { acno: 1000, uname: "Manik", password: "123", balance: 5000, transaction: [] },
//   2000: { acno: 2000, uname: "Nandini", password: "456", balance: 5000, transaction: [] },
//   3000: { acno: 3000, uname: "Kabir", password: "789", balance: 5000, transaction: [] }
// }

//register definition -->copy from angular and change to arrow function
//copied from original code

const register = (acno, uname, password) => {
  return db.User.findOne({ acno })
    .then(user => {
      console.log(user)
      if (user) {
        return {

          statusCode: 422,
          status: false,
          message: "User already exists..Please login!!"
        }
      }
      else {
        const newUser = new db.User({
          acno,
          uname,
          password,
          balance: 0,
          transaction: []
        })
        newUser.save();
        {
          return {
            statusCode: 200,
            status: true,
            message: "Successfully registered!!"
          }
        }
      }

    })
}

//ORIGINAL CODE
// const register = (acno, uname, password) => {
//   let db = database;
//   if (acno in db) {
//     return {

//       statusCode: 422,
//       status: false,
//       message: "User already exists..Please login!!"

//     }
//   }
//   else {
//     db[acno] = {
//       acno, uname, password, balance: 0, transaction: []
//     }
//     console.log(db);

//     return {
//       statusCode: 200,
//       status: true,
//       message: "Successfully registered!!"
//     }

//   }
// }


//login
//copied from original code
const login = (acno, password) => {
  return db.User.findOne({
    acno,
    password
  })
    .then(user => {
      if (user) {
        currentUname = user.uname
        currentAcno = acno;

        //CREATE TOKEN
        token = jwt.sign({
          currentAcc: acno  //payload
        }, 'supersecretkey123456')
        return {
          statusCode: 200,
          status: true,
          message: "Successfully logged in!!",
          currentUname,
          currentAcno,
          token

        }
      }
      else {

        return {
          statusCode: 422,
          status: false,
          message: "Invalid credentials!!"
        }
      }
    })
}

//ORIGINAL CODE
// const login = (acno, password) => {

//   let db = database;
//   if (acno in db) {
//     if (password == db[acno]["password"]) {
//       currentUname = db[acno]["uname"]
//       currentAcno = acno;
//       token = jwt.sign({
//         currentAcc: acno
//       }, 'supersecretkey123456')


//       return {
//         statusCode: 200,
//         status: true,
//         message: "Successfully logged in!!",
//         currentUname,
//         currentAcno,
//         token

//       }
//     }
//     else {

//       return {
//         statusCode: 422,
//         status: false,
//         message: "Invalid password!!"
//       }
//     }
//   }

//   else {
//     //alert("invalid account number")
//     return {
//       statusCode: 422,
//       status: false,
//       message: "Invalid Acc number!!"
//     }
//   }
// }



//deposit




const deposit = (acno, password, amt) => {
  return db.User.findOne({
    acno,
    password
  }).then(user => {

    if (user) {
      console.log(user);
      // to convert string to integer
      var amount = parseInt(amt);
      user["balance"] += amount;
      user["transaction"].push({ amount: amount, type: "credit" })
      user.save();

      return {
        statusCode: 200,
        status: true,
        message: "amount deposited successfully.. new balance is" + user['balance']

      }
    }

    else {
      return {
        statusCode: 422,
        status: false,
        message: "Invalid Credentials!!"
      }
    }
  })
}







//OROGINAL CODE
// const deposit = (acno, password, amt) => {
//   let db = database
//   // to convert string to integer
//   var amount = parseInt(amt);
//   if (acno in db) {
//     if (password == db[acno]["password"]) {
//       db[acno]["balance"] += amount;
//       db[acno].transaction.push({ amount: amount, type: "credit" })

//       return {
//         statusCode: 200,
//         status: true,
//         message: "amount deposited successfully.. new balance is" + db[acno]['balance'] 

//       }
//     }
//     else {
//       // alert("invalid password")
//       return {
//         statusCode: 422,
//         status: false,
//         message: "Invalid password!!"

//       }
//     }

//   }
//   else {
//     // alert("invalid acc number")
//     return {
//       statusCode: 422,
//       status: false,
//       message: "Invalid Acc number!!"
//     }
//   }
// }

//withdraw

const withdraw = (acno, password, amt, req) => {
  currentAcc = req.currentAcc
  return db.User.findOne({
    acno,
    password
  }).then(user => {
    if (currentAcc != acno) {
      return {
        statusCode: 422,
        status: false,
        message: "Operation denied!!"
      }
    }
    if (user) {
      var amount = parseInt(amt);
      if (user["balance"] > amount) {
        user["balance"] -= amount;
        user.transaction.push({ amount: amount, type: "debit" })
        user.save();

        return {
          statusCode: 200,
          status: true,
          message: amount + " withdrawn successfully.. new balance is" + user['balance']
        }
      }
      else {
        //alert("insufficient balance")
        return {
          statusCode: 422,
          status: false,
          message: "insufficient balance"
        }
      }
    }
    else {

      return {
        statusCode: 422,
        status: false,
        message: "Invalid credentials!!"
      }
    }

  }
  )


}


//original code
// const withdraw = (acno, password, amt,currentAcc) => {
//   let db = database
//   // to convert string to integer
//   var amount = parseInt(amt);
//  //let currentAcc=req.currentAcc;
//  console.log(currentAcc);


//   if (acno in db) {
//     if (password == db[acno]["password"]) {
//       

//       if (db[acno]["balance"] > amount) {
//         db[acno]["balance"] -= amount;
//         db[acno].transaction.push({ amount: amount, type: "debit" })

//         return {
//           statusCode: 200,
//           status: true,
//           message: amount + " withdrawn successfully.. new balance is" + db[acno]['balance']
//         }
//       }


//       else {
//         //alert("insufficient balance")
//         return {
//           statusCode: 422,
//           status: false,
//           message: "insufficient balance"
//         }
//       }
//     }
//     else {

//       return {
//         statusCode: 422,
//         status: false,
//         message: "Invalid password!!"
//       }
//     }

//   }
//   else {
//     //alert("invalid acc number")
//     return {
//       statusCode: 422,
//       status: false,
//       message: "Invalid Acc number!!"
//     }
//   }
// }

//transaction history

const getTransaction = (acno) => {
  return db.User.findOne({ acno }).then(user => {
    console.log(user)
    if (user) {
      return {

        statusCode: 200,
        status: true,
        transaction: user.transaction
      }
    }
    else {
      return {
        statusCode: 422,
        status: false,
        message: "Invalid acc number!!"
      }

    }

  })
}
//original code
// const getTransaction = (acno) => {
//   if (acno in database) {
//     return {
//      statusCode:200,
//        status:true,
//         transaction: database[acno].transaction
//   }

//   }
//   else {
//     return {
//       statusCode: 422,
//       status: false,
//       message: "Invalid acc number!!"
//     }

//  }

// }

//....deleting an account.....
const deleteAcc=(acno)=>{
  return db.User.deleteOne({
    acno
  }).then(user=>{
    if(user){
      return{
        statusCode: 200,
                status: true,
                  message: "Account deleted successfully!!"

      }
    }
    else{
      return{
        statusCode: 422,
                  status: false,
                  message: "Invalid credentials!!!"
      }
    }
  })
}



module.exports = {
  //database, 
  register, login, deposit, withdraw, getTransaction,deleteAcc
}
