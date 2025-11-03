// import React, { useState } from 'react';
// import API from '../api';

// export default function DiseaseDetect(){
//   const [file, setFile] = useState(null);
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const toBase64 = file => new Promise((resolve,reject)=>{
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = ()=> resolve(reader.result.split(',')[1]); // base64 without prefix
//     reader.onerror = error => reject(error);
//   });

//   async function handleSubmit(e){
//     e.preventDefault();
//     if(!file) return alert('Select image');
//     setLoading(true);
//     const b64 = await toBase64(file);
//     try {
//       const resp = await API.post('/ml/disease', { imageBase64: b64, crop: 'unknown' });
//       console.log('Disease detection response:', resp.data);
//       setResult(resp.data);
//     } catch(err){
//       console.error(err);
//       alert('Prediction failed');
//     } finally { setLoading(false); }
//   }

//   return (
//     <div className="p-6 max-w-2xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Disease Detection</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input type="file" accept="image/*" onChange={e=>setFile(e.target.files[0])} />
//         <button className="px-4 py-2 bg-green-600 text-white rounded" type="submit" disabled={loading}>
//           {loading ? 'Analyzing...' : 'Analyze'}
//         </button>
//       </form>
//       {result && (
//         <div className="mt-6 p-4 border rounded">
//           <p><strong>Disease:</strong> {result.disease}</p>
//           <p><strong>Severity:</strong> {result.severity}</p>
//           <p><strong>Advice:</strong> {result.advice}</p>
//         </div>
//       )}
//     </div>
//   );
// }

//original 1
// import React, { useState, useRef, useEffect } from "react";
// import API from "../api";

// export default function DiseaseDetect() {
//   const [messages, setMessages] = useState([]); // chat messages
//   const [text, setText] = useState("");
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const chatEndRef = useRef(null);

//   // scroll to bottom
//   useEffect(() => {
//     if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const toBase64 = (file) =>
//     new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result.split(",")[1]);
//       reader.onerror = (err) => reject(err);
//     });

//   const handleSend = async () => {
//     if (!text && !file) return;
//     const newMsg = { type: "user", text, file };
//     setMessages((prev) => [...prev, newMsg]);
//     setText("");
//     setFile(null);
//     setLoading(true);

//     try {
//       let payload = {};
//       if (file) {
//         const b64 = await toBase64(file);
//         payload = { imageBase64: b64, crop: text || "unknown" };
//       } else {
//         payload = { imageBase64: null, crop: text };
//       }

//       const resp = await API.post("/ml/disease", payload);
//       const botMsg = {
//         type: "bot",
//         text: `Disease: ${resp.data.disease}\nSeverity: ${resp.data.severity}\nAdvice: ${resp.data.advice}`,
//       };
//       setMessages((prev) => [...prev, botMsg]);
//     } catch (err) {
//       console.error(err);
//       setMessages((prev) => [...prev, { type: "bot", text: "Prediction failed. Try again." }]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-4 border rounded shadow flex flex-col h-[600px] bg-white">
//       <h2 className="text-2xl font-bold mb-4">Disease Detection Chatbot</h2>
//       <div className="flex-1 overflow-y-auto mb-4 space-y-2">
//         {messages.map((msg, idx) => (
//           <div
//             key={idx}
//             className={`p-2 rounded max-w-xs break-words ${
//               msg.type === "user" ? "bg-green-500 text-white self-end" : "bg-gray-200 self-start"
//             }`}
//           >
//             {msg.file && <img src={URL.createObjectURL(msg.file)} alt="upload" className="mb-2 max-w-full rounded" />}
//             {msg.text.split("\n").map((line, i) => (
//               <p key={i}>{line}</p>
//             ))}
//           </div>
//         ))}
//         <div ref={chatEndRef} />
//       </div>

//       <div className="flex space-x-2">
//         <input
//           type="text"
//           placeholder="Type crop or message..."
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           onKeyDown={handleKeyPress}
//           className="flex-1 p-2 border rounded"
//         />
//         <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
//         <button
//           onClick={handleSend}
//           disabled={loading}
//           className="bg-green-500 text-white p-2 rounded"
//         >
//           {loading ? "Analyzing..." : "Send"}
//         </button>
//       </div>
//     </div>
//   );
// }



//original 2
// import React, { useState, useRef, useEffect } from "react";

// export default function AgentChatbot() {
//   const [messages, setMessages] = useState([
//     { type: "bot", text: "Hi — I'm your agent. Ask me something!" },
//   ]);
//   const [text, setText] = useState("");
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const chatEndRef = useRef(null);

//   // Scroll to bottom on new messages
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Convert image file to Base64
//   const toBase64 = (file) =>
//     new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result.split(",")[1]);
//       reader.onerror = (err) => reject(err);
//     });

//   const handleSend = async () => {
//     if (!text && !file) return;

//     const newMsg = { type: "user", text, file };
//     setMessages((prev) => [...prev, newMsg]);
//     setText("");
//     setFile(null);
//     setLoading(true);

//     try {
//       let payload = { message: text };
//       if (file) {
//         const b64 = await toBase64(file);
//         payload.imageBase64 = b64;
//       }

//       const res = await fetch("http://localhost:4000/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       const data = await res.json();

//       const botMsg = { type: "bot", text: data.reply || "No response from agent" };
//       setMessages((prev) => [...prev, botMsg]);
//     } catch (err) {
//       console.error(err);
//       setMessages((prev) => [
//         ...prev,
//         { type: "bot", text: "Error: Unable to get response from agent." },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-4 border rounded shadow flex flex-col h-[600px] bg-white">
//       <h2 className="text-2xl font-bold mb-4 text-center">AI Agent Chatbot</h2>

//       {/* Chat Messages */}
//       <div className="flex-1 overflow-y-auto mb-4 space-y-2 p-2 bg-gray-50 rounded">
//         {messages.map((msg, idx) => (
//           <div
//             key={idx}
//             className={`p-2 rounded max-w-xs break-words ${
//               msg.type === "user"
//                 ? "bg-green-500 text-white self-end"
//                 : "bg-gray-200 self-start"
//             }`}
//           >
//             {msg.file && (
//               <img
//                 src={URL.createObjectURL(msg.file)}
//                 alt="upload"
//                 className="mb-2 max-w-full rounded"
//               />
//             )}
//             {msg.text.split("\n").map((line, i) => (
//               <p key={i}>{line}</p>
//             ))}
//           </div>
//         ))}
//         <div ref={chatEndRef} />
//       </div>

//       {/* Input Area */}
//       <div className="flex space-x-2 items-center">
//         <input
//           type="text"
//           placeholder="Type your message..."
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           onKeyDown={handleKeyPress}
//           className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
//         />
//         <label htmlFor="file-upload" className="cursor-pointer bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded">
//           🖼
//         </label>
//         <input
//           id="file-upload"
//           type="file"
//           accept="image/*"
//           className="hidden"
//           onChange={(e) => setFile(e.target.files[0])}
//         />
//         <button
//           onClick={handleSend}
//           disabled={loading}
//           className={`px-4 py-2 rounded text-white ${
//             loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
//           }`}
//         >
//           {loading ? "Sending..." : "Send"}
//         </button>
//       </div>
//     </div>
//   );
// }


//original 3
// import React, { useState, useRef, useEffect } from "react";

// export default function AgentChatbot() {
//   const [messages, setMessages] = useState([
//     { type: "bot", text: "🌿 Hi! I'm your Disease Detection Assistant. Upload a plant image or ask me anything!" },
//   ]);
//   const [text, setText] = useState("");
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const chatEndRef = useRef(null);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const toBase64 = (file) =>
//     new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result.split(",")[1]);
//       reader.onerror = (err) => reject(err);
//     });

//   const handleSend = async () => {
//     if (!text && !file) return;

//     const newMsg = { type: "user", text, file };
//     setMessages((prev) => [...prev, newMsg]);
//     setText("");
//     setFile(null);
//     setLoading(true);

//     try {
//       let payload = { message: text };
//       if (file) {
//         const b64 = await toBase64(file);
//         payload.imageBase64 = b64;
//       }

//       const res = await fetch("http://localhost:4000/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       const data = await res.json();

//       // Clean response into readable points
//       let formattedText = data.reply || "No response from agent";
//       formattedText = formattedText
//         .split(/(?:\n|•|–|-)\s*/)
//         .filter((line) => line.trim() !== "")
//         .map((line) => "• " + line.trim())
//         .join("\n");

//       const botMsg = { type: "bot", text: formattedText };
//       setMessages((prev) => [...prev, botMsg]);
//     } catch (err) {
//       console.error(err);
//       setMessages((prev) => [
//         ...prev,
//         { type: "bot", text: "❌ Error: Unable to get response from agent." },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-4 border rounded-2xl shadow-xl flex flex-col h-[600px] bg-gradient-to-br from-green-50 to-white">
//       <h2 className="text-3xl font-extrabold mb-3 text-center text-green-700 drop-shadow-sm">
//         🌱 AI Disease Detection Chatbot
//       </h2>

//       {/* Chat Messages */}
//       <div className="flex-1 overflow-y-auto mb-4 space-y-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
//         {messages.map((msg, idx) => (
//           <div
//             key={idx}
//             className={`flex ${
//               msg.type === "user" ? "justify-end" : "justify-start"
//             }`}
//           >
//             <div
//               className={`p-3 rounded-2xl shadow-sm text-sm max-w-[75%] whitespace-pre-line ${
//                 msg.type === "user"
//                   ? "bg-green-500 text-white rounded-br-none"
//                   : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
//               }`}
//             >
//               {msg.file && (
//                 <img
//                   src={URL.createObjectURL(msg.file)}
//                   alt="upload"
//                   className="mb-2 max-w-full rounded-lg"
//                 />
//               )}
//               {msg.text.split("\n").map((line, i) => (
//                 <p key={i} className="mb-1">
//                   {line}
//                 </p>
//               ))}
//             </div>
//           </div>
//         ))}
//         <div ref={chatEndRef} />
//       </div>

//       {/* Input Area */}
//       <div className="flex items-center bg-white rounded-xl border border-gray-200 p-2 shadow-inner space-x-2">
//         <input
//           type="text"
//           placeholder="Type your message..."
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           onKeyDown={handleKeyPress}
//           className="flex-1 p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-400"
//         />
//         <label
//           htmlFor="file-upload"
//           className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-lg"
//           title="Upload image"
//         >
//           🖼
//         </label>
//         <input
//           id="file-upload"
//           type="file"
//           accept="image/*"
//           className="hidden"
//           onChange={(e) => setFile(e.target.files[0])}
//         />
//         <button
//           onClick={handleSend}
//           disabled={loading}
//           className={`px-5 py-2 rounded-lg font-semibold text-white transition-colors duration-200 ${
//             loading
//               ? "bg-gray-400 cursor-not-allowed"
//               : "bg-green-600 hover:bg-green-700"
//           }`}
//         >
//           {loading ? "Sending..." : "Send"}
//         </button>
//       </div>
//     </div>
//   );
// }

//original 4
// import React, { useState, useRef, useEffect } from "react";

// export default function AgentChatbot() {
//   const [messages, setMessages] = useState([
//     {
//       type: "bot",
//       text: "🌿 Hi! I'm your Disease Detection Assistant. Upload a plant image or ask me anything!",
//     },
//   ]);
//   const [text, setText] = useState("");
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [translating, setTranslating] = useState(false);
//   const chatEndRef = useRef(null);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Convert image file to Base64
//   const toBase64 = (file) =>
//     new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result.split(",")[1]);
//       reader.onerror = (err) => reject(err);
//     });

//   const handleSend = async () => {
//     if (!text && !file) return;

//     const newMsg = { type: "user", text, file };
//     setMessages((prev) => [...prev, newMsg]);
//     setText("");
//     setFile(null);
//     setLoading(true);

//     try {
//       let payload = { message: text };
//       if (file) {
//         const b64 = await toBase64(file);
//         payload.imageBase64 = b64;
//       }

//       const res = await fetch("http://localhost:4000/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       const data = await res.json();

//       // Clean response into readable bullet points
//       let formattedText = data.reply || "No response from agent";
//       formattedText = formattedText
//         .split(/(?:\n|•|–|-)\s*/)
//         .filter((line) => line.trim() !== "")
//         .map((line) => "• " + line.trim())
//         .join("\n");

//       const botMsg = { type: "bot", text: formattedText };
//       setMessages((prev) => [...prev, botMsg]);
//     } catch (err) {
//       console.error(err);
//       setMessages((prev) => [
//         ...prev,
//         { type: "bot", text: "❌ Error: Unable to get response from agent." },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Translate the last Gemini reply to Telugu
//   const handleTranslate = async () => {
//     const lastBotMsg = [...messages].reverse().find((m) => m.type === "bot");
//     if (!lastBotMsg) return;

//     setTranslating(true);

//     try {
//       const res = await fetch("http://localhost:4000/api/translate", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           text: lastBotMsg.text,
//           targetLang: "te", // Telugu
//         }),
//       });
//       const data = await res.json();

//       if (data.translated) {
//         setMessages((prev) => [
//           ...prev,
//           { type: "bot", text: `🗣️ Telugu Translation:\n${data.translated}` },
//         ]);
//       } else {
//         setMessages((prev) => [
//           ...prev,
//           { type: "bot", text: "⚠️ Translation failed. Please try again." },
//         ]);
//       }
//     } catch (err) {
//       console.error(err);
//       setMessages((prev) => [
//         ...prev,
//         { type: "bot", text: "❌ Error translating to Telugu." },
//       ]);
//     } finally {
//       setTranslating(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-4 border rounded-2xl shadow-xl flex flex-col h-[620px] bg-gradient-to-br from-green-50 to-white">
//       <h2 className="text-3xl font-extrabold mb-3 text-center text-green-700 drop-shadow-sm">
//         🌱 AI Disease Detection Chatbot
//       </h2>

//       {/* Chat Messages */}
//       <div className="flex-1 overflow-y-auto mb-4 space-y-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
//         {messages.map((msg, idx) => (
//           <div
//             key={idx}
//             className={`flex ${
//               msg.type === "user" ? "justify-end" : "justify-start"
//             }`}
//           >
//             <div
//               className={`p-3 rounded-2xl shadow-sm text-sm max-w-[75%] whitespace-pre-line ${
//                 msg.type === "user"
//                   ? "bg-green-500 text-white rounded-br-none"
//                   : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
//               }`}
//             >
//               {msg.file && (
//                 <img
//                   src={URL.createObjectURL(msg.file)}
//                   alt="upload"
//                   className="mb-2 max-w-full rounded-lg"
//                 />
//               )}
//               {msg.text.split("\n").map((line, i) => (
//                 <p key={i} className="mb-1">
//                   {line}
//                 </p>
//               ))}
//             </div>
//           </div>
//         ))}
//         <div ref={chatEndRef} />
//       </div>

//       {/* Input Area */}
//       <div className="flex items-center bg-white rounded-xl border border-gray-200 p-2 shadow-inner space-x-2">
//         <input
//           type="text"
//           placeholder="Type your message..."
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           onKeyDown={handleKeyPress}
//           className="flex-1 p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-400"
//         />
//         <label
//           htmlFor="file-upload"
//           className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-lg"
//           title="Upload image"
//         >
//           🖼
//         </label>
//         <input
//           id="file-upload"
//           type="file"
//           accept="image/*"
//           className="hidden"
//           onChange={(e) => setFile(e.target.files[0])}
//         />
//         <button
//           onClick={handleSend}
//           disabled={loading}
//           className={`px-5 py-2 rounded-lg font-semibold text-white transition-colors duration-200 ${
//             loading
//               ? "bg-gray-400 cursor-not-allowed"
//               : "bg-green-600 hover:bg-green-700"
//           }`}
//         >
//           {loading ? "Sending..." : "Send"}
//         </button>
//       </div>

//       {/* Translate Button */}
//       <button
//         onClick={handleTranslate}
//         disabled={translating}
//         className={`mt-3 py-2 rounded-lg font-semibold text-white ${
//           translating
//             ? "bg-gray-400 cursor-not-allowed"
//             : "bg-blue-500 hover:bg-blue-600"
//         }`}
//       >
//         {translating ? "Translating..." : "🌐 Translate Last Reply to Telugu"}
//       </button>
//     </div>
//   );
// }

//original 5
// import React, { useState, useRef, useEffect } from "react";

// export default function AgentChatbot() {
//   const [messages, setMessages] = useState([
//     { type: "bot", text: "👋 Hi! I'm your AI Agent. How can I help you today?" },
//   ]);
//   const [text, setText] = useState("");
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [listening, setListening] = useState(false);
//   const [translateTelugu, setTranslateTelugu] = useState(false);
//   const chatEndRef = useRef(null);

//   // Scroll to bottom on new messages
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Convert image file to Base64
//   const toBase64 = (file) =>
//     new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result.split(",")[1]);
//       reader.onerror = (err) => reject(err);
//     });

//   // 🔊 Voice input
//   const handleVoiceInput = () => {
//     if (!("webkitSpeechRecognition" in window)) {
//       alert("Speech recognition not supported in this browser.");
//       return;
//     }

//     const recognition = new window.webkitSpeechRecognition();
//     recognition.lang = "en-US";
//     recognition.continuous = false;
//     recognition.interimResults = false;

//     recognition.onstart = () => setListening(true);
//     recognition.onend = () => setListening(false);
//     recognition.onerror = () => setListening(false);

//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       setText(transcript);
//       handleSend(transcript);
//     };

//     recognition.start();
//   };

//   // 🧠 Translate to Telugu (optional)
//   const translateText = async (text) => {
//     if (!translateTelugu) return text;
//     try {
//       const res = await fetch(
//         "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=te&dt=t&q=" +
//           encodeURIComponent(text)
//       );
//       const data = await res.json();
//       return data[0].map((t) => t[0]).join("");
//     } catch {
//       return text + " (⚠️ translation failed)";
//     }
//   };

//   const handleSend = async (customMessage) => {
//     const messageToSend = customMessage ?? text;
//     if (!messageToSend && !file) return;

//     const newMsg = { type: "user", text: messageToSend, file };
//     setMessages((prev) => [...prev, newMsg]);
//     setText("");
//     setFile(null);
//     setLoading(true);

//     try {
//       let payload = { message: messageToSend };
//       if (file) {
//         const b64 = await toBase64(file);
//         payload.imageBase64 = b64;
//       }

//       const res = await fetch("http://localhost:4000/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       const data = await res.json();

//       let reply = data.reply || "No response from agent";
//       reply = reply
//         .replace(/\n/g, " ")
//         .replace(/(?:•|-|\d+\.)/g, "\n•") // convert to bullets
//         .trim();

//       // translate if toggle is on
//       reply = await translateText(reply);

//       const botMsg = { type: "bot", text: reply };
//       setMessages((prev) => [...prev, botMsg]);
//     } catch (err) {
//       console.error(err);
//       setMessages((prev) => [
//         ...prev,
//         { type: "bot", text: "⚠️ Error: Unable to get response from Gemini agent." },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-4 bg-gradient-to-b from-green-50 to-white border rounded-2xl shadow-lg flex flex-col h-[650px]">
//       <h2 className="text-2xl font-bold mb-3 text-center text-green-700">
//         🤖 Gemini AI Agent
//       </h2>

//       {/* Toggle & Info */}
//       <div className="flex justify-between items-center mb-2">
//         <button
//           onClick={() => setTranslateTelugu(!translateTelugu)}
//           className={`text-sm px-3 py-1 rounded-full ${
//             translateTelugu ? "bg-green-600 text-white" : "bg-gray-200"
//           }`}
//         >
//           🌐 {translateTelugu ? "Telugu Mode ON" : "Translate to Telugu"}
//         </button>

//         {listening && <span className="text-red-500 text-sm animate-pulse">🎙 Listening...</span>}
//       </div>

//       {/* Chat Messages */}
//       <div className="flex-1 overflow-y-auto mb-4 space-y-3 p-3 bg-gray-50 rounded-lg border">
//         {messages.map((msg, idx) => (
//           <div
//             key={idx}
//             className={`p-3 rounded-xl max-w-[80%] whitespace-pre-wrap ${
//               msg.type === "user"
//                 ? "bg-green-500 text-white self-end ml-auto"
//                 : "bg-white border text-gray-800 self-start"
//             }`}
//           >
//             {msg.file && (
//               <img
//                 src={URL.createObjectURL(msg.file)}
//                 alt="upload"
//                 className="mb-2 rounded-lg max-w-full"
//               />
//             )}
//             {msg.text.split("\n").map((line, i) => (
//               <p key={i}>{line}</p>
//             ))}
//           </div>
//         ))}
//         <div ref={chatEndRef} />
//       </div>

//       {/* Input Area */}
//       <div className="flex items-center space-x-2">
//         <button
//           onClick={handleVoiceInput}
//           className={`p-2 rounded-full ${
//             listening ? "bg-red-500 text-white" : "bg-gray-200 hover:bg-gray-300"
//           }`}
//           title="Speak to Gemini"
//         >
//           🎤
//         </button>

//         <input
//           type="text"
//           placeholder="Type your message..."
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           onKeyDown={handleKeyPress}
//           className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-400"
//         />
//         <label
//           htmlFor="file-upload"
//           className="cursor-pointer bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-full"
//           title="Upload image"
//         >
//           🖼
//         </label>
//         <input
//           id="file-upload"
//           type="file"
//           accept="image/*"
//           className="hidden"
//           onChange={(e) => setFile(e.target.files[0])}
//         />
//         <button
//           onClick={() => handleSend()}
//           disabled={loading}
//           className={`px-4 py-2 rounded-full text-white ${
//             loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
//           }`}
//         >
//           {loading ? "..." : "Send"}
//         </button>
//       </div>
//     </div>
//   );
// }


// original 6
// import React, { useState, useRef, useEffect } from "react";

// export default function AgentChatbot() {
//   const [messages, setMessages] = useState([
//     { type: "bot", text: "👋 Hi! I'm your AI Agent. How can I help you today?" },
//   ]);
//   const [text, setText] = useState("");
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [listening, setListening] = useState(false);
//   const [translateTelugu, setTranslateTelugu] = useState(false);
//   const [speakEnabled, setSpeakEnabled] = useState(true);
//   const chatEndRef = useRef(null);

//   // ✅ Scroll to bottom on new messages
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // ✅ Convert image file to Base64
//   const toBase64 = (file) =>
//     new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result.split(",")[1]);
//       reader.onerror = (err) => reject(err);
//     });

//   // 🎙 Voice input (Speech-to-Text)
//   const handleVoiceInput = () => {
//     if (!("webkitSpeechRecognition" in window)) {
//       alert("Speech recognition not supported in this browser.");
//       return;
//     }

//     const recognition = new window.webkitSpeechRecognition();
//     recognition.lang = "en-US";
//     recognition.continuous = false;
//     recognition.interimResults = false;

//     recognition.onstart = () => setListening(true);
//     recognition.onend = () => setListening(false);
//     recognition.onerror = () => setListening(false);

//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       setText(transcript);
//       handleSend(transcript);
//     };

//     recognition.start();
//   };

//   // 🌐 Translate to Telugu using Google Translate
//   const translateText = async (text) => {
//     if (!translateTelugu) return text;
//     try {
//       const res = await fetch(
//         "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=te&dt=t&q=" +
//           encodeURIComponent(text)
//       );
//       const data = await res.json();
//       return data[0].map((t) => t[0]).join("");
//     } catch {
//       return text + " (⚠️ translation failed)";
//     }
//   };

//   // 🔊 Text-to-Speech (with stop control)
//   const speakText = (text) => {
//     if (!speakEnabled) {
//       window.speechSynthesis.cancel(); // ✅ stop any ongoing speech
//       return;
//     }

//     if (!window.speechSynthesis) {
//       alert("Speech synthesis not supported in this browser.");
//       return;
//     }

//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = translateTelugu ? "te-IN" : "en-US";
//     utterance.rate = 1;
//     utterance.pitch = 1;
//     window.speechSynthesis.cancel(); // cancel any previous speech
//     window.speechSynthesis.speak(utterance);
//   };

//   const handleSend = async (customMessage) => {
//     const messageToSend = customMessage ?? text;
//     if (!messageToSend && !file) return;

//     const newMsg = { type: "user", text: messageToSend, file };
//     setMessages((prev) => [...prev, newMsg]);
//     setText("");
//     setFile(null);
//     setLoading(true);

//     try {
//       let payload = { message: messageToSend };
//       if (file) {
//         const b64 = await toBase64(file);
//         payload.imageBase64 = b64;
//       }

//       const res = await fetch("http://localhost:4000/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       const data = await res.json();

//       let reply = data.reply || "No response from agent";
//       reply = reply
//         .replace(/\n/g, " ")
//         .replace(/(?:•|-|\d+\.)/g, "\n•") // Format as bullet points
//         .trim();

//       reply = await translateText(reply);

//       const botMsg = { type: "bot", text: reply };
//       setMessages((prev) => [...prev, botMsg]);

//       // 🗣 Speak the response (if enabled)
//       speakText(reply);
//     } catch (err) {
//       console.error(err);
//       setMessages((prev) => [
//         ...prev,
//         { type: "bot", text: "⚠️ Error: Unable to get response from Gemini agent." },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   // 🔘 Toggle Voice Mode (Stop if off)
//   const toggleVoice = () => {
//     if (speakEnabled) {
//       window.speechSynthesis.cancel(); // 🛑 stop any current speech instantly
//     }
//     setSpeakEnabled(!speakEnabled);
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-4 bg-gradient-to-b from-green-50 to-white border rounded-2xl shadow-xl flex flex-col h-[650px]">
//       <h2 className="text-2xl font-bold mb-3 text-center text-green-700">
//         🤖 AI Voice Agent
//       </h2>

//       {/* Toggle options */}
//       <div className="flex justify-between items-center mb-3">
//         <button
//           onClick={() => setTranslateTelugu(!translateTelugu)}
//           className={`text-sm px-3 py-1 rounded-full transition ${
//             translateTelugu ? "bg-green-600 text-white" : "bg-gray-200"
//           }`}
//         >
//           🌐 {translateTelugu ? "Telugu Mode ON" : "Translate to Telugu"}
//         </button>

//         <button
//           onClick={toggleVoice}
//           className={`text-sm px-3 py-1 rounded-full transition ${
//             speakEnabled ? "bg-green-600 text-white" : "bg-gray-200"
//           }`}
//         >
//           🔊 {speakEnabled ? "Voice ON" : "Voice OFF"}
//         </button>
//       </div>

//       {/* Listening Indicator */}
//       {listening && (
//         <div className="text-center text-red-500 text-sm animate-pulse mb-1">
//           🎙 Listening...
//         </div>
//       )}

//       {/* Chat Messages */}
//       <div className="flex-1 overflow-y-auto mb-4 space-y-3 p-3 bg-gray-50 rounded-lg border">
//         {messages.map((msg, idx) => (
//           <div
//             key={idx}
//             className={`p-3 rounded-xl max-w-[80%] whitespace-pre-wrap ${
//               msg.type === "user"
//                 ? "bg-green-500 text-white self-end ml-auto"
//                 : "bg-white border text-gray-800 self-start"
//             }`}
//           >
//             {msg.file && (
//               <img
//                 src={URL.createObjectURL(msg.file)}
//                 alt="upload"
//                 className="mb-2 rounded-lg max-w-full"
//               />
//             )}
//             {msg.text.split("\n").map((line, i) => (
//               <p key={i}>{line}</p>
//             ))}
//           </div>
//         ))}
//         <div ref={chatEndRef} />
//       </div>

//       {/* Input Controls */}
//       <div className="flex items-center space-x-2">
//         <button
//           onClick={handleVoiceInput}
//           className={`p-2 rounded-full ${
//             listening ? "bg-red-500 text-white" : "bg-gray-200 hover:bg-gray-300"
//           }`}
//           title="Speak to Gemini"
//         >
//           🎤
//         </button>

//         <input
//           type="text"
//           placeholder="Type your message..."
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           onKeyDown={handleKeyPress}
//           className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-400"
//         />

//         <label
//           htmlFor="file-upload"
//           className="cursor-pointer bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-full"
//           title="Upload image"
//         >
//           🖼
//         </label>
//         <input
//           id="file-upload"
//           type="file"
//           accept="image/*"
//           className="hidden"
//           onChange={(e) => setFile(e.target.files[0])}
//         />

//         <button
//           onClick={() => handleSend()}
//           disabled={loading}
//           className={`px-4 py-2 rounded-full text-white ${
//             loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
//           }`}
//         >
//           {loading ? "..." : "Send"}
//         </button>
//       </div>
//     </div>
//   );
// }




// import React, { useState, useRef, useEffect } from "react";

// export default function AgentChatbot() {
//   const [messages, setMessages] = useState([
//     { type: "bot", text: "👋 Hi! I'm Agri-Helper. Please upload a photo of the diseased plant to start." },
//   ]);
//   const [text, setText] = useState("");
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [listening, setListening] = useState(false);
//   const [translateTelugu, setTranslateTelugu] = useState(false);
//   const [speakEnabled, setSpeakEnabled] = useState(true);
//   const chatEndRef = useRef(null);
//   const [context, setContext] = useState([]); // 🧠 to maintain chat history

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const toBase64 = (file) =>
//     new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result.split(",")[1]);
//       reader.onerror = (err) => reject(err);
//     });

//   const handleVoiceInput = () => {
//     if (!("webkitSpeechRecognition" in window)) {
//       alert("Speech recognition not supported in this browser.");
//       return;
//     }
//     const recognition = new window.webkitSpeechRecognition();
//     recognition.lang = "en-US";
//     recognition.onstart = () => setListening(true);
//     recognition.onend = () => setListening(false);
//     recognition.onerror = () => setListening(false);
//     recognition.onresult = (e) => {
//       const transcript = e.results[0][0].transcript;
//       setText(transcript);
//       handleSend(transcript);
//     };
//     recognition.start();
//   };

//   const translateText = async (text) => {
//     if (!translateTelugu) return text;
//     try {
//       const res = await fetch(
//         "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=te&dt=t&q=" +
//           encodeURIComponent(text)
//       );
//       const data = await res.json();
//       return data[0].map((t) => t[0]).join("");
//     } catch {
//       return text + " (⚠️ translation failed)";
//     }
//   };

//   const speakText = (text) => {
//     if (!speakEnabled) {
//       window.speechSynthesis.cancel();
//       return;
//     }
//     if (!window.speechSynthesis) return;
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = translateTelugu ? "te-IN" : "en-US";
//     utterance.rate = 1;
//     window.speechSynthesis.cancel();
//     window.speechSynthesis.speak(utterance);
//   };

//   const handleSend = async (customMessage) => {
//     const messageToSend = customMessage ?? text;
//     if (!messageToSend && !file) return;

//     const newMsg = { type: "user", text: messageToSend, file };
//     setMessages((prev) => [...prev, newMsg]);
//     setText("");
//     setFile(null);
//     setLoading(true);

//     try {
//       let payload = { message: messageToSend, context };
//       if (file) {
//         const b64 = await toBase64(file);
//         payload.imageBase64 = b64;
//       }

//       const res = await fetch("http://localhost:4000/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();
//       let reply = data.reply || "No response from agent";
//       reply = reply.replace(/\n/g, "\n").trim();
//       reply = await translateText(reply);

//       const botMsg = { type: "bot", text: reply };
//       setMessages((prev) => [...prev, botMsg]);

//       // 🧠 Maintain conversation history for next request
//       setContext((prev) => [
//         ...prev,
//         { role: "user", parts: [{ text: messageToSend }] },
//         { role: "model", parts: [{ text: reply }] },
//       ]);

//       speakText(reply);
//     } catch (err) {
//       console.error(err);
//       setMessages((prev) => [
//         ...prev,
//         { type: "bot", text: "⚠️ Error: Unable to get response from Gemini agent." },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   const toggleVoice = () => {
//     if (speakEnabled) window.speechSynthesis.cancel();
//     setSpeakEnabled(!speakEnabled);
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-4 bg-gradient-to-b from-green-50 to-white border rounded-2xl shadow-xl flex flex-col h-[650px]">
//       <h2 className="text-2xl font-bold mb-3 text-center text-green-700">
//         🌾 Agri-Helper AI Agent
//       </h2>

//       <div className="flex justify-between items-center mb-3">
//         <button
//           onClick={() => setTranslateTelugu(!translateTelugu)}
//           className={`text-sm px-3 py-1 rounded-full transition ${
//             translateTelugu ? "bg-green-600 text-white" : "bg-gray-200"
//           }`}
//         >
//           🌐 {translateTelugu ? "Telugu Mode ON" : "Translate to Telugu"}
//         </button>

//         <button
//           onClick={toggleVoice}
//           className={`text-sm px-3 py-1 rounded-full transition ${
//             speakEnabled ? "bg-green-600 text-white" : "bg-gray-200"
//           }`}
//         >
//           🔊 {speakEnabled ? "Voice ON" : "Voice OFF"}
//         </button>
//       </div>

//       {listening && (
//         <div className="text-center text-red-500 text-sm animate-pulse mb-1">
//           🎙 Listening...
//         </div>
//       )}

//       <div className="flex-1 overflow-y-auto mb-4 space-y-3 p-3 bg-gray-50 rounded-lg border">
//         {messages.map((msg, idx) => (
//           <div
//             key={idx}
//             className={`p-3 rounded-xl max-w-[80%] whitespace-pre-wrap ${
//               msg.type === "user"
//                 ? "bg-green-500 text-white self-end ml-auto"
//                 : "bg-white border text-gray-800 self-start"
//             }`}
//           >
//             {msg.file && (
//               <img
//                 src={URL.createObjectURL(msg.file)}
//                 alt="upload"
//                 className="mb-2 rounded-lg max-w-full"
//               />
//             )}
//             {msg.text.split("\n").map((line, i) => (
//               <p key={i}>{line}</p>
//             ))}
//           </div>
//         ))}
//         <div ref={chatEndRef} />
//       </div>

//       <div className="flex items-center space-x-2">
//         <button
//           onClick={handleVoiceInput}
//           className={`p-2 rounded-full ${
//             listening ? "bg-red-500 text-white" : "bg-gray-200 hover:bg-gray-300"
//           }`}
//           title="Speak to Gemini"
//         >
//           🎤
//         </button>

//         <input
//           type="text"
//           placeholder="Type your message..."
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           onKeyDown={handleKeyPress}
//           className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-400"
//         />

//         <label
//           htmlFor="file-upload"
//           className="cursor-pointer bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-full"
//           title="Upload image"
//         >
//           🖼
//         </label>
//         <input
//           id="file-upload"
//           type="file"
//           accept="image/*"
//           className="hidden"
//           onChange={(e) => setFile(e.target.files[0])}
//         />

//         <button
//           onClick={() => handleSend()}
//           disabled={loading}
//           className={`px-4 py-2 rounded-full text-white ${
//             loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
//           }`}
//         >
//           {loading ? "..." : "Send"}
//         </button>
//       </div>
//     </div>
//   );
// }

// import React, { useState, useEffect, useRef } from 'react';
// import ChatInput from './ChatInput';

// const API_URL = 'http://127.0.0.1:8000/chat';

// const DiseaseDetect = ({ currentSessionId, setCurrentSessionId, chatHistory, setChatHistory }) => {
//   const [messages, setMessages] = useState([
//     {
//       sender: 'assistant',
//       text: '🌱 Welcome to AI Farmer Assistant! Ask me anything about farming, crops, soil management, pest control, and more.'
//     }
//   ]);
//   const chatEndRef = useRef(null);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const sendMessage = async (text) => {
//     setMessages(prev => [...prev, { sender: 'user', text }]);

//     const responsePlaceholder = { sender: 'assistant', text: 'Assistant is typing...', loading: true };
//     setMessages(prev => [...prev, responsePlaceholder]);

//     try {
//       const res = await fetch(API_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           question: text,
//           state: 'Telangana',
//           session_id: currentSessionId
//         })
//       });

//       const data = await res.json();
//       setCurrentSessionId(data.session_id);

//       if (!currentSessionId) {
//         setChatHistory(prev => [{ id: data.session_id, title: text.slice(0, 25) + '...' }, ...prev]);
//       }

//       setMessages(prev =>
//         prev.map(msg =>
//           msg.loading ? { sender: 'assistant', text: data.answer } : msg
//         )
//       );
//     } catch (err) {
//       setMessages(prev =>
//         prev.map(msg =>
//           msg.loading ? { sender: 'assistant', text: 'Error connecting to backend.' } : msg
//         )
//       );
//     }
//   };

//   const clearChat = () => {
//     setMessages([
//       {
//         sender: 'assistant',
//         text: '🌱 Welcome to AI Farmer Assistant! Ask me anything about farming, crops, soil management, pest control, and more.'
//       }
//     ]);
//     setCurrentSessionId(null);
//   };

//   return (
//     <div className="chat-window">
//       <div className="chat-header">
//         <h1>AI Farmer Assistant <span className="status-online">• Online</span></h1>
//         <button onClick={clearChat}>Clear Chat</button>
//       </div>
//       <div className="chat-messages">
//         {messages.map((msg, index) => (
//           <div key={index} className={`message ${msg.sender}-message`}>
//             <div className="message-icon">{msg.sender === 'user' ? '🧑‍🌾' : '🤖'}</div>
//             <div className="message-text">{msg.text}</div>
//           </div>
//         ))}
//         <div ref={chatEndRef} />
//       </div>
//       <ChatInput onSend={sendMessage} />
//     </div>
//   );
// };

// export default DiseaseDetect.jsx;









// import React, { useState, useEffect, useRef } from 'react';
// import ChatInput from './ChatInput.jsx';
// import './DiseaseDetect.css';

// const API_URL = 'http://127.0.0.1:8000/chat';

// const DiseaseDetect = ({ currentSessionId, setCurrentSessionId, chatHistory, setChatHistory }) => {
//   const [messages, setMessages] = useState([
//     {
//       sender: 'assistant',
//       text: '🌱 Welcome to AI Farmer Assistant! Ask me anything about farming, crops, soil management, pest control, and more.'
//     }
//   ]);
//   const chatEndRef = useRef(null);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const sendMessage = async (text) => {
//     setMessages(prev => [...prev, { sender: 'user', text }]);

//     const responsePlaceholder = { sender: 'assistant', text: 'Assistant is typing...', loading: true };
//     setMessages(prev => [...prev, responsePlaceholder]);

//     try {
//       const res = await fetch(API_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           question: text,
//           state: 'Telangana',
//           session_id: currentSessionId
//         })
//       });

//       const data = await res.json();
//       console.log(data);
//       setCurrentSessionId(data.session_id);

//       if (!currentSessionId) {
//         setChatHistory(prev => [{ id: data.session_id, title: text.slice(0, 25) + '...' }, ...prev]);
//       }

//       setMessages(prev =>
//         prev.map(msg =>
//           msg.loading ? { sender: 'assistant', text: data.answer } : msg
        
//         )
//       );
     
//     } catch (err) {
//       setMessages(prev =>
//         prev.map(msg =>
//           msg.loading ? { sender: 'assistant', text: 'Error connecting to backend.' } : msg
//         )
//       );
//     }
//   };

//   const clearChat = () => {
//     setMessages([
//       {
//         sender: 'assistant',
//         text: '🌱 Welcome to AI Farmer Assistant! Ask me anything about farming, crops, soil management, pest control, and more.'
//       }
//     ]);
//     setCurrentSessionId(null);
//   };

//   return (
//     <div className="chat-window">
//       <div className="chat-header">
//         <h1>AI Farmer Assistant <span className="status-online">• Online</span></h1>
//         <button onClick={clearChat}>Clear Chat</button>
//       </div>
//       <div className="chat-messages">
//         {messages.map((msg, index) => (
//           <div key={index} className={`message ${msg.sender}-message`}>
//             <div className="message-icon">{msg.sender === 'user' ? '🧑‍🌾' : '🤖'}</div>
//             <div className="message-text">{msg.text}</div>
//           </div>
//         ))}
//         <div ref={chatEndRef} />
//       </div>
//       <ChatInput onSend={sendMessage} />
//     </div>
//   );
// };

// export default DiseaseDetect; 







// import React, { useState, useEffect, useRef } from 'react';
// import ChatInput from './ChatInput.jsx';
// import './DiseaseDetect.css'; // keep your custom css if needed

// const API_URL = 'http://127.0.0.1:8000/chat';

// const DiseaseDetect = ({ currentSessionId, setCurrentSessionId, chatHistory, setChatHistory }) => {
//   const [messages, setMessages] = useState([
//     {
//       sender: 'assistant',
//       text: '🌱 Welcome to AI Farmer Assistant! Ask me anything about farming, crops, soil management, pest control, and more.'
//     }
//   ]);
//   const chatEndRef = useRef(null);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const sendMessage = async (text, imageFile = null) => {
//     setMessages(prev => [...prev, { sender: 'user', text, image: imageFile ? URL.createObjectURL(imageFile) : null }]);
//     setMessages(prev => [...prev, { sender: 'assistant', text: 'Assistant is typing...', loading: true }]);

//     try {
//       const formData = new FormData();
//       formData.append('question', text);
//       formData.append('state', 'Telangana');
//       formData.append('session_id', currentSessionId || '');
//       if (imageFile) formData.append('image', imageFile);

//       const res = await fetch(API_URL, {
//         method: 'POST',
//         body: formData
//       });

//       const data = await res.json();
//       console.log("Backend Response:", data);

//       setCurrentSessionId(data.session_id);

//       if (!currentSessionId) {
//         setChatHistory(prev => [{ id: data.session_id, title: text.slice(0, 25) + '...' }, ...prev]);
//       }

//       setMessages(prev => {
//         const updated = [...prev];
//         const idx = updated.findIndex(msg => msg.loading);
//         if (idx !== -1) {
//           updated[idx] = { sender: 'assistant', text: data.answer || 'No answer received.' };
//         }
//         return updated;
//       });

//     } catch (err) {
//       console.error("Error:", err);
//       setMessages(prev => {
//         const updated = [...prev];
//         const idx = updated.findIndex(msg => msg.loading);
//         if (idx !== -1) {
//           updated[idx] = { sender: 'assistant', text: '⚠️ Error connecting to backend.' };
//         }
//         return updated;
//       });
//     }
//   };

//   const clearChat = () => {
//     setMessages([
//       {
//         sender: 'assistant',
//         text: '🌱 Welcome to AI Farmer Assistant! Ask me anything about farming, crops, soil management, pest control, and more.'
//       }
//     ]);
//     setCurrentSessionId(null);
//   };

//   return (
//     <div className="flex flex-col max-w-2xl mx-auto h-[80vh] bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
//       {/* Header */}
//       <div className="flex justify-between items-center px-6 py-4 bg-green-600 text-white">
//         <h1 className="text-lg font-semibold">
//           AI Farmer Assistant <span className="text-sm text-green-200">• Online</span>
//         </h1>
//         <button
//           onClick={clearChat}
//           className="bg-white text-green-700 text-sm font-medium px-3 py-1 rounded-md hover:bg-green-100 transition"
//         >
//           Clear Chat
//         </button>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
//         {messages.map((msg, index) => (
//           <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
//             {msg.sender === 'assistant' && <div className="text-2xl">🤖</div>}
//             <div
//               className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
//                 msg.sender === 'user'
//                   ? 'bg-green-600 text-white rounded-br-none'
//                   : 'bg-white border border-gray-200 rounded-bl-none'
//               }`}
//             >
//               {msg.text && <p>{msg.text}</p>}
//               {msg.image && <img src={msg.image} alt="uploaded" className="mt-2 rounded-lg max-w-full" />}
//             </div>
//             {msg.sender === 'user' && <div className="text-2xl">🧑‍🌾</div>}
//           </div>
//         ))}
//         <div ref={chatEndRef} />
//       </div>

//       {/* Chat input with image upload */}
//       <ChatInput onSend={sendMessage} />
//     </div>
//   );
// };

// export default DiseaseDetect;










// import React, { useState, useEffect, useRef } from 'react';
// import ChatInput from './ChatInput.jsx';
// import './DiseaseDetect.css';

// const API_URL = 'http://127.0.0.1:8000/chat';

// const DiseaseDetect = ({ currentSessionId, setCurrentSessionId, chatHistory, setChatHistory }) => {
//   const [messages, setMessages] = useState([
//     {
//       sender: 'assistant',
//       text: '🌱 Welcome to AI Farmer Assistant! Ask me anything about farming, crops, soil management, pest control, and more.'
//     }
//   ]);
//   const chatEndRef = useRef(null);

//   // Auto-scroll to bottom when new message appears
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const sendMessage = async (text) => {
//     // Add user message
//     setMessages(prev => [...prev, { sender: 'user', text }]);

//     // Add placeholder assistant message
//     setMessages(prev => [...prev, { sender: 'assistant', text: 'Assistant is typing...', loading: true }]);

//     try {
//       // Send request to backend
//       const res = await fetch(API_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           question: text,
//           state: 'Telangana',
//           session_id: currentSessionId
//         })
//       });

//       const data = await res.json();
//       console.log("Backend Response:", data);

//       // Update session ID
//       setCurrentSessionId(data.session_id);

//       // Save new chat history if it's a new session
//       if (!currentSessionId) {
//         setChatHistory(prev => [{ id: data.session_id, title: text.slice(0, 25) + '...' }, ...prev]);
//       }

//       // Replace "Assistant is typing..." with the real response
//       setMessages(prev => {
//         const updated = [...prev];
//         const idx = updated.findIndex(msg => msg.loading);
//         if (idx !== -1) {
//           updated[idx] = { sender: 'assistant', text: data.answer || 'No answer received.' };
//         }
//         return updated;
//       });

//     } catch (err) {
//       console.error("Error:", err);
//       // Replace placeholder with error message
//       setMessages(prev => {
//         const updated = [...prev];
//         const idx = updated.findIndex(msg => msg.loading);
//         if (idx !== -1) {
//           updated[idx] = { sender: 'assistant', text: '⚠️ Error connecting to backend.' };
//         }
//         return updated;
//       });
//     }
//   };

//   // Clear chat
//   const clearChat = () => {
//     setMessages([
//       {
//         sender: 'assistant',
//         text: '🌱 Welcome to AI Farmer Assistant! Ask me anything about farming, crops, soil management, pest control, and more.'
//       }
//     ]);
//     setCurrentSessionId(null);
//   };

//   return (
//     <div className="chat-window">
//       <div className="chat-header">
//         <h1>AI Farmer Assistant <span className="status-online">• Online</span></h1>
//         <button onClick={clearChat}>Clear Chat</button>
//       </div>

//       <div className="chat-messages">
//         {messages.map((msg, index) => (
//           <div key={index} className={`message ${msg.sender}-message`}>
//             <div className="message-icon">
//               {msg.sender === 'user' ? '🧑‍🌾' : '🤖'}
//             </div>
//             <div className="message-text">{msg.text}</div>
//           </div>
//         ))}
//         <div ref={chatEndRef} />
//       </div>

//       <ChatInput onSend={sendMessage} />
//     </div>
//   );
// };

// export default DiseaseDetect;



// import React, { useState, useEffect, useRef } from 'react';
// import ChatInput from './ChatInput.jsx';
// import './DiseaseDetect.css';

// const API_URL = 'http://127.0.0.1:8000/chat';

// const DiseaseDetect = ({ currentSessionId, setCurrentSessionId, chatHistory, setChatHistory }) => {
//   const [messages, setMessages] = useState([
//     {
//       sender: 'assistant',
//       text: '🌱 Welcome to AI Farmer Assistant! Ask me anything about farming, crops, soil management, pest control, and more.'
//     }
//   ]);
//   const chatEndRef = useRef(null);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const sendMessage = async (messageData) => {
//     // Handle both text-only and {text, image}
//     const userMessage =
//       typeof messageData === 'string'
//         ? { text: messageData }
//         : { text: messageData.text, image: messageData.image };

//     // Add user message
//     setMessages(prev => [...prev, { sender: 'user', ...userMessage }]);

//     // Add placeholder assistant message
//     setMessages(prev => [...prev, { sender: 'assistant', text: 'Assistant is typing...', loading: true }]);

//     try {
//       const res = await fetch(API_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           question: userMessage.text,
//           state: 'Telangana',
//           session_id: currentSessionId
//         })
//       });

//       const data = await res.json();
//       console.log("Backend Response:", data);

//       setCurrentSessionId(data.session_id);

//       if (!currentSessionId) {
//         setChatHistory(prev => [{ id: data.session_id, title: userMessage.text.slice(0, 25) + '...' }, ...prev]);
//       }

//       // Replace placeholder with real response
//       setMessages(prev => {
//         const updated = [...prev];
//         const idx = updated.findIndex(msg => msg.loading);
//         if (idx !== -1) {
//           updated[idx] = { sender: 'assistant', text: data.answer || 'No answer received.' };
//         }
//         return updated;
//       });
//     } catch (err) {
//       console.error("Error:", err);
//       setMessages(prev => {
//         const updated = [...prev];
//         const idx = updated.findIndex(msg => msg.loading);
//         if (idx !== -1) {
//           updated[idx] = { sender: 'assistant', text: '⚠️ Error connecting to backend.' };
//         }
//         return updated;
//       });
//     }
//   };

//   const clearChat = () => {
//     setMessages([
//       {
//         sender: 'assistant',
//         text: '🌱 Welcome to AI Farmer Assistant! Ask me anything about farming, crops, soil management, pest control, and more.'
//       }
//     ]);
//     setCurrentSessionId(null);
//   };

//   return (
//     <div className="chat-window">
//       <div className="chat-header">
//         <h1>AI Farmer Assistant <span className="status-online">• Online</span></h1>
//         <button onClick={clearChat}>Clear Chat</button>
//       </div>

//       <div className="chat-messages">
//         {messages.map((msg, index) => (
//           <div key={index} className={`message ${msg.sender}-message`}>
//             <div className="message-icon">
//               {msg.sender === 'user' ? '🧑‍🌾' : '🤖'}
//             </div>
//             <div className="message-content">
//               {msg.image && (
//                 <img
//                   src={msg.image}
//                   alt="uploaded"
//                   className="rounded-lg max-h-40 object-cover mb-2 border border-green-200"
//                 />
//               )}
//               <div className="message-text">{msg.text}</div>
//             </div>
//           </div>
//         ))}
//         <div ref={chatEndRef} />
//       </div>

//       <ChatInput onSend={sendMessage} />
//     </div>
//   );
// };

// export default DiseaseDetect;



// import React, { useState, useEffect, useRef } from 'react';
// import ChatInput from './ChatInput.jsx';
// import './DiseaseDetect.css';

// const API_URL = 'http://127.0.0.1:8000/chat';

// const DiseaseDetect = ({ currentSessionId, setCurrentSessionId, chatHistory, setChatHistory }) => {
//   const [messages, setMessages] = useState([
//     {
//       sender: 'assistant',
//       text: '🌱 Welcome to AI Farmer Assistant! Ask me anything about farming, crops, soil management, pest control, and more.'
//     }
//   ]);
//   const chatEndRef = useRef(null);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const sendMessage = async (messageData) => {
//     const userMessage =
//       typeof messageData === 'string'
//         ? { text: messageData }
//         : { text: messageData.text, images: messageData.images || [] };

//     // Add user message (with images)
//     setMessages(prev => [...prev, { sender: 'user', ...userMessage }]);

//     // Add placeholder assistant message
//     setMessages(prev => [...prev, { sender: 'assistant', text: 'Assistant is typing...', loading: true }]);

//     try {
//       const res = await fetch(API_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           question: userMessage.text,
//           state: 'Telangana',
//           session_id: currentSessionId
//         })
//       });

//       const data = await res.json();
//       console.log("Backend Response:", data);

//       setCurrentSessionId(data.session_id);

//       if (!currentSessionId) {
//         setChatHistory(prev => [{ id: data.session_id, title: userMessage.text.slice(0, 25) + '...' }, ...prev]);
//       }

//       // Replace placeholder with real response
//       setMessages(prev => {
//         const updated = [...prev];
//         const idx = updated.findIndex(msg => msg.loading);
//         if (idx !== -1) {
//           updated[idx] = { sender: 'assistant', text: data.answer || 'No answer received.' };
//         }
//         return updated;
//       });
//     } catch (err) {
//       console.error("Error:", err);
//       setMessages(prev => {
//         const updated = [...prev];
//         const idx = updated.findIndex(msg => msg.loading);
//         if (idx !== -1) {
//           updated[idx] = { sender: 'assistant', text: '⚠️ Error connecting to backend.' };
//         }
//         return updated;
//       });
//     }
//   };

//   const clearChat = () => {
//     setMessages([
//       {
//         sender: 'assistant',
//         text: '🌱 Welcome to AI Farmer Assistant! Ask me anything about farming, crops, soil management, pest control, and more.'
//       }
//     ]);
//     setCurrentSessionId(null);
//   };

//   return (
//     <div className="chat-window">
//       <div className="chat-header">
//         <h1>AI Farmer Assistant <span className="status-online">• Online</span></h1>
//         <button onClick={clearChat}>Clear Chat</button>
//       </div>

//       <div className="chat-messages">
//         {messages.map((msg, index) => (
//           <div key={index} className={`message ${msg.sender}-message`}>
//             <div className="message-icon">
//               {msg.sender === 'user' ? '🧑‍🌾' : '🤖'}
//             </div>
//             <div className="message-content">
//               {/* Display multiple images */}
//               {msg.images && msg.images.length > 0 && (
//                 <div className="flex flex-wrap gap-2 mb-2">
//                   {msg.images.map((img, i) => (
//                     <img
//                       key={i}
//                       src={img}
//                       alt="uploaded"
//                       className="rounded-lg max-h-32 object-cover border border-green-200"
//                     />
//                   ))}
//                 </div>
//               )}
//               <div className="message-text">{msg.text}</div>
//             </div>
//           </div>
//         ))}
//         <div ref={chatEndRef} />
//       </div>

//       <ChatInput onSend={sendMessage} />
//     </div>
//   );
// };

// export default DiseaseDetect;

// import React, { useState, useEffect, useRef } from "react";
// import ChatInput from "./ChatInput.jsx";
// import "./DiseaseDetect.css";

// const API_URL = "http://127.0.0.1:8000/chat";

// const DiseaseDetect = ({
//   currentSessionId,
//   setCurrentSessionId,
//   chatHistory,
//   setChatHistory,
// }) => {
//   const [messages, setMessages] = useState([
//     {
//       sender: "assistant",
//       text: "🌱 Welcome to AI Farmer Assistant! Ask me anything about farming, crops, soil management, pest control, and more.",
//     },
//   ]);
//   const chatEndRef = useRef(null);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = async (input) => {
//     const messageText = typeof input === "string" ? input : input.text;
//     const messageImage = typeof input === "object" ? input.image : null;

//     // Add user message
//     setMessages((prev) => [
//       ...prev,
//       { sender: "user", text: messageText, image: messageImage },
//     ]);

//     // Add typing indicator
//     setMessages((prev) => [
//       ...prev,
//       { sender: "assistant", text: "Assistant is typing...", loading: true },
//     ]);

//     try {
//       const res = await fetch(API_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           question: messageText,
//           state: "Telangana",
//           session_id: currentSessionId,
//         }),
//       });

//       const data = await res.json();
//       console.log("Backend Response:", data);

//       setCurrentSessionId(data.session_id);

//       if (!currentSessionId) {
//         setChatHistory((prev) => [
//           { id: data.session_id, title: messageText.slice(0, 25) + "..." },
//           ...prev,
//         ]);
//       }

//       setMessages((prev) => {
//         const updated = [...prev];
//         const idx = updated.findIndex((msg) => msg.loading);
//         if (idx !== -1) {
//           updated[idx] = {
//             sender: "assistant",
//             text: data.answer || "No answer received.",
//           };
//         }
//         return updated;
//       });
//     } catch (err) {
//       console.error("Error:", err);
//       setMessages((prev) => {
//         const updated = [...prev];
//         const idx = updated.findIndex((msg) => msg.loading);
//         if (idx !== -1) {
//           updated[idx] = {
//             sender: "assistant",
//             text: "⚠️ Error connecting to backend.",
//           };
//         }
//         return updated;
//       });
//     }
//   };

//   const clearChat = () => {
//     setMessages([
//       {
//         sender: "assistant",
//         text: "🌱 Welcome to AI Farmer Assistant! Ask me anything about farming, crops, soil management, pest control, and more.",
//       },
//     ]);
//     setCurrentSessionId(null);
//   };

//   return (
//     <div className="chat-window">
//       <div className="chat-header">
//         <h1>
//           AI Farmer Assistant <span className="status-online">• Online</span>
//         </h1>
//         <button onClick={clearChat}>Clear Chat</button>
//       </div>

//       <div className="chat-messages">
//         {messages.map((msg, index) => (
//           <div key={index} className={`message ${msg.sender}-message`}>
//             <div className="message-icon">
//               {msg.sender === "user" ? "🧑‍🌾" : "🤖"}
//             </div>
//             <div className="message-content">
//               {msg.image && (
//                 <img
//                   src={msg.image}
//                   alt="upload"
//                   className="rounded-lg max-h-40 object-cover mb-2 border border-green-200"
//                 />
//               )}
//               <div className="message-text">{msg.text}</div>
//             </div>
//           </div>
//         ))}
//         <div ref={chatEndRef} />
//       </div>

//       <ChatInput onSend={sendMessage} />
//     </div>
//   );
// };

// export default DiseaseDetect;



import React, { useState, useEffect, useRef } from "react";
import ChatInput from "./ChatInput.jsx";

const API_URL = "http://127.0.0.1:8000/chat";

const DiseaseDetect = ({
  currentSessionId,
  setCurrentSessionId,
  chatHistory,
  setChatHistory,
}) => {
  const [messages, setMessages] = useState([
    {
      sender: "assistant",
      text: "🌱 Welcome to AI Farmer Assistant! Ask me anything about farming, crops, soil management, pest control, and more.",
    },
  ]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (input) => {
    const messageText = typeof input === "string" ? input : input.text;
    const messageImage = typeof input === "object" ? input.image : null;

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: messageText, image: messageImage },
    ]);

    setMessages((prev) => [
      ...prev,
      { sender: "assistant", text: "Assistant is typing...", loading: true },
    ]);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: messageText,
          state: "Telangana",
          session_id: currentSessionId,
        }),
      });

      const data = await res.json();
      console.log("Backend Response:", data);

      setCurrentSessionId(data.session_id);

      if (!currentSessionId) {
        setChatHistory((prev) => [
          { id: data.session_id, title: messageText.slice(0, 25) + "..." },
          ...prev,
        ]);
      }

      setMessages((prev) => {
        const updated = [...prev];
        const idx = updated.findIndex((msg) => msg.loading);
        if (idx !== -1) {
          updated[idx] = {
            sender: "assistant",
            text: data.answer || "No answer received.",
          };
        }
        return updated;
      });
    } catch (err) {
      console.error("Error:", err);
      setMessages((prev) => {
        const updated = [...prev];
        const idx = updated.findIndex((msg) => msg.loading);
        if (idx !== -1) {
          updated[idx] = {
            sender: "assistant",
            text: "⚠️ Error connecting to backend.",
          };
        }
        return updated;
      });
    }
  };

  const clearChat = () => {
    setMessages([
      {
        sender: "assistant",
        text: "🌱 Welcome to AI Farmer Assistant! Ask me anything about farming, crops, soil management, pest control, and more.",
      },
    ]);
    setCurrentSessionId(null);
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto bg-green-50 shadow-md rounded-xl border border-green-200">
      {/* Header */}
      <div className="flex justify-between items-center bg-green-600 text-white px-5 py-3 rounded-t-xl">
        <h1 className="font-semibold text-lg flex items-center gap-2">
          🌾 AI Farmer Assistant <span className="text-green-200 text-sm">• Online</span>
        </h1>
        <button
          onClick={clearChat}
          className="bg-green-800 hover:bg-green-700 text-white text-sm px-3 py-1 rounded-md transition"
        >
          Clear Chat
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-green-100">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "assistant" && (
              <div className="text-2xl">🤖</div>
            )}
            <div
              className={`max-w-xs md:max-w-sm px-4 py-3 rounded-2xl shadow-sm ${
                msg.sender === "user"
                  ? "bg-green-500 text-white"
                  : "bg-white text-gray-800 border border-green-200"
              }`}
            >
              {msg.image && (
                <img
                  src={msg.image}
                  alt="upload"
                  className="rounded-lg max-h-40 object-cover mb-2 border border-green-200"
                />
              )}
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
            {msg.sender === "user" && (
              <div className="text-2xl">🧑‍🌾</div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Chat Input */}
      <div className="border-t border-green-300 bg-white rounded-b-xl">
        <ChatInput onSend={sendMessage} />
      </div>
    </div>
  );
};

