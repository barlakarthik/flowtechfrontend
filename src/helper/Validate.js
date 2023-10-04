import Toast from "react-hot-toast";
import {authenticate} from '../helper/helper'
//validate login page username
export async function usernameValidate (values){
    const error = validateUsername({}, values)
    // if(values.username){
    //     //check user exist or not
    //     const {status} = await authenticate(values.username)
    //     if(status !== 200){
    //         error.exist = Toast.error('usert doesnot exist')
    //     }
    // }
    return error
}
//validate login page password
export async function passwordValidate(values){
    const error = validatePassword({}, values)
    return error 
}
//validate reset password
export async function resetPasswordValidation(values){
     const error = validatePassword({}, values);
     if(values.password !== values.confirm_pwd){
        error.exist = Toast.error("passwords not matched...!")
     }
     return error
}
//validate register form
export async function registerValidation(values){
    let errors = validateUsername({},values);
    validatePassword(errors={}, values);
    emailValidate(errors={},values)
    return errors
}
//profile validate
export async function profileValidation(values){
   const errors = emailValidate({}, values)
   if(values.email){
    //check email exist or not
    const {status} = await authenticate(values.email)
    if(status !== 200){
        errors.exist = Toast.error('email does not exist')
    }
   }
   return errors;
}
//validate username
const validateUsername = (error={}, values)=>{
     if(!values.username){
        error.username = Toast.error('Username required...!')
     }else if(values.username.includes(" ")){
        error.username = Toast.error('Invalid username...!')
     }
     return error
}
//validate password
const validatePassword = (error={}, values)=>{
    if(!values.password){
        error.password = Toast.error('Password required...!')
    }else if(values.password.includes(" ")){
         error.password = Toast.error("wrong password")
    }else if(values.password.length<8){
        error.password = Toast.error("Password must be morethan 8 characters")
    }
    return error
}
//validate email
function emailValidate(error={},values){
    if(!values.email){
        error.email = Toast.error('email required...!')
    }else if(values.email.includes(" ")){
        error.email = Toast.error("Wrong email")
    }else if(!/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/gm.test(values.email)){
       error.email = Toast.error("email validation not good...!")
    }
    return error
}