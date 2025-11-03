// import React, { useState } from "react";
// import "./Chatbot.css";

// const BACKEND_URL = "http://localhost:4000/api/chatbot"; // Change if hosted elsewhere

// const Chatbot = ({ pageName }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     {
//       from: "bot",
//       text: `👋 Hi! I can clarify your doubts on this page — ${pageName}.`,
//     },
//   ]);
//   const [input, setInput] = useState("");

//   const handleSend = async () => {
//     if (!input.trim()) return;
//     const userMsg = input;
//     setMessages((prev) => [...prev, { from: "user", text: userMsg }]);
//     setInput("");

//     try {
//       const res = await fetch(BACKEND_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: userMsg, page: pageName }),
//       });

//       const data = await res.json();
//       const reply = data.reply || "Sorry, I couldn’t understand that.";
//       console.log("Chatbot reply:", reply);
//       setMessages((prev) => [...prev, { from: "bot", text: reply }]);
//     } catch (err) {
//       console.error("Chatbot error:", err);
//       setMessages((prev) => [
//         ...prev,
//         { from: "bot", text: "⚠️ Connection error. Please try again." },
//       ]);
//     }
//   };

//   return (
//     <div className="chatbot-container">
//       <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
//         💬
//       </button>

//       {isOpen && (
//         <div className="chatbot-box">
//           <div className="chatbot-header">
//             🌾 Agri Assistant
//             <span className="chatbot-close" onClick={() => setIsOpen(false)}>
//               ✖
//             </span>
//           </div>

//           <div className="chatbot-messages">
//             {messages.map((msg, i) => (
//               <div key={i} className={`chat-message ${msg.from}`}>
//                 {msg.text}
//               </div>
//             ))}
//           </div>

//           <div className="chatbot-input">
//             <input
//               type="text"
//               placeholder="Ask me anything..."
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handleSend()}
//             />
//             <button onClick={handleSend}>Send</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Chatbot;



// original 1
// import React, { useState, useRef, useEffect } from "react";
// import "./Chatbot.css";

// const BACKEND_URL = "http://localhost:4000/api/chatbot"; // Change if hosted elsewhere

// const Chatbot = ({ pageName }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     {
//       from: "bot",
//       text: `👋 Hi! I can clarify your doubts on this page — ${pageName}.`,
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   // Scroll to bottom whenever messages change
//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   const handleSend = async () => {
//     if (!input.trim() || loading) return;

//     const userMsg = input;
//     setMessages((prev) => [...prev, { from: "user", text: userMsg }]);
//     setInput("");
//     setLoading(true);

//     try {
//       const res = await fetch(BACKEND_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: userMsg, page: pageName }),
//       });

//       const data = await res.json();

//       let reply = "Sorry, I couldn’t understand that.";
//       if (data.reply) reply = data.reply;
//       else if (data.error) reply = `⚠️ ${data.error}`;

//       setMessages((prev) => [...prev, { from: "bot", text: reply }]);
//     } catch (err) {
//       console.error("Chatbot error:", err);
//       setMessages((prev) => [
//         ...prev,
//         { from: "bot", text: "⚠️ Connection error. Please try again." },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="chatbot-container">
//       <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
//         💬
//       </button>

//       {isOpen && (
//         <div className="chatbot-box">
//           <div className="chatbot-header">
//             🌾 Agri Assistant
//             <span className="chatbot-close" onClick={() => setIsOpen(false)}>
//               ✖
//             </span>
//           </div>

//           <div className="chatbot-messages">
//             {messages.map((msg, i) => (
//               <div key={i} className={`chat-message ${msg.from}`}>
//                 {msg.text}
//               </div>
//             ))}
//             <div ref={messagesEndRef} />
//             {loading && <div className="chat-message bot">⏳ Typing...</div>}
//           </div>

//           <div className="chatbot-input">
//             <input
//               type="text"
//               placeholder="Ask me anything..."
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handleSend()}
//             />
//             <button onClick={handleSend} disabled={loading}>
//               Send
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Chatbot;


