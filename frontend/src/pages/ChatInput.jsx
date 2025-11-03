// // 
// import React, { useState } from 'react';
// import './ChatInput.css';

// const ChatInput = ({ onSend }) => {
//   const [input, setInput] = useState('');

//   const handleSend = () => {
//     if (!input.trim()) return;
//     onSend(input);
//     setInput('');
//   };

//   return (
//     <div className="chat-input-area">
//       <input
//         type="text"
//         placeholder="Type your farming question here..."
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         onKeyPress={(e) => e.key === 'Enter' && handleSend()}
//       />
//       <button onClick={handleSend}>➤</button>
//     </div>
//   );
// };

// export default ChatInput;



// import React, { useState } from 'react';

// const ChatInput = ({ onSend }) => {
//   const [input, setInput] = useState('');
//   const [image, setImage] = useState(null);

//   const handleSend = () => {
//     if (!input.trim() && !image) return;

//     if (image) {
//       onSend({ text: input || '📸 Image uploaded', image });
//       setImage(null);
//     } else {
//       onSend(input);
//     }

//     setInput('');
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(file);
//     }
//   };

//   return (
//     <div className="flex items-center gap-2 p-3 bg-white border-t border-gray-300 shadow-sm">
//       {/* Image upload button */}
//       <label className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full hover:bg-green-200 cursor-pointer">
//         <input
//           type="file"
//           accept="image/*"
//           className="hidden"
//           onChange={handleImageUpload}
//         />
//         📷
//       </label>

//       {/* Text input */}
//       <input
//         type="text"
//         placeholder="Type your farming question here..."
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         onKeyPress={(e) => e.key === 'Enter' && handleSend()}
//         className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400"
//       />

//       {/* Send button */}
//       <button
//         onClick={handleSend}
//         className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition"
//       >
//         ➤
//       </button>
//     </div>
//   );
// };

// export default ChatInput;



// import React, { useState } from "react";
// import "./ChatInput.css";

// const ChatInput = ({ onSend }) => {
//   const [input, setInput] = useState("");
//   const [image, setImage] = useState("");

//   const handleSend = () => {
//     if (!input.trim() && !image.trim()) return;

//     // Send object if there's an image
//     if (image.trim()) {
//       onSend({ text: input.trim(), image });
//     } else {
//       onSend(input.trim());
//     }

//     setInput("");
//     setImage("");
//   };

//   return (
//     <div className="chat-input-area">
//       <input
//         type="text"
//         placeholder="Type your farming question here..."
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//       />

//       <input
//         type="text"
//         placeholder="Image URL (optional)"
//         value={image}
//         onChange={(e) => setImage(e.target.value)}
//       />

//       <button onClick={handleSend}>Send</button>
//     </div>
//   );
// };

// export default ChatInput;




// import React, { useState } from "react";

// const ChatInput = ({ onSend }) => {
//   const [input, setInput] = useState("");
//   const [image, setImage] = useState(null);

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setImage(imageUrl);
//     }
//   };

//   const handleSend = () => {
//     if (!input.trim() && !image) return;

//     if (image) {
//       onSend({ text: input.trim(), image });
//     } else {
//       onSend(input.trim());
//     }

//     setInput("");
//     setImage(null);
//   };

//   return (
//     <div className="p-4 bg-green-100 flex flex-col gap-3 border-t border-green-200">
//       <div className="flex gap-2 items-center">
//         <input
//           type="text"
//           placeholder="Type your farming question..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           className="flex-1 px-4 py-2 rounded-lg border border-green-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
//         />

//         <label className="cursor-pointer bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition">
//           📷
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleFileUpload}
//             className="hidden"
//           />
//         </label>

//         <button
//           onClick={handleSend}
//           className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
//         >
//           Send
//         </button>
//       </div>

//       {image && (
//         <div className="relative mt-2">
//           <img
//             src={image}
//             alt="preview"
//             className="rounded-lg max-h-40 object-cover border border-green-200"
//           />
//           <button
//             onClick={() => setImage(null)}
//             className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
//           >
//             ✕
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatInput;

// import React, { useState } from "react";

// const ChatInput = ({ onSend }) => {
//   const [input, setInput] = useState("");
//   const [image, setImage] = useState(null);

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setImage(imageUrl);
//     }
//   };

//   const handleSend = () => {
//     if (!input.trim() && !image) return;

//     if (image) {
//       onSend({ text: input.trim(), image });
//     } else {
//       onSend(input.trim());
//     }

//     setInput("");
//     setImage(null);
//   };

//   return (
//     <div className="p-4 bg-green-100 flex flex-col gap-3 border-t border-green-200">
//       <div className="flex gap-2 items-center">
//         <input
//           type="text"
//           placeholder="Type your farming question..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           className="flex-1 px-4 py-2 rounded-lg border border-green-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
//         />

//         <label className="cursor-pointer bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition">
//           📷
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleFileUpload}
//             className="hidden"
//           />
//         </label>

//         <button
//           onClick={handleSend}
//           className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
//         >
//           Send
//         </button>
//       </div>

//       {image && (
//         <div className="relative mt-2">
//           <img
//             src={image}
//             alt="preview"
//             className="rounded-lg max-h-40 object-cover border border-green-200"
//           />
//           <button
//             onClick={() => setImage(null)}
//             className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
//           >
//             ✕
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatInput;
// import React, { useState } from "react";

// const ChatInput = ({ onSend }) => {
//   const [input, setInput] = useState("");
//   const [images, setImages] = useState([]);

//   const handleFileUpload = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length > 0) {
//       const imageUrls = files.map((file) => URL.createObjectURL(file));
//       setImages((prev) => [...prev, ...imageUrls]);
//     }
//   };

//   const handleSend = () => {
//     if (!input.trim() && images.length === 0) return;

