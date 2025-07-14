import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Switch,
  Grid,
  Button,
  Divider,
} from "@mui/material";

const backendUrl = "https://app-web-backend-5dd0.onrender.com";
const wsUrl = "wss://app-web-backend-5dd0.onrender.com";

const Home = () => {
  const deviceId = localStorage.getItem("deviceId");
  const updateHomeId = localStorage.getItem("updateHomeId");
  const originalHomeId = localStorage.getItem("originalHomeId");
  const username = localStorage.getItem("username") || "User";

  const [relays, setRelays] = useState({});
  const switchRefs = useRef({});
  const userInitiatedMap = useRef({});
  const latestRelayStates = useRef({});
  const webSocketRef = useRef(null);

  const fetchRelayData = async () => {
    try {
      const relaysRes = await fetch(`${backendUrl}/relays/${deviceId}?originalHomeId=${originalHomeId}`);
      const relaysArray = await relaysRes.json();

      const statesRes = await fetch(`${backendUrl}/states/${deviceId}`);
      const statesMap = await statesRes.json();

      const roomMap = {};
      relaysArray.forEach(({ room = "Relays", relay }) => {
        const state = statesMap[relay] || "OFF";
        latestRelayStates.current[relay] = state; // Store current state globally
        if (!roomMap[room]) roomMap[room] = [];
        roomMap[room].push({
          relay,
          status: state === "ON",
        });
      });

      setRelays(roomMap);
    } catch (err) {
      console.error("Error fetching relays or states:", err);
    }
  };

  const sendCommand = async (relay, command) => {
    try {
      await fetch(`${backendUrl}/control`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceId,
          updateHomeId,
          relay,
          command,
        }),
      });
    } catch (err) {
      console.error("Error sending command:", err);
    }
  };

  const handleSwitchChange = (relay, room, checked) => {
    const key = `${room}_${relay}`;
    if (userInitiatedMap.current[key]) {
      sendCommand(relay, checked ? "ON" : "OFF");
      userInitiatedMap.current[key] = false;
    }
  };

  const updateSwitchState = (relayName, value) => {
    latestRelayStates.current[relayName] = value; // Always track state globally

    const isOn = value === "ON";
    
    setRelays((prev) => {
      const updated = { ...prev };
      for (const room in updated) {
        const index = updated[room].findIndex((r) => r.relay === relayName);
        if (index !== -1) {
          updated[room][index].status = isOn;
        }
      }
      return updated;
    });

    // Update switch ref if it exists and user didn't initiate the change
    for (const room in relays) {
      const key = `${room}_${relayName}`;
      if (switchRefs.current[key] && !userInitiatedMap.current[key]) {
        switchRefs.current[key].checked = isOn;
      }
    }
  };

  const connectWebSocket = () => {
    try {
      const socket = new WebSocket(wsUrl);
      webSocketRef.current = socket;

      socket.onopen = () => console.log("✅ WebSocket connected");

      socket.onmessage = (msg) => {
        try {
          const json = JSON.parse(msg.data);
          if (json.type !== "state") return;
          if (json.deviceId !== deviceId) return;

          const { relay, value } = json;
          updateSwitchState(relay, value);
        } catch (err) {
          console.error("WebSocket message error:", err);
        }
      };

      socket.onerror = (err) => console.error("WebSocket error:", err);
      socket.onclose = () => {
        console.warn("WebSocket closed, attempting to reconnect...");
        setTimeout(() => {
          if (webSocketRef.current) {
            connectWebSocket();
          }
        }, 3000);
      };
    } catch (err) {
      console.error("WebSocket connection failed:", err);
    }
  };

  useEffect(() => {
    fetchRelayData();
    connectWebSocket();
    
    // Cleanup function
    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentDate = new Date().toLocaleString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <Box p={3} bgcolor="#121212" minHeight="100vh" color="white">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bgcolor="#1E1E1E"
        p={2}
        borderRadius={3}
        boxShadow="0 2px 12px rgba(0,0,0,0.3)"
      >
        <Box>
          <Typography variant="h5" fontWeight="bold">Welcome, {username}!</Typography>
          <Typography variant="body2" color="gray">
            {currentDate}
          </Typography>
        </Box>
        <Button onClick={fetchRelayData} variant="contained" color="primary">
          Refresh
        </Button>
      </Box>

      <Grid container spacing={3} mt={2}>
        {Object.entries(relays).map(([roomName, items]) => (
          <Grid item xs={12} md={6} key={roomName}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                background: "linear-gradient(to right, #1E1E1E, #2A2A2A)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
                transition: "transform 0.3s",
                '&:hover': {
                  transform: "scale(1.02)"
                }
              }}
              elevation={5}
            >
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: "#90caf9" }}>
                {roomName}
              </Typography>
              <Divider sx={{ mb: 2, background: "#444" }} />

              {items.map(({ relay, status }) => {
                const key = `${roomName}_${relay}`;
                return (
                  <Box
                    key={key}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    my={1.5}
                    px={2}
                    py={1}
                    borderRadius={2}
                    sx={{
                      backgroundColor: status ? "#1e88e5" : "#424242",
                      color: "white",
                      boxShadow: status
                        ? "0 0 10px #1e88e5"
                        : "inset 0 0 4px rgba(255,255,255,0.1)"
                    }}
                  >
                    <Typography variant="body1" fontWeight={500}>
                      {relay}
                    </Typography>
                    <Switch
                      color="default"
                      checked={status}
                      inputRef={(el) => (switchRefs.current[key] = el)}
                      onMouseDown={() => (userInitiatedMap.current[key] = true)}
                      onChange={(e) =>
                        handleSwitchChange(relay, roomName, e.target.checked)
                      }
                    />
                  </Box>
                );
              })}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Home;
