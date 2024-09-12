import { useState, useEffect, useRef } from "react";
import "./App.css";
import { FaCode } from "react-icons/fa6";
import { IoPlanet } from "react-icons/io5";
import { FaBrain } from "react-icons/fa";
import { FaPython } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { GoogleGenerativeAI } from "@google/generative-ai";

function App() {
  const [message, setMessage] = useState("");
  const [isResponse, setIsResponse] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false); // Added loading state
  const messagesEndRef = useRef(null); // Reference to message end

  // Function to scroll to the bottom of the message container
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Trigger scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const hitRequest = () => {
    if (message) {
      generateResponse(message);
    } else {
      alert("You must write something .....!");
    }
  };

  const generateResponse = async (msg) => {
    let allMessages = [...messages];
    allMessages.push({ type: "user", text: msg });
    setMessages(allMessages);
    setMessage(""); // Clear input field
    setLoading(true); // Set loading state to true when request starts

    try {
      const genAI = new GoogleGenerativeAI("AIzaSyDBVi_PmfmuW8MlIkVQ8YvBpVqoNUQW11I");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(msg);
      const responseText = await result.response.text();

      allMessages.push({
        type: "responseMsg",
        text: responseText,
      });
    } catch (error) {
      allMessages.push({
        type: "responseMsg",
        text: "Something went wrong! Please try again.",
      });
    } finally {
      setMessages(allMessages);
      setLoading(false); // Set loading state to false after response
      setIsResponse(true);
    }
  };

  const newChat = () => {
    setIsResponse(false);
    setMessages([]);
  };

  return (
    <div className="w-screen h-screen bg-black text-white flex flex-col">
      {isResponse ? (
        <div className="h-[80vh]">
          <div className="header pt-[25px] flex items-center justify-between w-[100vw] px-[300px]">
            <h2 className="text-4xl chat">CHAT TO HELP</h2>
            <button
              id="newChatBtn"
              className="bg-[#181818] p-[10px] rounded-[30px] cursor-pointer text-[14px] px-[20px]"
              onClick={newChat}
            >
              NEW CHAT
            </button>
          </div>
          <div className="messages overflow-y-auto max-h-[60vh] px-[300px] py-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={msg.type === "user" ? "userMsg" : "responseMsg"}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="responseMsg">
                <i>Loading...</i> {/* Display loading indicator */}
              </div>
            )}
            {/* Dummy div to scroll to the bottom */}
            <div ref={messagesEndRef} />
          </div>
        </div>
      ) : (
        <div className="middle h-[80vh] flex flex-col items-center justify-center">
          <h1 className="text-4xl b">CHAT TO HELP</h1>
          <div className="boxes mt-6 flex items-center gap-4 flex-wrap justify-center">
            <div className="card min-w-[200px] px-6 py-4 rounded-lg cursor-pointer transition-all hover:bg-black relative min-h-[20vh] bg-[#181818]">
              <p className="text-2xl leading-tight">
                Want to learn code? <br /> You can learn easily with me.
              </p>
              <i className="absolute right-4 bottom-4 text-3xl">
                <FaCode />
              </i>
            </div>
            <div className="card min-w-[200px] px-6 py-4 rounded-lg cursor-pointer transition-all hover:bg-black relative min-h-[20vh] bg-[#181818]">
              <p className="text-2xl leading-tight">
                Want to explore the universe? <br /> Find some interesting facts.
              </p>
              <i className="absolute right-4 bottom-4 text-3xl">
                <IoPlanet />
              </i>
            </div>
            <div className="card min-w-[200px] px-6 py-4 rounded-lg cursor-pointer transition-all hover:bg-black relative min-h-[20vh] bg-[#181818]">
              <p className="text-2xl leading-tight">
                Want to learn NLP? <br /> You can learn easily with me.
              </p>
              <i className="absolute right-4 bottom-4 text-3xl">
                <FaBrain />
              </i>
            </div>
            <div className="card min-w-[200px] px-6 py-4 rounded-lg cursor-pointer transition-all hover:bg-black relative min-h-[20vh] bg-[#181818]">
              <p className="text-2xl leading-tight">
                Want to learn Python? <br /> You can learn easily with me.
              </p>
              <i className="absolute right-4 bottom-4 text-3xl">
                <FaPython />
              </i>
            </div>
          </div>
        </div>
      )}

      <div className="bottom w-[100%] flex flex-col items-center">
        <div className="inputbox w-[60%] text-[15px] py-[7px] flex items-center bg-[#181818] rounded-[30px]">
          <input
            value={message} // Keep input value synced
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            className="p-[10px] pl-[15px] bg-transparent flex-1 outline-none border-none text-2xl"
            type="text"
            placeholder="Write your message here ..."
            id="messagebox"
          />
          {message === "" || loading ? (
            ""
          ) : (
            <i className="text-purple-700 text-[20px] mr-5 cursor-pointer" onClick={hitRequest}>
              <IoSend />
            </i>
          )}
        </div>
        <p className="text-gray-500 text-[20px]">
          ChatMe is Developed by Hanzala Arshad Arain
        </p>
      </div>
    </div>
  );
}

export default App;
