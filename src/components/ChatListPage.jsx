import React, { useEffect, useState, useRef } from "react";
import { db, ref } from "../firebase/firebase";
import { onValue, push, set } from "firebase/database";
import "./ChatListPage.css";
import { FaUser } from 'react-icons/fa';

const MODERATOR_TEAMNAME = "d'moderator";

function ChatListPage() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMessagesMobile, setShowMessagesMobile] = useState(false);
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

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;

    const messagesRef = ref(db, `conversations/${activeConversation.id}/messages`);
    const newMsgRef = push(messagesRef);

    const msgObj = {
      sender: loggedInUser.teamname,
      text: newMessage.trim(),
      timestamp: Date.now(),
    };

    await set(newMsgRef, msgObj);
    const convRef = ref(db, `conversations/${activeConversation.id}/lastMessage`);
    await set(convRef, msgObj);
    setNewMessage("");
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

  const renderConversationItem = (conv) => {
    const otherParticipants = Object.keys(conv.participants).filter(
      (p) => p !== loggedInUser.teamname
    );
    const lastMsgText = conv.lastMessage?.text || "";
    const lastTime = conv.lastMessage?.timestamp 
  ? new Date(conv.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
  : "";
    return (
      <div
        key={conv.id}
        onClick={() => onSelectConversation(conv)}
        className={`conversation-item ${activeConversation?.id === conv.id ? "active" : ""}`}
      >
        {/* Left side: icon + name/message */}
        <div style={{ display: "flex"}}>
          <FaUser className="conversation-avatar" />
          <div style={{ display: "flex", flexDirection: "column", wordBreak: "break-word" }}>
            <strong style={{ marginBottom: "4px" }}>{otherParticipants.join(", ")}</strong>
            <span>{lastMsgText}</span>
          </div>
        </div>

        {/* Right side: timestamp */}
        <div style={{ marginLeft: "10px", fontSize: "0.75rem", whiteSpace: "nowrap" }}>
          {lastTime}
        </div>
      </div>


    );
  };

  if (!loggedInUser) return <p>Please log in first.</p>;

  return (
    <div className={`chat-container ${isMobile ? "mobile" : "desktop"}`}>
      {(!isMobile || (isMobile && !showMessagesMobile)) && (
        <div className="conversations-pane">
          <h2 style={{color:"white"}}>Chats</h2>
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
                className={`message-wrapper ${msg.sender === loggedInUser.teamname ? "sent" : "received"}`}
              >
                <div className={`message-item ${msg.sender === loggedInUser.teamname ? "sent" : "received"}`}>
                  <div className="message-sender">{msg.sender}</div>
                  <div className="message-text">{msg.text}</div>
                  <div className="message-timestamp">{formatTimestamp(msg.timestamp)}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="send-message-form">
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
            />
            <button id="sendBtn" onClick={handleSendMessage} disabled={!newMessage.trim()}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatListPage;
