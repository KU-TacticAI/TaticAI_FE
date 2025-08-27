import React, { useState, useCallback } from 'react';
import { Box, TextField, Button, List, ListItem, ListItemText } from '@mui/material';
import { ChatMessage } from '../../hooks/useStompChat';

interface Props {
  messages: ChatMessage[];
  onSend: (text: string) => void;
}

const ChatPanel: React.FC<Props> = ({ messages, onSend }) => {
  const [text, setText] = useState('');

  const handleSend = useCallback(() => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  }, [text, onSend]);

  return (
      <Box className="chat-container-full-width">
        <List className="chat-messages">
          {messages.map((msg, index) => (
              <ListItem key={index}>
                <ListItemText
                    primary={<strong>{msg.user}:</strong>}
                    secondary={msg.message}
                />
              </ListItem>
          ))}
        </List>
        <Box className="chat-input">
          <TextField
              fullWidth
              variant="outlined"
              size="small"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={(e) => { if (e.key === 'Enter') handleSend(); }}
              placeholder="Type a message..."
          />
          <Button variant="contained" onClick={handleSend} sx={{ ml: 1 }}>Send</Button>
        </Box>
      </Box>
  );
};

export default ChatPanel;
