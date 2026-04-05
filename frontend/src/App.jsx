import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
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

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hello. Ask any question related to travel booking, flights, hotels, cancellations, or visas.",
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
        minHeight: "100vh",
        py: { xs: 3, md: 6 },
        background: isDark
          ? "radial-gradient(circle at 20% 20%, rgba(11,95,255,0.18), transparent 42%), radial-gradient(circle at 85% 0%, rgba(14,165,163,0.20), transparent 48%), linear-gradient(180deg, #0B1324 0%, #101C34 100%)"
          : "radial-gradient(circle at 20% 20%, rgba(11,95,255,0.15), transparent 40%), radial-gradient(circle at 80% 0%, rgba(14,165,163,0.18), transparent 45%), linear-gradient(180deg, #F4F8FF 0%, #EAF2FF 100%)",
      }}
    >
      <Container maxWidth="md">
        <Paper sx={{ p: { xs: 2.5, md: 4 }, overflow: "hidden" }}>
          <Stack spacing={2.5}>
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              justifyContent="space-between"
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 46,
                    height: 46,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    color: "white",
                    background: "linear-gradient(135deg, #0B5FFF, #0EA5A3)",
                  }}
                >
                  <SmartToyRoundedIcon />
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    FAQ Assistant
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Smart FAQ chat experience
                  </Typography>
                </Box>
              </Box>

              <IconButton
                onClick={onToggleMode}
                color="secondary"
                aria-label="Toggle theme"
                sx={{
                  border: "1px solid",
                  borderColor: "secondary.main",
                  bgcolor: isDark ? "rgba(14,165,163,0.15)" : "transparent",
                }}
              >
                {isDark ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
              </IconButton>
            </Stack>

            {error ? <Alert severity="error">{error}</Alert> : null}

            <Paper
              variant="outlined"
              sx={{
                height: { xs: "58vh", md: "60vh" },
                p: 2,
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
                        color:
                          message.role === "user" ? "white" : "text.primary",
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

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {suggestions.map((item) => (
                <Chip
                  key={item}
                  label={item}
                  onClick={() => sendMessage(item)}
                />
              ))}
            </Stack>

            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
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

            <Button
              variant="text"
              color="secondary"
              onClick={() =>
                setMessages([
                  {
                    role: "bot",
                    text: "Hello. Ask any question related to travel booking, flights, hotels, cancellations, or visas.",
                    meta: null,
                  },
                ])
              }
            >
              Reset Conversation
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

App.defaultProps = {
  onToggleMode: () => {},
};

export default App;
