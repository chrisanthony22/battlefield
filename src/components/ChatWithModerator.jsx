import React, { useEffect, useState, useRef } from "react";
import { db, ref } from "../firebase/firebase";
import { onValue, push, set } from "firebase/database";
import "./ChatWithModerator.css";
import { FaUser, FaCamera, FaImage } from "react-icons/fa";
import { Link } from "react-router-dom";

const MODERATOR_TEAMNAME = "d'moderator";

const CLOUDINARY_CLOUD_NAME = "dyigdllth";
const UPLOAD_PRESET = "battlefield_images";

function ChatWithModerator() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const userStr = localStorage.getItem("loggedInUser");
    if (!userStr) return;
    setLoggedInUser(JSON.parse(userStr));
  }, []);

  useEffect(() => {
    if (!loggedInUser) return;

    const userTeamname = loggedInUser.teamname;
    const convRef = ref(db, "conversations");

    const unsubscribe = onValue(convRef, async (snapshot) => {
      const data = snapshot.val() || {};
      let modConv = Object.entries(data)
        .filter(
          ([id, conv]) =>
            conv.participants &&
            conv.participants[userTeamname] &&
            conv.participants[MODERATOR_TEAMNAME]
        )
        .map(([id, conv]) => ({ id, ...conv }));

      if (modConv.length === 0) {
        // Create chat if not exists
        const newConvRef = push(convRef);
        const welcomeMessage = {
          sender: MODERATOR_TEAMNAME,
          text: "Welcome! This is your chat with the moderator.",
          timestamp: Date.now(),
        };

        await set(newConvRef, {
          participants: {
            [userTeamname]: true,
            [MODERATOR_TEAMNAME]: true,
          },
          lastMessage: welcomeMessage,
          messages: {
            [push(ref(db)).key]: welcomeMessage,
          },
        });

        return;
      }

      setActiveConversation(modConv[0]);
    });

    return () => unsubscribe();
  }, [loggedInUser]);

  useEffect(() => {
    if (!activeConversation) {
      setMessages([]);
      return;
    }
    const messagesRef = ref(db, `conversations/${activeConversation.id}/messages`);

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val() || {};
      const msgs = Object.entries(data)
        .map(([id, msg]) => ({ id, ...msg }))
        .sort((a, b) => a.timestamp - b.timestamp);
      setMessages(msgs);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });

    return () => unsubscribe();
  }, [activeConversation]);

  const uploadToCloudinary = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) {
      setUploading(false);
      throw new Error("Image upload failed");
    }

    const data = await res.json();
    setUploading(false);
    return data.secure_url;
  };

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && !imageFile) || !activeConversation) return;

    let imageUrl = null;

    try {
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }
    } catch (err) {
      alert("Failed to upload image: " + err.message);
      return;
    }

    const msgObj = {
      sender: loggedInUser.teamname,
      text: imageUrl ? "" : newMessage.trim(),
      image: imageUrl || null,
      timestamp: Date.now(),
    };

    const messagesRef = ref(db, `conversations/${activeConversation.id}/messages`);
    const newMsgRef = push(messagesRef);
    await set(newMsgRef, msgObj);

    const convRef = ref(db, `conversations/${activeConversation.id}/lastMessage`);
    await set(convRef, {
      ...msgObj,
      text: msgObj.image ? "[Image]" : msgObj.text,
    });

    setNewMessage("");
    setImageFile(null);
  };

  const formatTimestamp = (ts) => {
    const date = new Date(ts);
    return date.toLocaleString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      month: "short",
      day: "numeric",
    });
  };

  const truncateFilename = (name) => {
    return name.length > 20 ? name.substring(0, 20) + "..." : name;
  };

  if (!loggedInUser) {
    return (
      <p style={{ color: "white" }}>
        Please <Link to="/" style={{ color: "#00f", textDecoration: "underline" }}>log in</Link> first to enable chatting.
      </p>
    );
  }

  return (
    <div className="chat-container">
      {activeConversation && (
        <div className="messages-pane">
          <div className="messages-header">
            Chat with Moderator
          </div>

          <div className="messages-list">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message-wrapper ${msg.sender === loggedInUser.teamname ? "sent" : "received"}`}
              >
                <div className={`message-item ${msg.sender === loggedInUser.teamname ? "sent" : "received"}`}>
                  <div className="message-sender">{msg.sender}</div>
                  {msg.image ? (
                    <img
                      src={msg.image}
                      alt="sent"
                      style={{
                        maxWidth: "200px",
                        borderRadius: "10px",
                        marginTop: "5px",
                        cursor: "pointer",
                      }}
                      onClick={() => setPreviewImage(msg.image)}
                    />
                  ) : (
                    <div className="message-text">{msg.text}</div>
                  )}
                  <div className="message-timestamp">
                    {formatTimestamp(msg.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="send-message-form">
            <div className="input-row">
              <input
                className="message-field"
                type="text"
                placeholder="Type your message ..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
                disabled={uploading}
              />

              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImageFile(e.target.files[0]);
                    setNewMessage("");
                  }
                }}
                disabled={uploading}
                style={{ display: "none" }}
              />

              <label htmlFor="image-upload" className="upload-icon">
                <FaCamera size={24} color="white" title="Upload Image" />
              </label>
            </div>
          </div>

          {imageFile && (
            <div className="image-preview">
              <span className="image-name" style={{ color: "white" }}>
                <FaImage style={{ marginLeft: 6, color: "#555", width: "40px", height: "40px" }} />
                {truncateFilename(imageFile.name)}
              </span>
              <button className="remove-image" onClick={() => setImageFile(null)}>
                &times;
              </button>
            </div>
          )}

          <button
            id="sendBtn"
            onClick={handleSendMessage}
            disabled={uploading || (!newMessage.trim() && !imageFile)}
            className="send-button"
          >
            {uploading ? "Uploading..." : imageFile ? "Send the Image" : "Send"}
          </button>
        </div>
      )}

      {previewImage && (
        <div
          className="image-modal"
          onClick={() => setPreviewImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            cursor: "zoom-out",
          }}
        >
          <img
            src={previewImage}
            alt="Preview"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: "8px",
              boxShadow: "0 0 20px black",
            }}
          />
        </div>
      )}
    </div>
  );
}

export default ChatWithModerator;
