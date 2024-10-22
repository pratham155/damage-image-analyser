import React, { useState, useCallback, useRef, useEffect, memo } from "react";
import { Layout, Button, Input, Spin, Typography } from "antd";
import { UserOutlined, RobotOutlined, SendOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import axios from "axios";
import config from "./config";
import { saveAs } from "file-saver";
import rehypeRaw from "rehype-raw";
import { v4 as uuidv4 } from "uuid";
import "./DamageImageChat.css";

const { Content } = Layout;
const { TextArea } = Input;

const predefinedQuestions = [
  "Provide a summary by damage type for dishwasher",
  "Provide a summary by part damage for dishwasher",
  "Provide a summary by damage Severity for dishwasher",
  "Which models have the most damage",
];

const Message = memo(({ type, text }) => (
  <div className={`message ${type}`}>
    {type === "question" ? (
      <UserOutlined className="message-icon" />
    ) : (
      <RobotOutlined className="message-icon" />
    )}
    <div className="message-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {text}
      </ReactMarkdown>
    </div>
  </div>
));

const MessageList = memo(({ messages, loading }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chat-messages">
      {messages.map((item, index) => (
        <Message key={index} type={item.type} text={item.text} />
      ))}
      {loading && (
        <div className="loading-spinner">
          <Spin size="large" />
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
});

const DamageImageChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleQuestionClick = useCallback(async (index) => {
    const question = predefinedQuestions[index];
    const questionId = uuidv4();
    const answerId = uuidv4();
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: questionId, type: "question", text: question },
    ]);

    try {
      setLoading(true);
      const response = await axios.get(config.BASE_URL, {
        headers: {
          "content-type": "application/json",
          "api-key": config.apiKey,
        },
        params: {
          dataset: "search",
          prompt: question,
        },
      });
      const markdown = convertJsonToMarkdown(response.data.Content, answerId);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: answerId,
          type: "answer",
          text: markdown,
          meta: {
            data: response.data.Content,
          },
        },
      ]);
    } catch (error) {
      console.error("Error fetching data", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: answerId, type: "answer", text: "Error fetching data" },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSend = useCallback(async () => {
    if (input.trim()) {
      const currentInput = input.trim();
      const answerId = uuidv4();
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: uuidv4(), type: "question", text: currentInput },
      ]);

      setInput("");

      try {
        setLoading(true);
        const response = await axios.get(config.BASE_URL, {
          headers: {
            "content-type": "application/json",
            "api-key": config.apiKey,
          },
          params: {
            dataset: "search",
            prompt: currentInput,
          },
        });

        const markdown = convertJsonToMarkdown(response.data.Content, answerId);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: answerId,
            type: "answer",
            text: markdown,
            meta: {
              data: response.data.Content,
            },
          },
        ]);
      } catch (error) {
        console.error("Error fetching data", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: answerId, type: "answer", text: "Error fetching data" },
        ]);
      } finally {
        setLoading(false);
      }
    }
  }, [input]);

  const handleInputChange = useCallback((e) => {
    setInput(e.target.value);
  }, []);

  const handleExport = useCallback(
    (tableData) => {
      if (tableData) {
        const csvContent = tableDataToCSV(tableData);
        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        saveAs(blob, `table.csv`);
      }
    },
    [messages]
  );

  useEffect(() => {
    const buttons = document.querySelectorAll(".export-button");
    buttons.forEach((button) => {
      const messageId = button.getAttribute("data-messageid");
      const tableId = button.getAttribute("data-tableid");
      const index = messages.findIndex(({ id }) => id === messageId);
      const tableData = messages[index]?.meta?.data?.[tableId];
      if (tableData) {
        button.addEventListener("click", () => handleExport(tableData));
      }
    });

    return () => {
      buttons.forEach((button) => {
        button.removeEventListener("click", () =>
          handleExport(parseInt(button.id.split("-")[1], 10))
        );
      });
    };
  }, [messages, handleExport]);

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
        <Typography.Paragraph
          style={{ margin: "2px 0", textAlign: "center", color: "#1C4E80" }}
        >
          As an AI Agent, I am here to assist you with the analysis of damages.
          A few sample prompts have been provided above for your reference.
          Please feel free to enter your prompts directly in the box below.
        </Typography.Paragraph>
        <MessageList messages={messages} loading={loading} />
        <div className="chat-input">
          <TextArea
            rows={2}
            value={input}
            onChange={handleInputChange}
            placeholder="Enter your question..."
            onPressEnter={(e) => {
              e.preventDefault();
              handleSend();
            }}
            disabled={loading}
          />
          <Button
            type="primary"
            onClick={handleSend}
            disabled={loading}
            icon={<SendOutlined />}
          />
        </div>

        <Typography.Paragraph
          style={{ margin: "2px 0", textAlign: "center", color: "#1C4E80" }}
        >
          Disclaimer: Data is not inclusive of all damage returns for the
          product line and manufacturing site. It is currently limited to
          returns from BG&I, NECO, and Contract customers and to entries that
          include legible damage photos.
        </Typography.Paragraph>
      </Content>
    </Layout>
  );
};

const convertJsonToMarkdown = (data, messageId) => {
  let markdown = "";
  data.forEach((item, index) => {
    if (item.type === "text") {
      markdown += `${item.description}\n\n`;
    } else if (item.type === "table") {
      markdown += `<Button data-tableid="${index}" data-messageid="${messageId}" class="export-button"> Export To Excel</Button>\n`;
      markdown += `| ${item.headers.join(" | ")} |\n`;
      markdown += `| ${item.headers.map(() => "---").join(" | ")} |\n`;
      item.rows.forEach((row) => {
        markdown += `| ${row.join(" | ")} |\n`;
      });
      markdown += `\n`;
    }
  });
  return markdown;
};

const tableDataToCSV = (data) => {
  const header = data.headers.join(",") + "\n";
  const rows = data.rows.map((row) => row.join(",")).join("\n");
  return header + rows;
};

export default DamageImageChat;
