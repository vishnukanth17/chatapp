import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from "../utils/APIRoutes";
import multiavatar from "@multiavatar/multiavatar/esm";

export default function SetAvatar() {
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    const user = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
    if (!user) navigate("/login");
  }, [navigate]);

  const generateRandomName = () => Math.random().toString(36).substring(2, 10);

  useEffect(() => {
    const generateAvatars = () => {
      const data = [];
      for (let i = 0; i < 4; i++) {
        const randomName = generateRandomName();
        const svgCode = multiavatar(randomName);
        const encoded = btoa(unescape(encodeURIComponent(svgCode)));
        data.push(encoded);
      }
      setAvatars(data);
      setIsLoading(false);
    };

    generateAvatars();
  }, []);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
      return;
    }

    const user = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );

    const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
      image: avatars[selectedAvatar],
    });

    if (data.isSet) {
      user.isAvatarImageSet = true;
      user.avatarImage = data.image;
      localStorage.setItem(
        process.env.REACT_APP_LOCALHOST_KEY,
        JSON.stringify(user)
      );
      navigate("/");
    } else {
      toast.error("Error setting avatar. Please try again.", toastOptions);
    }
  };

  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className={`avatar ${
                  selectedAvatar === index ? "selected" : ""
                }`}
                onClick={() => setSelectedAvatar(index)}
              >
                <img
                  src={`data:image/svg+xml;base64,${avatar}`}
                  alt={`avatar-${index}`}
                />
              </div>
            ))}
          </div>
          <button onClick={setProfilePicture} className="submit-btn">
            Set as Profile Picture
          </button>
          <ToastContainer />
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }

  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;

      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }

      &:hover {
        cursor: pointer;
        transform: scale(1.1);
      }
    }

    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }

  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;

    &:hover {
      background-color: #3c0edc;
    }
  }
`;

// const Container = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   flex-direction: column;
//   gap: 3rem;
//   background: linear-gradient(135deg, #a8dadc, #f1faee); /* pastel gradient */
//   height: 100vh;
//   width: 100vw;
//   text-align: center;

//   .loader {
//     max-inline-size: 100%;
//   }

//   .title-container {
//     h1 {
//       color: #1d3557; /* dark navy */
//       font-size: 2rem;
//       span {
//         color: #ff9f68; /* orange accent */
//       }
//     }
//   }

//   .avatars {
//     display: flex;
//     gap: 2rem;
//     flex-wrap: wrap;
//     justify-content: center;

//     .avatar {
//       border: 0.3rem solid transparent;
//       padding: 0.5rem;
//       border-radius: 50%;
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       transition: all 0.3s ease-in-out;
//       background: #f8f9fa;
//       box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);

//       img {
//         height: 6rem;
//         transition: transform 0.3s ease;
//       }

//       &:hover {
//         cursor: pointer;
//         transform: scale(1.1);
//         box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.15);
//       }
//     }

//     .selected {
//       border: 0.3rem solid #ff9f68; /* pastel orange border when selected */
//       box-shadow: 0px 0px 15px rgba(255, 159, 104, 0.6);
//     }
//   }

//   .submit-btn {
//     background-color: #ff9f68;
//     color: #fff;
//     padding: 1rem 2rem;
//     border: none;
//     font-weight: bold;
//     cursor: pointer;
//     border-radius: 0.6rem;
//     font-size: 1rem;
//     text-transform: uppercase;
//     letter-spacing: 1px;
//     transition: background-color 0.3s ease, transform 0.2s ease;

//     &:hover {
//       background-color: #ff7b54; /* darker orange */
//       transform: scale(1.05);
//     }
//   }
// `;
