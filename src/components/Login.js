import React, {useState } from 'react'
import {  useNavigate } from 'react-router-dom';



const Login = (props) => {

    const [credentials,setCredentials] = useState({email:"",password:""})
    let navigate = useNavigate();


    const handleSubmit =async (e)=>{
        e.preventDefault();//we use this so that the page dosent relaod
        const response = await fetch(`http://127.0.0.1:5000/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",      
            },
            body: JSON.stringify({email:credentials.email,password:credentials.password}), 

          });
          const json =await response.json()
          console.log(json)
          if(json.success){
            //redirect and save the auth token
            localStorage.setItem("token",json.Authtoken) //might error
                props.showAlert("Logged in successfullly","success")
            navigate("/")

          }
          else{
            props.showAlert("Invalid credentials","danger")
        }

    }

    const onChange = (e) => {
        setCredentials({ ...credentials , [e.target.name]: e.target.value })
    }
    return (
        <div>
        <h2>Login to continue to CloudMemo</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name='email' aria-describedby="emailHelp" onChange={onChange} value={credentials.email} />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" name='password' id="password" onChange={onChange} value={credentials.password} />
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}
export default  Login;