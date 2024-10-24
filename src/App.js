import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Layout, Menu, Avatar, Dropdown, Card, Skeleton, Empty } from "antd";
import {
  PictureOutlined,
  MessageOutlined,
  UserOutlined,
  BellOutlined,
} from "@ant-design/icons";
import DamageImage from "./components/DamageImage";
import DamageImageChat from "./components/DamageImageChat";
import "./App.css";
import config from "./components/config";

const { Header, Content } = Layout;

const App = () => {
  const [notificationData, setNotificationData] = useState([]);
  const [notificationLoader, setnotificationLoader] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleFeedbackClick = () => {
    window.open(
      "https://forms.office.com/pages/responsepage.aspx?id=ywjFQzPFg0CBBXda4er3IR3vmzIsVIhEny3_C1bF9nVUOUVVRkVUVUlQRkdaVTFERk5MUk1SUlNCWi4u",
      "_blank"
    );
  };


  const toggleDropdown = async (visible) => {
    setnotificationLoader(true);
    setDropdownVisible(visible); // Update the state based on dropdown visibility
    if (visible) {
      try {
        const headers = {
          "Content-Type": "application/json",
          "API-Key": config.apiKey,
        };
        const response = await fetch(
          `${config.BASE_URL}?dataset=getNotifications`,
          { headers }
        );
        const notificationResponse = await response.json();
        setNotificationData(notificationResponse);
        setnotificationLoader(false);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    } 
  
  };

  const menu = (
    <Card
      title={<span className="cardHead">Notifications</span>}
      headStyle={{
        backgroundColor: "#1C4E80",
        borderBottom: "none",
        padding: "10px",
      }}
      className="head"
      bodyStyle={{
        padding: "10px",
        maxHeight: "400px",
        overflowY: "auto",
      }}
    >
      {notificationLoader ? (
        <Skeleton
          paragraph={{
            rows: 4,
          }}
        />
      ) : notificationData?.length > 0 ? (
        notificationData.map((data, index) => {
          return (
            <div
              key={index}
              style={{
                borderBottom:
                  index !== notificationData.length - 1
                    ? "1px solid rgb(162, 180, 197, 1)"
                    : "none",
                padding: "5px",
              }}
            >
              <p className="notificationDate">
                <strong>{data?.category}</strong> &nbsp; {data?.date}
              </p>
              <h4 className="notificationHead">{data?.title}</h4>
              <p className="notificationParah">{data?.description}</p>
            </div>
          );
        })
      ) : (
        <Empty description='No Notifications' />
      )}
    </Card>
  );

  
  return (
    <Router>
      <Layout>
        <Header className="custom-header">
          <div className="logo">
            <img src="/GEALogo.png" alt="Logo" />
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["1"]}
            style={{ flex: 1 }}
          >
            <Menu.Item key="1" icon={<MessageOutlined />}>
              <Link to="/conversation">AI Conversation</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<PictureOutlined />}>
              <Link to="/damage-image">Gallery</Link>
            </Menu.Item>
          </Menu>
          <div className="user-profile">
            <Dropdown
              overlay={menu}
              trigger={["click"]}
              placement="bottomRight"
              onVisibleChange={toggleDropdown}
            >
              <Avatar
                size="large"
                style={{ marginRight: "10px", cursor: "pointer" }}
                icon={<BellOutlined />}
              />
            </Dropdown>

            <Avatar size="large" icon={<UserOutlined />} />
          </div>
        </Header>
        <Content className="app-content">
          <Routes>
            <Route path="/" element={<DamageImageChat />} />
            <Route path="/conversation" element={<DamageImageChat />} />
            <Route path="/damage-image" element={<DamageImage />} />
          </Routes>
        </Content>
        <div className="feedback-button" onClick={handleFeedbackClick}>
          Feedback
        </div>
      </Layout>
    </Router>
  );
};

export default App;
