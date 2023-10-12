import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;
//authenticate user
const authenticate = async (email) => {
  try {
    return await axios.post("/api/authenticate", { email });
  } catch (error) {
    return { error: "email not in use" };
  }
};
//get user
const getUser = async ({ email }) => {
  try {
    const { data } = await axios.get(`/api/email/${email}`);
    return data 
  } catch (error) {
    return { error: "password does'not match" };
  }
};
//getall users
const getAllUsers = async () => {
  try {
    const { data } = await axios.get(`/api/getusers`);
    return data 
  } catch (error) {
    return { error: "password does'not match" };
  }
};
//delete user
const deleteUser = async(id)=>{
try{
  await axios.delete(`/api/deleteuser/${id}`)
}catch(error){
  return {error:"unable to delete"}
}
}
//register user
const registerUser = async (credentials) => {
  try {
    const {
      data: { msg },
      status,
    } = await axios.post(`/api/register`, credentials);
    let { username,lastname, email, profile, organization, mobile, address } = credentials;
    //send mail
    if (status === 201) {
      await axios.post(`/api/registerMail`, {
        username,
        userEmail: email,
        text: msg,
      });
    }
    return Promise.resolve(msg);
  } catch (error) {
    return { error: "can't register user" };
  }
};
//login user
const verifyPassword = async ({ email, password }) => {
  try {
    if (email) {
      const { data } = await axios.post("/api/login", { email, password });
      return Promise.resolve(data)
    }
  } catch (error) {
    Promise.reject({ error: "passwords not matched...!" });
  }
};
//update user
const updateUser = async (response) => {
  try {
    const token = localStorage.getItem("token");
    const {config} = await axios.put(`/api/updateuser`,response, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return config.data
  } catch (error) {
    Promise.reject({ error: "could'nt update profile" });
  }
};
//generateOTP
const generateOTP = async (username) => {
  try {
    const {
      data: { code },
      status,
    } = await axios.get("/api/generateOTP", { params: { username } });
    //send OTP to mail
    if (status === 201) {
      let {
        data: { email },
      } = await getUser({ username });
      let text = `your password recovery OTP is ${code}. veridy and recover your password.`;
      await axios.post("/api/registerMail", {
        username,
        userEmail: email,
        text,
        subject: "password recovery OTP",
      });
    }
    return Promise.resolve(code);
  } catch (error) {
    return Promise.reject({ error });
  }
};
//verifyOTP
const verifyOTP = async ({ username, code }) => {
  try {
    const { data, status } = await axios.get("/api/verifyOTP", {
      params: { username, code },
    });
    return { data, status };
  } catch (error) {
    return Promise.reject(error);
  }
};
//reset password
const resetPassword = async({username, password})=>{
   try{
   const {data, status} =  await axios.put('/api/resetpassword',{username, password});
   return Promise.resolve({data, status});
   }catch(error){
     return Promise.reject(error)
   }
}
export {authenticate, getUser, verifyOTP, generateOTP, resetPassword, updateUser, verifyPassword, registerUser, getAllUsers, deleteUser}
