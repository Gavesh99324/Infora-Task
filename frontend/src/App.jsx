import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

function App({ onToggleMode }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const initialBotMessage =
    "Hello. Ask any question related to travel booking, flights, hotels, cancellations, or visas.";

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: initialBotMessage,
      meta: null,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    async function fetchFaqs() {
      try {
        const response = await fetch(`${API_BASE}/api/faqs`);
        if (!response.ok) {
          throw new Error("Failed to fetch FAQs");
        }
        const data = await response.json();
        setSuggestions((data.faqs || []).slice(0, 6).map((f) => f.question));
      } catch {
        setSuggestions([]);
      }
    }
    fetchFaqs();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const canSend = useMemo(
    () => input.trim().length > 0 && !loading,
    [input, loading],
  );

  const resetConversation = () => {
    setMessages([
      {
        role: "bot",
        text: initialBotMessage,
        meta: null,
      },
    ]);
    setInput("");
    setError("");
  };

  const sendMessage = async (text) => {
    const content = text.trim();
    if (!content || loading) return;

    setError("");
    setMessages((prev) => [
      ...prev,
      { role: "user", text: content, meta: null },
    ]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        throw new Error("The server could not process your request.");
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: data.message,
          meta:
            data.status === "matched"
              ? `Matched: ${data.matched_question} | Confidence: ${data.confidence}`
              : null,
        },
      ]);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100dvh",
        boxSizing: "border-box",
        overflow: "hidden",
        display: "flex",
        background: isDark
          ? "radial-gradient(circle at 20% 20%, rgba(11,95,255,0.18), transparent 42%), radial-gradient(circle at 85% 0%, rgba(14,165,163,0.20), transparent 48%), linear-gradient(180deg, #0B1324 0%, #101C34 100%)"
          : "radial-gradient(circle at 20% 20%, rgba(11,95,255,0.15), transparent 40%), radial-gradient(circle at 80% 0%, rgba(14,165,163,0.18), transparent 45%), linear-gradient(180deg, #F4F8FF 0%, #EAF2FF 100%)",
      }}
    >
      <Box
        sx={{
          width: 260,
          p: 1,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          gap: 1,
          borderRight: "1px solid",
          borderColor: isDark ? "rgba(148,163,184,0.2)" : "rgba(15,23,42,0.1)",
          bgcolor: isDark ? "rgba(9,16,31,0.65)" : "rgba(255,255,255,0.55)",
          backdropFilter: "blur(8px)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 1,
            py: 0.75,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                color: "white",
                background: "linear-gradient(135deg, #0B5FFF, #0EA5A3)",
              }}
            >
              <SmartToyRoundedIcon sx={{ fontSize: 16 }} />
            </Box>
            <Typography sx={{ fontSize: "0.95rem", fontWeight: 700 }}>
              Travel FAQ
            </Typography>
          </Box>
          <IconButton
            onClick={onToggleMode}
            color="secondary"
            aria-label="Toggle theme"
            size="small"
            sx={{
              border: "1px solid",
              borderColor: "secondary.main",
              p: 0.45,
              bgcolor: isDark ? "rgba(14,165,163,0.15)" : "transparent",
            }}
          >
            {isDark ? (
              <LightModeRoundedIcon sx={{ fontSize: 16 }} />
            ) : (
              <DarkModeRoundedIcon sx={{ fontSize: 16 }} />
            )}
          </IconButton>
        </Box>
        <Button
          variant="contained"
          onClick={resetConversation}
          sx={{ justifyContent: "flex-start" }}
        >
          Reset Conversation
        </Button>
        <Divider />
        <Typography
          sx={{ px: 1, fontSize: "0.78rem", color: "text.secondary" }}
        >
          Suggested Questions
        </Typography>
        <Stack
          spacing={0.75}
          sx={{ overflowY: "auto", minHeight: 0, pr: 0.25 }}
        >
          {suggestions.map((item) => (
            <Button
              key={`sidebar-${item}`}
              variant="text"
              onClick={() => sendMessage(item)}
              sx={{
                justifyContent: "flex-start",
                textAlign: "left",
                px: 1,
                py: 0.5,
                fontSize: "0.76rem",
                lineHeight: 1.3,
                textTransform: "none",
              }}
            >
              {item}
            </Button>
          ))}
        </Stack>
      </Box>

      <Paper
        square
        sx={{
          p: { xs: 0.75, md: 1 },
          overflow: "hidden",
          height: "100%",
          width: { xs: "100%", md: "calc(100% - 260px)" },
          display: "flex",
          flexDirection: "column",
          borderRadius: 0,
          bgcolor: isDark ? "rgba(14,24,44,0.72)" : "rgba(252,254,255,0.85)",
        }}
      >
        <Stack spacing={1} sx={{ height: "100%", minHeight: 0 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ display: { xs: "flex", md: "none" } }}
          >
            <Typography sx={{ fontSize: "0.95rem", fontWeight: 700 }}>
              Travel FAQ
            </Typography>
            <Stack direction="row" spacing={0.5}>
              <IconButton
                onClick={resetConversation}
                size="small"
                color="primary"
                aria-label="Reset conversation"
                sx={{
                  border: "1px solid",
                  borderColor: "primary.light",
                  p: 0.55,
                  bgcolor: "rgba(11,95,255,0.08)",
                }}
              >
                <SmartToyRoundedIcon sx={{ fontSize: 16 }} />
              </IconButton>
              <IconButton
                onClick={onToggleMode}
                color="secondary"
                aria-label="Toggle theme"
                size="small"
                sx={{
                  border: "1px solid",
                  borderColor: "secondary.main",
                  p: 0.55,
                  bgcolor: isDark ? "rgba(14,165,163,0.15)" : "transparent",
                }}
              >
                {isDark ? (
                  <LightModeRoundedIcon sx={{ fontSize: 16 }} />
                ) : (
                  <DarkModeRoundedIcon sx={{ fontSize: 16 }} />
                )}
              </IconButton>
            </Stack>
          </Stack>

          {error ? <Alert severity="error">{error}</Alert> : null}

          <Paper
            variant="outlined"
            sx={{
              flex: 1.8,
              minHeight: 0,
              p: 1.25,
              borderRadius: 3,
              overflowY: "auto",
              backgroundColor: isDark ? "#0E182C" : "#FCFEFF",
            }}
          >
            <Stack spacing={1.5}>
              {messages.map((message, index) => (
                <Box
                  key={`${message.role}-${index}`}
                  sx={{
                    display: "flex",
                    justifyContent:
                      message.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: "82%",
                      px: 2,
                      py: 1.25,
                      borderRadius: 2.5,
                      color: message.role === "user" ? "white" : "text.primary",
                      bgcolor:
                        message.role === "user"
                          ? "primary.main"
                          : isDark
                            ? "rgba(11,95,255,0.20)"
                            : "rgba(11,95,255,0.10)",
                      border: "1px solid",
                      borderColor:
                        message.role === "user"
                          ? "primary.main"
                          : isDark
                            ? "rgba(11,95,255,0.30)"
                            : "rgba(11,95,255,0.18)",
                    }}
                  >
                    <Typography variant="body1">{message.text}</Typography>
                    {message.meta ? (
                      <Typography
                        variant="caption"
                        sx={{ mt: 0.8, display: "block", opacity: 0.9 }}
                      >
                        {message.meta}
                      </Typography>
                    ) : null}
                  </Box>
                </Box>
              ))}
              {loading ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <CircularProgress size={16} />
                  <Typography variant="body2" color="text.secondary">
                    Assistant is thinking...
                  </Typography>
                </Stack>
              ) : null}
              <div ref={bottomRef} />
            </Stack>
          </Paper>

          <Stack
            direction="row"
            spacing={0.75}
            sx={{
              display: { xs: "flex", md: "none" },
              flexWrap: "nowrap",
              overflowX: "auto",
              overflowY: "hidden",
              pb: 0.25,
            }}
          >
            {suggestions.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                sx={{ flexShrink: 0 }}
                onClick={() => sendMessage(item)}
              />
            ))}
          </Stack>

          <Stack direction="row" spacing={0.75}>
            <TextField
              fullWidth
              size="small"
              placeholder="Ask your question..."
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  sendMessage(input);
                }
              }}
            />
            <IconButton
              size="large"
              color="primary"
              disabled={!canSend}
              onClick={() => sendMessage(input)}
              sx={{
                borderRadius: 2,
                px: 2,
                border: "1px solid",
                borderColor: "primary.light",
                backgroundColor: "rgba(11,95,255,0.08)",
              }}
              aria-label="Send message"
            >
              <SendRoundedIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}

App.defaultProps = {
  onToggleMode: () => {},
};

export default App;
