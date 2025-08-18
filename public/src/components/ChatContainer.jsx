import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(async () => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    const response = await axios.post(recieveMessageRoute, {
      from: data._id,
      to: currentChat._id,
    });
    setMessages(response.data);
  }, [currentChat]);

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
    });
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt=""
            />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
        <Logout />
      </div>
      <div className="chat-messages">
        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${
                  message.fromSelf ? "sended" : "recieved"
                }`}
              >
                <div className="content ">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

// const Container = styled.div`
//   display: grid;
//   grid-template-rows: 10% 80% 10%;
//   gap: 0.1rem;
//   overflow: hidden;
//   @media screen and (min-width: 720px) and (max-width: 1080px) {
//     grid-template-rows: 15% 70% 15%;
//   }
//   .chat-header {
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     padding: 0 2rem;
//     .user-details {
//       display: flex;
//       align-items: center;
//       gap: 1rem;
//       .avatar {
//         img {
//           height: 3rem;
//         }
//       }
//       .username {
//         h3 {
//           color: white;
//         }
//       }
//     }
//   }
//   .chat-messages {
//     padding: 1rem 2rem;
//     display: flex;
//     flex-direction: column;
//     gap: 1rem;
//     overflow: auto;
//     &::-webkit-scrollbar {
//       width: 0.2rem;
//       &-thumb {
//         background-color: #ffffff39;
//         width: 0.1rem;
//         border-radius: 1rem;
//       }
//     }
//     .message {
//       display: flex;
//       align-items: center;
//       .content {
//         max-width: 40%;
//         overflow-wrap: break-word;
//         padding: 1rem;
//         font-size: 1.1rem;
//         border-radius: 1rem;
//         color: #d1d1d1;
//         @media screen and (min-width: 720px) and (max-width: 1080px) {
//           max-width: 70%;
//         }
//       }
//     }
//     .sended {
//       justify-content: flex-end;
//       .content {
//         background-color: #4f04ff21;
//       }
//     }
//     .recieved {
//       justify-content: flex-start;
//       .content {
//         background-color: #9900ff20;
//       }
//     }
//   }
// `;

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.2rem;
  overflow: hidden;
  background: linear-gradient(135deg, #e3f2fd, #fff3e0); /* light blue + light orange */

  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    background: rgba(255, 183, 77, 0.25); /* pastel orange shade */
    border-bottom: 2px solid #90caf9; /* light blue border */
    border-radius: 0 0 1rem 1rem;

    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;

      .avatar {
        img {
          height: 3rem;
          border-radius: 50%;
          border: 2px solid #64b5f6;
        }
      }

      .username {
        h3 {
          color: #1565c0; /* deep pastel blue */
          font-weight: 600;
        }
      }
    }
  }

  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 0.3rem;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #64b5f6;
      border-radius: 0.5rem;
    }

    .message {
      display: flex;
      align-items: center;

      .content {
        max-width: 50%;
        overflow-wrap: break-word;
        padding: 0.8rem 1rem;
        font-size: 1rem;
        border-radius: 1rem;
        transition: all 0.3s ease;
        color: #263238; /* dark grey text for readability */

        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }

        &:hover {
          transform: scale(1.02);
        }
      }
    }

    .sended {
      justify-content: flex-end;
      .content {
        background: #bbdefb; /* pastel blue */
        border: 1px solid #64b5f6;
      }
    }

    .recieved {
      justify-content: flex-start;
      .content {
        background: #ffe0b2; /* pastel orange */
        border: 1px solid #ffb74d;
      }
    }
  }
`;