export default DiseaseDetect;



// // DiseaseDetect.jsx
// // DiseaseDetect.jsx
//import React, { useState, useEffect, useRef } from "react";
//import ChatInput from "./ChatInput.jsx";
// import "./DiseaseDetect.css";
// import React, { useState, useEffect, useRef } from "react";
// import ChatInput from "./ChatInput.jsx";
// import "./DiseaseDetect.css";

// const API_URL = "http://127.0.0.1:8000/chat";

// const DiseaseDetect = ({
//   currentSessionId,
//   setCurrentSessionId,
//   chatHistory,
//   setChatHistory,
// }) => {
//   const [messages, setMessages] = useState([
//     {
//       sender: "assistant",
//       text: "🌱 Welcome to AI Farmer Assistant! Ask me anything about farming, crops, soil management, pest control, and more.",
//     },
//   ]);
//   const [userState, setUserState] = useState("Telangana");
//   const chatEndRef = useRef(null);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = async (input) => {
//     const messageText = typeof input === "string" ? input : input.text;
//     const messageImage = typeof input === "object" ? input.image : null;

//     // Add user message
//     setMessages((prev) => [
//       ...prev,
//       { sender: "user", text: messageText, image: messageImage },
//     ]);

//     // Typing placeholder
//     setMessages((prev) => [
//       ...prev,
//       { sender: "assistant", text: "Assistant is typing...", loading: true },
//     ]);

