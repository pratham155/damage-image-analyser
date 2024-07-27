import React, { useState } from 'react';
import { Layout, Button, Input } from 'antd';
import { UserOutlined, RobotOutlined, SendOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './DamageImageChat.css';

const { Content } = Layout;
const { TextArea } = Input;

const predefinedQuestions = [
  "Provide a summary by damage type for dishwasher",
  "Provide a summary by part damage for dishwasher",
  "Provide a summary by damage sensitivity for dishwasher",
  "Which models have the most damage"
];

const predefinedResponses = [
  "Summary by damage type for dishwasher...",
  "Summary by part damage for dishwasher...",
  "Summary by damage sensitivity for dishwasher...",
  "Models with the most damage..."
];

const DamageImageChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleQuestionClick = (index) => {
    const question = predefinedQuestions[index];
    const response = predefinedResponses[index];

    if (!messages.some(msg => msg.text === question)) {
      setMessages(prevMessages => [
        ...prevMessages,
        { type: 'question', text: question },
        { type: 'answer', text: response }
      ]);
    }
  };

  const handleSend = () => {
    if (input.trim()) {
      setMessages(prevMessages => [
        ...prevMessages,
        { type: 'question', text: input },
        { type: 'answer', text: "AI response for: " + input }
      ]);
      setInput('');
    }
  };

  return (
    <Layout className="chat-layout">
      <Content className="chat-content">
        <div className="question-buttons">
          {predefinedQuestions.map((question, index) => (
            <Button
              key={index}
              className="question-button"
              onClick={() => handleQuestionClick(index)}
            >
              {question}
            </Button>
          ))}
        </div>
        <div className="chat-messages">
          {messages.map((item, index) => (
            <div key={index} className={`message ${item.type}`}>
              {item.type === 'question' ? <UserOutlined className="message-icon" /> : <RobotOutlined className="message-icon" />}
              <div className="message-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.text}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
        <div className="chat-input">
          <TextArea
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your question..."
          />
          <Button type="primary" onClick={handleSend} icon={<SendOutlined />}>Send</Button>
        </div>
      </Content>
    </Layout>
  );
};

export default DamageImageChat;
