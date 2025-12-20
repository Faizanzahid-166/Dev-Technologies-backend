import { useState } from "react";
import { registerUser } from "../api/urls.js"; // path to API file
import {Link, useNavigate} from 'react-router'

export default function Signup() {
  const [form, setForm] = useState({ fullname: "", email: "", username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // ✅ navigation hook

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await registerUser(form);
      setMessage("Signup successful!");
      console.log(res.data);
      // ✅ redirect after short delay
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div class="flex flex-col items-center justify-center mt-15 ">
    <div class="w-full max-w-md bg-[#e4e2e2] rounded-xl shadow-md py-2 px-8 ">
	
		<h1 class="text-blue-700 text-[28px] text-center mt-3 font-bold py-6" >Sign Up</h1>

    <Link to='/login' className="m-2 hover:text-green-500"><p>Already have an account? Log in</p></Link>

    <form onSubmit={handleSubmit} className="grid gap-10 self-center">

      <input name="fullname" placeholder="Full Name" onChange={handleChange}
             className="w-full bg-gray-700 text-white border-0 rounded-md p-2 focus:bg-gray-600 focus:outline-none 
			              transition ease-in-out duration-150 placeholder-gray-300 " />

      <input name="username" placeholder="Username" onChange={handleChange} 
              className="w-full bg-gray-700 text-white border-0 rounded-md p-2 focus:bg-gray-600 focus:outline-none 
			              transition ease-in-out duration-150 placeholder-gray-300 "/>

      <input name="email" placeholder="Email" onChange={handleChange} 
              className="w-full bg-gray-700 text-white border-0 rounded-md p-2 focus:bg-gray-600 focus:outline-none 
			              transition ease-in-out duration-150 placeholder-gray-300 "/>

      <input type="password" name="password" placeholder="Password" onChange={handleChange} 
              className="w-full bg-gray-700 text-white border-0 rounded-md p-2 focus:bg-gray-600 focus:outline-none 
			              transition ease-in-out duration-150 placeholder-gray-300 "/>

      <button type="submit" className=" bg-cyan-500 w-1/2 text-white border-0 rounded-md p-2 focus:bg-blue-600 focus:outline-none transition ease-in-out duration-150 ml-22 flex justify-center mx-auto">Register</button>
      <p className="text-red-600">{message}</p>
    </form>
  </div>
  </div>
  );
}
