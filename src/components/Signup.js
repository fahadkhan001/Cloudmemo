import React, { useState } from 'react'
import {  useNavigate } from 'react-router-dom'
//import  Alert  from './Alert'


 const Signup = (props) => {
  const [credential, setCredential] = useState({name: "",email: "", password: "", Confirmpassword: ""})
  let navigate = useNavigate();
  
  
 const handleSubmit=async(e)=>{
  e.preventDefault();
  //destructring
  const {name,email,password}= credential;
  const response = await fetch("http://127.0.0.1:5000/api/auth/createuser",{
    method:"POST",
    headers:{
      'Content-Type':"application/json"
    },
    body:JSON.stringify({name,email,password})
  });
  const json = await response.json()
  console.log(json)
  if(json.success){
    localStorage.setItem('token',json.Authtoken)
    navigate("/")
    props.showAlert("Account created succesfully","success")
  }else{
    props.showAlert("Invalid credentials","danger")
  }
 }
 const onchange=(e)=>{
    setCredential({...credential, [e.target.name]:e.target.value})
 }

  return (
    <div>
    <h2>SignUp to continue CloudMemo</h2>
    <form onSubmit={handleSubmit}>
    <div className="mb-3">
      <label htmlFor="name" className="form-label">Name</label>
      <input type="text" className="form-control" id="name" name='name' onChange={onchange} aria-describedby="name"/>
    </div>
  <div className="mb-3">
    <label htmlFor="email" className="form-label">Email address</label>
    <input type="email" className="form-control" id="email" name='email' onChange={onchange} aria-describedby="emailHelp"/>
    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div className="mb-3">
    <label htmlFor="password" className="form-label">Password</label>
    <input type="password" className="form-control" id="password" name='password' onChange={onchange} minLength={5} required/>
  </div>
  <div className="mb-3">
    <label htmlFor="Confirmpassword" className="form-label">Confirm Password</label>
    <input type="password" className="form-control" id="Confirmpassword" name='Confirmpassword' onChange={onchange} minLength={5} required/>
  </div>
 
 
  <button type="submit" className="btn btn-primary">Submit</button>
</form>

    </div>
  )
}
export default Signup;