import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";
export default function Welcome() {
  const [userName, setUserName] = useState("");
  useEffect(async () => {
    setUserName(
      await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      ).username
    );
  }, []);
  return (
    <Container>
      <img src={Robot} alt="" />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
    </Container>
  );
}

// const Container = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   color: white;
//   flex-direction: column;
//   img {
//     height: 20rem;
//   }
//   span {
//     color: #4e0eff;
//   }
// `;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: white;
  text-align: center;
  height: 100%;
  width: 100%;
    background: linear-gradient(135deg, #e3f2fd, #eeb456ff); /* light blue + light orange */

  img {
    height: 18rem;
    margin-bottom: 2rem;
    filter: drop-shadow(0 0 20px rgba(78, 14, 255, 0.6));
  }

  h1 {
    font-size: 2.2rem;
    font-weight: bold;
    margin-bottom: 1rem;
    span {
      color: #4e0eff;
      text-shadow: 0 0 8px rgba(78, 14, 255, 0.8);
    }
  }

  h3 {
    font-size: 1.2rem;
    font-weight: 400;
    color: background: linear-gradient(90deg, #81d4fa, #4fc3f7, #29b6f6);;
    opacity: 0.9;
  }

  @media screen and (max-width: 768px) {
    img {
      height: 12rem;
    }
    h1 {
      font-size: 1.6rem;
    }
    h3 {
      font-size: 1rem;
    }
  }
`;
