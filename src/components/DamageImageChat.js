import React, { useState } from 'react';
import { Layout, Button, Input, Spin, Typography } from 'antd';
import { UserOutlined, RobotOutlined, SendOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from 'axios';
import './DamageImageChat.css';
import config from './config';

const { Content } = Layout;
const { TextArea } = Input;

const predefinedQuestions = [
  "Provide a summary by damage type for dishwasher",
  "Provide a summary by part damage for dishwasher",
  "Provide a summary by damage sensitivity for dishwasher",
  "Which models have the most damage"
];

const DamageImageChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuestionClick = async (index) => {
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
  };

  const handleSend = async () => {
    if (input.trim()) {
      setMessages(prevMessages => [
        ...prevMessages,
        { type: 'question', text: input }
      ]);

      try {
        setLoading(true);
        const response = await axios.get(config.BASE_URL, {
          headers: {
            'content-type': 'application/json',
            'api-key': 'f073d13164ce42a5a6ac3b5cfd39300277 '


          },
          params: {
            dataset: 'search',
            prompt: input
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
              <p>{question}</p>
            </Button>
          ))}
        </div>
        <Typography.Paragraph style={{ margin: '2px 0', textAlign: 'center',color: '#1C4E80' }}>
          As an AI Agent, I am here to assist you with the analysis of damages. A few sample prompts have been provided above for your reference. Please feel free to enter your prompts directly in the box below.
        </Typography.Paragraph>
        <div className="chat-messages">
          {messages.map((item, index) => (
            <div key={index} className={`message ${item.type}`}>
              {item.type === 'question' ? <UserOutlined className="message-icon" /> : <RobotOutlined className="message-icon" />}
              <div className="message-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.text}</ReactMarkdown>
              </div>
            </div>
          ))}
          {loading && (
            <div className="loading-spinner">
              <Spin size="large" />
            </div>
          )}
        </div>
        <div className="chat-input">
          <TextArea
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your question..."
            onPressEnter={handleSend}
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