//original 2 with markdown support and Gemini API integration
// import React, { useState, useRef, useEffect } from "react";
// import axios from "axios";
// import ReactMarkdown from "react-markdown";
// import "./Chatbot.css"; // keep your existing CSS

// const Chatbot = ({ pageName }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     {
//       from: "bot",
//       text: `👋 Hi! I can clarify your doubts on this page — ${pageName}.`,
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   // auto-scroll
//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages, loading]);

//   // Send message to Gemini API
//   const handleSend = async () => {
//     if (!input.trim() || loading) return;

//     const userMsg = input;
//     setMessages((prev) => [...prev, { from: "user", text: userMsg }]);
//     setInput("");
//     setLoading(true);

//     try {
//       const response = await axios({
//         url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${
//           import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT
//         }`,
//         method: "post",
//         data: {
//           contents: [{ parts: [{ text: userMsg }] }],
//         },
//       });

//       const aiResponse =
//         response?.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
//         "Sorry, I couldn’t understand that.";

//       setMessages((prev) => [...prev, { from: "bot", text: aiResponse }]);
//     } catch (err) {
//       console.error("Chatbot error:", err);
//       setMessages((prev) => [
//         ...prev,
//         { from: "bot", text: "⚠️ Something went wrong. Please try again!" },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="chatbot-container">
//       {/* Floating Button */}
//       <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
//         💬
//       </button>

//       {isOpen && (
//         <div className="chatbot-box">
//           <div className="chatbot-header">
//             🤖 Smart Assistant
//             <span className="chatbot-close" onClick={() => setIsOpen(false)}>
//               ✖
//             </span>
//           </div>

//           {/* Chat Window */}
//           <div className="chatbot-messages">
//             {messages.map((msg, i) => (
//               <div key={i} className={`chat-message ${msg.from}`}>
//                 {msg.from === "bot" ? (
//                   <ReactMarkdown>{msg.text}</ReactMarkdown>
//                 ) : (
//                   msg.text
//                 )}
//               </div>
//             ))}

//             {loading && <div className="chat-message bot">⏳ Thinking...</div>}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Input Area */}
//           <div className="chatbot-input">
//             <input
//               type="text"
//               placeholder="Ask me anything..."
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handleSend()}
//             />
//             <button onClick={handleSend} disabled={loading}>
//               Send
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Chatbot;

//original 3
// import React, { useState, useRef, useEffect } from "react";
// import axios from "axios";
// import ReactMarkdown from "react-markdown";
// import "./Chatbot.css";

// const Chatbot = ({ pageName }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     {
//       from: "bot",
//       text: `👋 Hi! I'm your AI Assistant. You’re currently on the **${pageName}** page. How can I help you today?`,
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   // Auto scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, loading]);

//   // Send message to backend
//   const handleSend = async () => {
//     if (!input.trim() || loading) return;

//     const userMsg = input.trim();
//     setMessages((prev) => [...prev, { from: "user", text: userMsg }]);
//     setInput("");
//     setLoading(true);

//     try {
//       // Call your backend
//       const response = await axios.post("http://localhost:4000/api/chat1", {
//         message: userMsg,
//         pageName,
//       });

//       const aiResponse =
//         response?.data?.reply || "🤖 Sorry, I couldn’t generate a response.";

//       setMessages((prev) => [...prev, { from: "bot", text: aiResponse }]);
//     } catch (error) {
//       console.error("Chatbot error:", error);
//       setMessages((prev) => [
//         ...prev,
//         {
//           from: "bot",
//           text: "⚠️ Oops! I couldn’t connect to Gemini. Please try again later.",
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="chatbot-container">
//       {/* Floating Toggle Button */}
//       <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
//         💬
//       </button>

//       {/* Chat Window */}
//       {isOpen && (
//         <div className="chatbot-box">
//           <div className="chatbot-header">
//             🤖 Smart Assistant
//             <span className="chatbot-close" onClick={() => setIsOpen(false)}>
//               ✖
//             </span>
//           </div>

