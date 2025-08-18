import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";

export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", password: "" });
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, []);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { username, password } = values;
    if (username === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    } else if (password === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });
      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );

        navigate("/");
      }
    }
  };

  return (
    <>
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>ConvoCraft</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
            min="3"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Log In</button>
          <span>
            Don't have an account ? <Link to="/register">Create One.</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background: linear-gradient(135deg, #e0f7fa, #b2ebf2, #b3e5fc);

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;

    img {
      height: 5rem;
    }

    h1 {
      background: linear-gradient(90deg, #ffb347, #ffcc33, #ffd180);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 2.3rem;
      font-weight: 700;
      letter-spacing: 1.5px;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border-radius: 1.2rem;
    padding: 2.5rem 3.5rem;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    animation: fadeIn 1s ease-in-out;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }
  }

  input {
    background: #ffffffcc;
    border: 1px solid #d0d0d0;
    border-radius: 0.8rem;
    color: #333;
    padding: 0.8rem 1rem;
    font-size: 1rem;
    transition: all 0.4s ease;

    &:focus {
      border: 1px solid #ffb347;
      background: #fff;
      box-shadow: 0 0 10px rgba(255, 179, 71, 0.3);
      outline: none;
      transform: scale(1.02);
    }
  }

  button {
    background: linear-gradient(90deg, #81d4fa, #4fc3f7, #29b6f6);
    color: #fff;
    padding: 0.9rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.8rem;
    font-size: 1rem;
    transition: all 0.4s ease;

    &:hover {
      transform: scale(1.07);
      background: linear-gradient(90deg, #ffb347, #ffcc33, #ff8a65);
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
    }

    &:active {
      transform: scale(0.97);
    }
  }

  span {
    color: #444;
    text-transform: uppercase;
    a {
      color: #ff8a65;
      text-decoration: none;
      font-weight: bold;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(15px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;


