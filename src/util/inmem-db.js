const { userDelete } = require("../controllers/user.controllers")

const _userdb = []
const timeout = 500
let id = 0

module.exports = {

   // @param {*} user
   // @param{*} callback

   createUser(user, callback){
    console.log('creatreuser called')
    setTimeout(()=> {
        if(
            user &&
            user.firstName &&
            _userdb.filter((item)=> item.firstName === user.firstName).length > 0
        ){
            const error = 'A user with this name already exists.'
            console.log(error)
            callback(eroor, undefined)
        }else{
            const userToAdd = {
                id: id++,
                ...user,
            }
        }
    })
   }
} 