//           {/* Messages */}
//           <div className="chatbot-messages">
//             {messages.map((msg, i) => (
//               <div key={i} className={`chat-message ${msg.from}`}>
//                 {msg.from === "bot" ? (
//                   <ReactMarkdown>{msg.text}</ReactMarkdown>
//                 ) : (
//                   msg.text
//                 )}
//               </div>
//             ))}

//             {loading && <div className="chat-message bot">⏳ Thinking...</div>}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Input Box */}
//           <div className="chatbot-input">
//             <input
//               type="text"
//               placeholder="Ask me something..."
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handleSend()}
//             />
//             <button onClick={handleSend} disabled={loading}>
//               Send
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Chatbot;


import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "./Chatbot.css";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Detect current page automatically
  const pageName = window.location.pathname.replace("/", "") || "Home";

  // Initialize greeting message
  useEffect(() => {
    setMessages([
      {
        from: "bot",
        text: `👋 Hi! You’re currently on the **${pageName}** page. How can I help you today?`,
      },
    ]);
  }, [pageName]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Send message to backend
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { from: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/chat1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, pageName }),
      });

      const data = await response.json();
      const aiResponse = data?.reply || "🤖 Sorry, no response.";

      setMessages((prev) => [...prev, { from: "bot", text: aiResponse }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ Could not connect to Gemini. Try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {/* Floating Toggle Button */}
      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        💬
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-box">
          <div className="chatbot-header">
            🤖 Smart Assistant
            <span className="chatbot-close" onClick={() => setIsOpen(false)}>
              ✖
            </span>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.from}`}>
                {msg.from === "bot" ? (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>
            ))}

            {loading && <div className="chat-message bot">⏳ Thinking...</div>}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Ask me something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend} disabled={loading}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;



// import React, { useState } from "react";

// const Chatbot = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const userMsg = { sender: "user", text: input };
//     setMessages((prev) => [...prev, userMsg]);
//     setInput("");
//     setLoading(true);

//     try {
//       const res = await fetch("http://localhost:5000/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: input }),
//       });

//       const data = await res.json();
//       const botMsg = { sender: "bot", text: data.reply || "No response" };
//       setMessages((prev) => [...prev, botMsg]);
//     } catch (err) {
//       setMessages((prev) => [
//         ...prev,
//         { sender: "bot", text: "⚠️ Error connecting to backend." },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       style={{
//         width: "360px",
//         height: "520px",
//         background: "#0b132b",
//         borderRadius: "15px",
//         color: "#ffffff",
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "space-between",
//         padding: "15px",
//         fontFamily: "sans-serif",
//       }}
//     >
//       <h2 style={{ textAlign: "center", color: "#6fffe9" }}>Azure Chatbot</h2>

//       <div
//         style={{
//           flex: 1,
//           overflowY: "auto",
//           background: "#1c2541",
//           borderRadius: "10px",
//           padding: "10px",
//           marginBottom: "10px",
//         }}
//       >
//         {messages.map((msg, i) => (
//           <div
//             key={i}
//             style={{
//               textAlign: msg.sender === "user" ? "right" : "left",
//               margin: "6px 0",
//             }}
//           >
//             <div
//               style={{
//                 display: "inline-block",
//                 background: msg.sender === "user" ? "#5bc0be" : "#3a506b",
//                 color: "#fff",
//                 padding: "8px 12px",
//                 borderRadius: "10px",
//                 maxWidth: "80%",
//                 wordWrap: "break-word",
//               }}
//             >
//               {msg.text}
//             </div>
//           </div>
//         ))}
//         {loading && (
//           <div style={{ textAlign: "center", color: "#ccc" }}>
//             ⏳ Thinking...
//           </div>
//         )}
//       </div>

//       <div style={{ display: "flex", gap: "5px" }}>
//         <input
//           type="text"
//           placeholder="Type your message..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           style={{
//             flex: 1,
//             padding: "10px",
//             borderRadius: "10px",
//             border: "none",
//             outline: "none",
//           }}
//         />
//         <button
//           onClick={sendMessage}
//           style={{
//             background: "#6fffe9",
//             border: "none",
//             borderRadius: "10px",
//             padding: "10px 15px",
//             fontWeight: "bold",
//             cursor: "pointer",
//           }}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Chatbot;
