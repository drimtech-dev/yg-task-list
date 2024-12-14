const fs = require('fs');
const path = require('path');

const messagesFilePath = path.join(__dirname, '../data/messages.json');

const getMessages = (req, res) => {
  fs.readFile(messagesFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read messages' });
    }
    const messages = JSON.parse(data);
    res.json(messages);
  });
};

const addMessage = (req, res) => {
  const newMessage = req.body;
  fs.readFile(messagesFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read messages' });
    }
    const messages = JSON.parse(data);
    messages.push(newMessage);
    fs.writeFile(messagesFilePath, JSON.stringify(messages), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save message' });
      }
      res.status(201).json(newMessage);
    });
  });
};

const deleteMessage = (req, res) => {
  const { id } = req.params;
  fs.readFile(messagesFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read messages' });
    }
    let messages = JSON.parse(data);
    messages = messages.filter((message, index) => index !== parseInt(id, 10));
    fs.writeFile(messagesFilePath, JSON.stringify(messages), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete message' });
      }
      res.status(204).end();
    });
  });
};

module.exports = {
  getMessages,
  addMessage,
  deleteMessage,
};