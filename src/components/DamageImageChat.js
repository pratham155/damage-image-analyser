import React, { useState, useCallback, memo } from 'react';
import { Layout, Button, Input, Spin, Typography } from 'antd';
import { UserOutlined, RobotOutlined, SendOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from 'axios';
import config from './config';
import './DamageImageChat.css';

const { Content } = Layout;
const { TextArea } = Input;

const predefinedQuestions = [
  "Provide a summary by damage type for dishwasher",
  "Provide a summary by part damage for dishwasher",
  "Provide a summary by damage sensitivity for dishwasher",
  "Which models have the most damage"
];

// Memoized message component to avoid re-rendering unnecessarily
const Message = memo(({ type, text }) => (
  <div className={`message ${type}`}>
    {type === 'question' ? <UserOutlined className="message-icon" /> : <RobotOutlined className="message-icon" />}
    <div className="message-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
    </div>
  </div>
));

// Memoized message list component to optimize rendering
const MessageList = memo(({ messages, loading }) => (
  <div className="chat-messages">
    {messages.map((item, index) => (
      <Message key={index} type={item.type} text={item.text} />
    ))}
    {loading && (
      <div className="loading-spinner">
        <Spin size="large" />
      </div>
    )}
  </div>
));

const DamageImageChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Memoized function to handle predefined question clicks
  const handleQuestionClick = useCallback(async (index) => {
    const question = predefinedQuestions[index];
    setMessages(prevMessages => [
      ...prevMessages,
      { type: 'question', text: question }
    ]);

    try {
      setLoading(true);
      const response = await axios.get(config.BASE_URL, {
        headers: {
          'content-type': 'application/json',
          'api-key': config.apiKey
        },
        params: {
          dataset: 'search',
          prompt: question
        }
      });

      const markdown = convertJsonToMarkdown(response.data.Content);
      setMessages(prevMessages => [
        ...prevMessages,
        { type: 'answer', text: markdown }
      ]);
    } catch (error) {
      console.error('Error fetching data', error);
      setMessages(prevMessages => [
        ...prevMessages,
        { type: 'answer', text: 'Error fetching data' }
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Memoized function to handle sending of user input
  const handleSend = useCallback(async () => {
    if (input.trim()) {
      const currentInput = input.trim();
      setMessages(prevMessages => [
        ...prevMessages,
        { type: 'question', text: currentInput }
      ]);

      setInput(''); // Clear input for a better user experience

      try {
        setLoading(true);
        const response = await axios.get(config.BASE_URL, {
          headers: {
            'content-type': 'application/json',
            'api-key': config.apiKey
          },
          params: {
            dataset: 'search',
            prompt: currentInput
          }
        });

        const markdown = convertJsonToMarkdown(response.data.Content);
        setMessages(prevMessages => [
          ...prevMessages,
          { type: 'answer', text: markdown }
        ]);
      } catch (error) {
        console.error('Error fetching data', error);
        setMessages(prevMessages => [
          ...prevMessages,
          { type: 'answer', text: 'Error fetching data' }
        ]);
      } finally {
        setLoading(false);
      }
    }
  }, [input]);

  // Memoized input change handler to avoid re-rendering
  const handleInputChange = useCallback((e) => {
    setInput(e.target.value);
  }, []);

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
              <p>{question}</p>
            </Button>
          ))}
        </div>
        <Typography.Paragraph style={{ margin: '2px 0', textAlign: 'center', color: '#1C4E80' }}>
          As an AI Agent, I am here to assist you with the analysis of damages. A few sample prompts have been provided above for your reference. Please feel free to enter your prompts directly in the box below.
        </Typography.Paragraph>
        <MessageList messages={messages} loading={loading} />
        <div className="chat-input">
          <TextArea
            rows={2}
            value={input}
            onChange={handleInputChange}
            placeholder="Enter your question..."
            onPressEnter={(e) => { e.preventDefault(); handleSend(); }}
            disabled={loading}
          />
          <Button type="primary" onClick={handleSend} disabled={loading} icon={<SendOutlined />} />
        </div>
      </Content>
    </Layout>
  );
};

const convertJsonToMarkdown = (data) => {
  let markdown = '';
  data.forEach(item => {
    if (item.type === "text") {
      markdown += `${item.description}\n\n`;
    } else if (item.type === "table") {
      markdown += `| ${item.headers.join(" | ")} |\n`;
      markdown += `| ${item.headers.map(() => "---").join(" | ")} |\n`;
      item.rows.forEach(row => {
        markdown += `| ${row.join(" | ")} |\n`;
      });
      markdown += `\n`;
    }
  });
  return markdown;
};

export default DamageImageChat;
