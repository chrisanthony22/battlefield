import React, { useEffect, useState, useRef } from "react";
import { db, ref } from "../firebase/firebase";
import { onValue, push, set } from "firebase/database";
import "./ChatListPage.css";
import { FaUser,FaCamera } from "react-icons/fa";
import {  } from "react-icons/fa";
import { FaImage } from "react-icons/fa";

const MODERATOR_TEAMNAME = "d'moderator";

const CLOUDINARY_CLOUD_NAME = "dyigdllth";
const UPLOAD_PRESET = "battlefield_images";

function ChatListPage() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMessagesMobile, setShowMessagesMobile] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setShowMessagesMobile(false);
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
      let userConvs = Object.entries(data)
        .filter(([id, conv]) => conv.participants && conv.participants[userTeamname])
        .map(([id, conv]) => ({ id, ...conv }))
        .sort((a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp);

      const hasModConv = userConvs.some(
        (conv) => conv.participants && conv.participants[MODERATOR_TEAMNAME]
      );

      if (!hasModConv) {
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

      setConversations(userConvs);

      if (!activeConversation || !userConvs.find((c) => c.id === activeConversation.id)) {
        setActiveConversation(userConvs[0] || null);
      }
    });

    return () => unsubscribe();
  }, [loggedInUser, activeConversation]);

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

    const isImageLink = newMessage.startsWith("http");
    const msgObj = {
      sender: loggedInUser.teamname,
      text: imageUrl ? "" : isImageLink ? "" : newMessage.trim(),
      image: imageUrl ? imageUrl : isImageLink ? newMessage.trim() : null,
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

  const onSelectConversation = (conv) => {
    setActiveConversation(conv);
    if (isMobile) setShowMessagesMobile(true);
  };

  const onBackClick = () => setShowMessagesMobile(false);

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
    if (name.length > 20) {
      return name.substring(0, 20) + "...";
    }
    return name;
  };

  const renderConversationItem = (conv) => {
    const otherParticipants = Object.keys(conv.participants).filter(
      (p) => p !== loggedInUser.teamname
    );
    const lastMsgText = conv.lastMessage?.text || "";
    const lastTime = conv.lastMessage?.timestamp
      ? new Date(conv.lastMessage.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

    return (
      <div
        key={conv.id}
        onClick={() => onSelectConversation(conv)}
        className={`conversation-item ${
          activeConversation?.id === conv.id ? "active" : ""
        }`}
      >
        <div style={{ display: "flex" }}>
          <FaUser className="conversation-avatar" />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              wordBreak: "break-word",
            }}
          >
            <strong style={{ marginBottom: "4px" }}>
              {otherParticipants.join(", ")}
            </strong>
            <span>{lastMsgText}</span>
          </div>
        </div>
        <div
          style={{
            marginLeft: "10px",
            fontSize: "0.75rem",
            whiteSpace: "nowrap",
          }}
        >
          {lastTime}
        </div>
      </div>
    );
  };

  if (!loggedInUser) return <p style={{ color: "white" }}>Please log in first.</p>;

  return (
    <div className={`chat-container ${isMobile ? "mobile" : "desktop"}`}>
      {(!isMobile || (isMobile && !showMessagesMobile)) && (
        <div className="conversations-pane">
          <h2 style={{ color: "white" }}>Chats</h2>
          {conversations.length === 0 ? (
            <p>No conversations</p>
          ) : (
            conversations.map(renderConversationItem)
          )}
        </div>
      )}

      {(!isMobile || (isMobile && showMessagesMobile)) && activeConversation && (
        <div className="messages-pane">
          {isMobile && (
            <button onClick={onBackClick} className="back-button">
              ← Back
            </button>
          )}

          <h3 className="messages-header">
            Chat with{" "}
            {Object.keys(activeConversation.participants)
              .filter((p) => p !== loggedInUser.teamname)
              .join(", ")}
          </h3>

          <div className="messages-list">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message-wrapper ${
                  msg.sender === loggedInUser.teamname ? "sent" : "received"
                }`}
              >
                <div
                  className={`message-item ${
                    msg.sender === loggedInUser.teamname ? "sent" : "received"
                  }`}
                >
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
              <span className="image-name" style={{color:"white"}}>
                <FaImage style={{ marginLeft: 6, color: "#555",width:"40px", height:"40px" }} />{truncateFilename(imageFile.name)}
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
              {uploading
                ? "Uploading..."
                : imageFile
                ? "Send the Image"
                : "Send"}
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

export default ChatListPage;