//     // Send text + multiple images
//     if (images.length > 0) {
//       onSend({ text: input.trim(), images });
//     } else {
//       onSend(input.trim());
//     }

//     setInput("");
//     setImages([]); // clear image preview after send
//   };

//   const removeImage = (index) => {
//     setImages((prev) => prev.filter((_, i) => i !== index));
//   };

//   return (
//     <div className="p-4 bg-green-100 flex flex-col gap-3 border-t border-green-200">
//       <div className="flex gap-2 items-center">
//         <input
//           type="text"
//           placeholder="Type your farming question..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           className="flex-1 px-4 py-2 rounded-lg border border-green-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
//         />

//         <label className="cursor-pointer bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition">
//           📷
//           <input
//             type="file"
//             accept="image/*"
//             multiple
//             onChange={handleFileUpload}
//             className="hidden"
//           />
//         </label>

//         <button
//           onClick={handleSend}
//           className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
//         >
//           Send
//         </button>
//       </div>

//       {/* Show image previews */}
//       {images.length > 0 && (
//         <div className="flex flex-wrap gap-3 mt-2">
//           {images.map((img, index) => (
//             <div key={index} className="relative">
//               <img
//                 src={img}
//                 alt="preview"
//                 className="rounded-lg max-h-32 object-cover border border-green-200"
//               />
//               <button
//                 onClick={() => removeImage(index)}
//                 className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
//               >
//                 ✕
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatInput;



// 
// import React, { useState } from "react";

// const ChatInput = ({ onSend }) => {
//   const [input, setInput] = useState("");
//   const [image, setImage] = useState(null);

//   // Convert image to Base64
//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImage(reader.result); // Base64 string
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSend = () => {
//     if (!input.trim() && !image) return;

//     if (image) {
//       onSend({ text: input.trim(), image });
//     } else {
//       onSend(input.trim());
//     }

//     setInput("");
//     setImage(null);
//   };

//   return (
//     <div className="p-4 bg-green-100 flex flex-col gap-3 border-t border-green-200">
//       <div className="flex gap-2 items-center">
//         <input
//           type="text"
//           placeholder="Type your farming question..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           className="flex-1 px-4 py-2 rounded-lg border border-green-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
//         />

//         <label className="cursor-pointer bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition">
//           📷
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleFileUpload}
//             className="hidden"
//           />
//         </label>

//         <button
//           onClick={handleSend}
//           className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
//         >
//           Send
//         </button>
//       </div>

//       {image && (
//         <div className="relative mt-2">
//           <img
//             src={image}
//             alt="preview"
//             className="rounded-lg max-h-40 object-cover border border-green-200"
//           />
//           <button
//             onClick={() => setImage(null)}
//             className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
//           >
//             ✕
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatInput;


// import React, { useState } from "react";

// const ChatInput = ({ onSend }) => {
//   const [input, setInput] = useState("");
//   const [image, setImage] = useState(null);

//   // Convert uploaded image to Base64
//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImage(reader.result); // Base64 string
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSend = () => {
//     if (!input.trim() && !image) return;

//     // Pass object if image exists, else just text
//     if (image) {
//       onSend({ text: input.trim(), image });
//     } else {
//       onSend(input.trim());
//     }

//     // Reset input and image for next message
//     setInput("");
//     setImage(null);
//   };

//   return (
//     <div className="p-4 bg-green-100 flex flex-col gap-3 border-t border-green-200">
//       <div className="flex gap-2 items-center">
//         <input
//           type="text"
//           placeholder="Type your farming question..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           className="flex-1 px-4 py-2 rounded-lg border border-green-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
//         />

//         <label className="cursor-pointer bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition">
//           📷
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleFileUpload}
//             className="hidden"
//           />
//         </label>

//         <button
//           onClick={handleSend}
//           className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
//         >
//           Send
//         </button>
//       </div>

//       {image && (
//         <div className="relative mt-2">
//           <img
//             src={image}
//             alt="preview"
//             className="rounded-lg max-h-40 object-cover border border-green-200"
//           />
//           <button
//             onClick={() => setImage(null)}
//             className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
//           >
//             ✕
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatInput;
// import React, { useState } from 'react';
// import './ChatInput.css';

// const ChatInput = ({ onSend }) => {
//   const [input, setInput] = useState('');

//   const handleSend = () => {
//     if (!input.trim()) return;
//     onSend(input);
//     setInput('');
//   };

//   return (
//     <div className="chat-input-area">
//       <input
//         type="text"
//         placeholder="Type your farming question here..."
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         onKeyPress={(e) => e.key === 'Enter' && handleSend()}
//       />
//       <button onClick={handleSend}>➤</button>
//     </div>
//   );
// };

// export default ChatInput;
import React, { useState } from 'react';
import './ChatInput.css';

const ChatInput = ({ onSend }) => {
  const [input, setInput] = useState('');
  const [image, setImage] = useState(null);

  // Convert uploaded image to Base64
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = () => {
    if (!input.trim() && !image) return;

    if (image) {
      onSend({ text: input.trim(), image }); // send object if image exists
    } else {
      onSend(input.trim()); // else send text only
    }

    setInput('');
    setImage(null); // reset image after sending
  };

  return (
    <div className="p-4 flex flex-col gap-2 border-t border-gray-300 bg-gray-100">
      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Type your farming question here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        {/* Upload Button */}
        <label className="cursor-pointer bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition">
          📷
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        <button
          onClick={handleSend}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          ➤
        </button>
      </div>

      {/* Image Preview */}
      {image && (
        <div className="relative mt-2">
          <img
            src={image}
            alt="preview"
            className="rounded-lg max-h-40 object-cover border border-gray-300"
          />
          <button
            onClick={() => setImage(null)}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatInput;