//     try {
//       const res = await fetch(API_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           question: messageText,
//           image: messageImage, // ✅ Base64 sent to backend
//           state: userState,
//           session_id: currentSessionId,
//         }),
//       });

//       const data = await res.json();
//       console.log("Backend Response:", data);

//       setCurrentSessionId(data.session_id);

//       if (!currentSessionId) {
//         setChatHistory((prev) => [
//           { id: data.session_id, title: messageText.slice(0, 25) + "..." },
//           ...prev,
//         ]);
//       }

//       // Replace typing placeholder with actual response
//       setMessages((prev) => {
//         const updated = [...prev];
//         const idx = updated.findIndex((msg) => msg.loading);
//         if (idx !== -1) {
//           updated[idx] = {
//             sender: "assistant",
//             text: data.answer || "No answer received.",
//           };
//         }
//         return updated;
//       });
//     } catch (err) {
//       console.error("Error:", err);
//       setMessages((prev) => {
//         const updated = [...prev];
//         const idx = updated.findIndex((msg) => msg.loading);
//         if (idx !== -1) {
//           updated[idx] = {
//             sender: "assistant",
//             text: "⚠️ Error connecting to backend.",
//           };
//         }
//         return updated;
//       });
//     }
//   };

//   const clearChat = () => {
//     setMessages([
//       {
//         sender: "assistant",
//         text: "🌱 Welcome to AI Farmer Assistant! Ask me anything about farming, crops, soil management, pest control, and more.",
//       },
//     ]);
//     setCurrentSessionId(null);
//   };

