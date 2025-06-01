import React, { useEffect, useState } from "react";
import { ref, onValue, push, set, update, get } from "firebase/database";
import { db } from "../firebase/firebase";
import { FaUsers, FaComments } from "react-icons/fa";
import "./TeamsList.css";

const MODERATOR_TEAMNAME = "d'moderator"; // if you want to customize

function TeamsList() {
  const [teams, setTeams] = useState([]);
  const [user, setUser] = useState(null);
  const [chatOpenFor, setChatOpenFor] = useState(null); // conversation object {id, participants, ...}
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Load teams
    const teamsRef = ref(db, "Teams");
    onValue(teamsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedTeams = Object.entries(data).map(([id, team]) => ({
          id,
          ...team,
        }));
        setTeams(loadedTeams);
      }
    });

    // Load logged user
    const savedUser = localStorage.getItem("loggedInUser");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // Listen for messages when chatOpenFor (conversation) changes
  useEffect(() => {
    if (!chatOpenFor) {
      setMessages([]);
      return;
    }

    const messagesRef = ref(db, `conversations/${chatOpenFor.id}/messages`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val() || {};
      const loadedMessages = Object.entries(data).map(([id, msg]) => ({
        id,
        ...msg,
      }));
      loadedMessages.sort((a, b) => a.timestamp - b.timestamp);
      setMessages(loadedMessages);
    });

    return () => unsubscribe();
  }, [chatOpenFor]);

  // Find existing conversation between two teams or create new
  const findOrCreateConversation = async (userTeamname, otherTeamname) => {
    const convRef = ref(db, "conversations");
    const snapshot = await get(convRef);
    const data = snapshot.val() || {};

    // Try find existing conv with both participants
    for (const [id, conv] of Object.entries(data)) {
      if (
        conv.participants &&
        conv.participants[userTeamname] &&
        conv.participants[otherTeamname]
      ) {
        return { id, ...conv };
      }
    }

    // No existing conversation? Create new
    const newConvRef = push(convRef);
    const newConv = {
      participants: {
        [userTeamname]: true,
        [otherTeamname]: true,
      },
      lastMessage: {
        sender: MODERATOR_TEAMNAME,
        text: "Conversation started.",
        timestamp: Date.now(),
      },
      messages: {},
    };

    await set(newConvRef, newConv);

    return { id: newConvRef.key, ...newConv };
  };

  const openChatWithTeam = async (team) => {
    if (!user) return;
    try {
      const conversation = await findOrCreateConversation(
        user.teamname,
        team.teamname
      );
      setChatOpenFor(conversation);
      setMessageText("");
    } catch (error) {
      console.error("Error opening chat:", error);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !chatOpenFor) return;

    const chatRef = ref(db, `conversations/${chatOpenFor.id}`);
    const messagesRef = ref(db, `conversations/${chatOpenFor.id}/messages`);
    const newMessageRef = push(messagesRef);

    const messageData = {
      sender: user.teamname,
      text: messageText.trim(),
      timestamp: Date.now(),
      // Add imageUrl here if sending images, e.g. imageUrl: "https://res.cloudinary.com/..."
    };

    try {
      await set(newMessageRef, messageData);
      await update(chatRef, { lastMessage: messageData });
      setMessageText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <>
      <div className="teams-grid">
        {teams.map((team) => (
          <div key={team.id} className="team-card">
            <FaUsers size={32} className="team-icon" />
            <h3>{team.teamname}</h3>
            {user && (
              <button
                className="chat-button"
                onClick={() => openChatWithTeam(team)}
              >
                <FaComments /> Chat
              </button>
            )}
          </div>
        ))}
      </div>

      {chatOpenFor && (
        <div className="modal-overlay" onClick={() => setChatOpenFor(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>
                Chat with{" "}
                {Object.keys(chatOpenFor.participants).find(
                  (name) => name !== user.teamname
                )}
              </h4>
              <button
                className="close-button"
                onClick={() => setChatOpenFor(null)}
                aria-label="Close chat"
              >
                &times;
              </button>
            </div>

            <div
              className="messages-container"
              style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "10px", color:"black" }}
            >
              {messages.length === 0 && <p>No messages yet</p>}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message ${
                    msg.sender === user.teamname ? "sent" : "received"
                  }`}
                  style={{
                    textAlign: msg.sender === user.teamname ? "right" : "left",
                    margin: "5px 0",
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      padding: "8px 12px",
                      borderRadius: "15px",
                      backgroundColor:
                        msg.sender === user.teamname ? "#DCF8C6" : "#FFF",
                      border: "1px solid #ccc",
                      maxWidth: "70%",
                      wordWrap: "break-word",
                    }}
                  >
                    <small style={{ fontWeight: "bold" }}>{msg.sender}</small>
                    {msg.imageUrl ? (
                      <div style={{ marginTop: "5px" }}>
                        <img
                          src={msg.imageUrl}
                          alt="Sent"
                          style={{ maxWidth: "100%", borderRadius: "10px" }}
                        />
                        {msg.text && <p style={{ marginTop: "5px" }}>{msg.text}</p>}
                      </div>
                    ) : (
                      <p style={{ margin: "5px 0" }}>{msg.text}</p>
                    )}
                    <small style={{ fontSize: "0.7em", color: "#555" }}>
                      {new Date(msg.timestamp).toLocaleString()}
                    </small>
                  </div>
                </div>
              ))}
            </div>

            <textarea
              className="chat-textarea"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              rows={4}
              placeholder="Type your message..."
            />
            <button className="send-button" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default TeamsList;
