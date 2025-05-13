import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "./common/api";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    // Dummy login validation

    let url = `https://mlha-e9f4fydheqbweudd.centralus-01.azurewebsites.net/api/Account/Authenticate?username=${username}&password=${password}`;
    const response: any = await axios.get(url);
    let user = response.data.username;
    console.log(response);

    if (user === "admin") {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("role", "admin");
      localStorage.setItem("token", response.data.token);
      console.log("role is ", localStorage.getItem("role"));
      navigate("/tourist");
    } else if (user === "user") {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("role", "user");
      localStorage.setItem("token", response.data.token);
      console.log("role is ", localStorage.getItem("role"));
      navigate("/tourist");
    }
    // Real validation:
    // const loginResponse: any = await login(username, password);
    // if (username !== "null") {
    //   console.log("username is : ", loginResponse);
    //   localStorage.setItem("isLoggedIn", "true");
    //   console.log("role is ", localStorage.getItem("role"));
    //   navigate("/tourist");
    // }
    else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-2 border rounded"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