//   return (
//     <div className="flex flex-col w-full max-w-3xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden border border-green-200">
//       {/* Header */}
//       <div className="flex items-center justify-between bg-green-100 p-3 border-b border-green-200">
//         <h1 className="text-lg font-semibold text-green-700">
//           AI Farmer Assistant <span className="text-green-500">• Online</span>
//         </h1>
//         <div className="flex gap-2 items-center">
//           <select
//             value={userState}
//             onChange={(e) => setUserState(e.target.value)}
//             className="border border-green-300 rounded-md p-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
//           >
//             <option value="Telangana">Telangana</option>
//             <option value="Andhra Pradesh">Andhra Pradesh</option>
//             <option value="Karnataka">Karnataka</option>
//             <option value="Tamil Nadu">Tamil Nadu</option>
//           </select>
//           <button
//             onClick={clearChat}
//             className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm"
//           >
//             Clear Chat
//           </button>
//         </div>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`flex ${
//               msg.sender === "user" ? "justify-end" : "justify-start"
//             }`}
//           >
//             <div
//               className={`max-w-xs p-3 rounded-lg shadow-sm ${
//                 msg.sender === "user"
//                   ? "bg-green-200 text-right"
//                   : "bg-gray-100 text-left"
//               }`}
//             >
//               <div className="text-sm flex flex-col items-start">
//                 {msg.image && (
//                   <img
//                     src={msg.image}
//                     alt="upload"
//                     className="rounded-lg max-h-40 object-cover mb-2 border border-green-200"
//                   />
//                 )}
//                 <span>{msg.text}</span>
//               </div>
//             </div>
//           </div>
//         ))}
//         <div ref={chatEndRef} />
//       </div>

//       {/* Input Area */}
//       <ChatInput onSend={sendMessage} />
//     </div>
//   );
// };

// export default DiseaseDetect;


// import React, { useState, useEffect, useRef } from "react";
// import ChatInput from "./ChatInput.jsx";
// import "./DiseaseDetect.css";

// const API_URL = "http://127.0.0.1:8000/chat";

// const DiseaseDetect = ({
//   currentSessionId,
//   setCurrentSessionId,
//   chatHistory,
//   setChatHistory,
// }) => {
//   const [messages, setMessages] = useState([
//     {
//       sender: "assistant",
//       text: "🌱 Welcome to AI Farmer Assistant! Ask me anything about farming, crops, soil management, pest control, and more.",
//     },
//   ]);
//   const [userState, setUserState] = useState("Telangana");
//   const chatEndRef = useRef(null);

//   // Auto-scroll to bottom on new messages
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = async (input) => {
//     const messageText = typeof input === "string" ? input : input.text;
//     const messageImage = typeof input === "object" ? input.image : null;

//     // Add user message
//     setMessages((prev) => [
//       ...prev,
//       { sender: "user", text: messageText, image: messageImage },
//     ]);

//     // Add typing placeholder
//     setMessages((prev) => [
//       ...prev,
//       { sender: "assistant", text: "Assistant is typing...", loading: true },
//     ]);

//     try {
//       const res = await fetch(API_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           question: messageText,
//           image: messageImage, // Base64 sent to backend
//           state: userState,
//           session_id: currentSessionId,
//         }),
//       });

//       const data = await res.json();
//       console.log("Backend Response:", data);

//       setCurrentSessionId(data.session_id);

//       if (!currentSessionId) {
//         setChatHistory((prev) => [
//           { id: data.session_id, title: messageText.slice(0, 25) + "..." },
//           ...prev,
//         ]);
//       }

//       // Replace typing placeholder with real response
//       setMessages((prev) => {
//         const updated = [...prev];
//         const idx = updated.findIndex((msg) => msg.loading);
//         if (idx !== -1) {
//           updated[idx] = {
//             sender: "assistant",
//             text: data.answer || "No answer received.",
//           };
//         }
//         return updated;
//       });
//     } catch (err) {
//       console.error("Error:", err);
//       setMessages((prev) => {
//         const updated = [...prev];
//         const idx = updated.findIndex((msg) => msg.loading);
//         if (idx !== -1) {
//           updated[idx] = {
//             sender: "assistant",
//             text: "⚠️ Error connecting to backend.",
//           };
//         }
//         return updated;
//       });
//     }
//   };

//   const clearChat = () => {
//     setMessages([
//       {
//         sender: "assistant",
//         text: "🌱 Welcome to AI Farmer Assistant! Ask me anything about farming, crops, soil management, pest control, and more.",
//       },
//     ]);
//     setCurrentSessionId(null);
//   };

//   return (
//     <div className="flex flex-col w-full max-w-3xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden border border-green-200">
//       {/* Header */}
//       <div className="flex items-center justify-between bg-green-100 p-3 border-b border-green-200">
//         <h1 className="text-lg font-semibold text-green-700">
//           AI Farmer Assistant <span className="text-green-500">• Online</span>
//         </h1>
//         <div className="flex gap-2 items-center">
//           <select
//             value={userState}
//             onChange={(e) => setUserState(e.target.value)}
//             className="border border-green-300 rounded-md p-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
//           >
//             <option value="Telangana">Telangana</option>
//             <option value="Andhra Pradesh">Andhra Pradesh</option>
//             <option value="Karnataka">Karnataka</option>
//             <option value="Tamil Nadu">Tamil Nadu</option>
//           </select>
//           <button
//             onClick={clearChat}
//             className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm"
//           >
//             Clear Chat
//           </button>
//         </div>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`flex ${
//               msg.sender === "user" ? "justify-end" : "justify-start"
//             }`}
//           >
//             <div
//               className={`max-w-xs p-3 rounded-lg shadow-sm ${
//                 msg.sender === "user"
//                   ? "bg-green-200 text-right"
//                   : "bg-gray-100 text-left"
//               }`}
//             >
//               <div className="text-sm flex flex-col items-start">
//                 {msg.image && (
//                   <img
//                     src={msg.image}
//                     alt="upload"
//                     className="rounded-lg max-h-40 object-cover mb-2 border border-green-200"
//                   />
//                 )}
//                 <span>{msg.text}</span>
//               </div>
//             </div>
//           </div>
//         ))}
//         <div ref={chatEndRef} />
//       </div>

//       {/* Input */}
//       <ChatInput onSend={sendMessage} />
//     </div>
//   );
// };

// export default DiseaseDetect;
