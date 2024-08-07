import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Layout, Menu, Avatar } from 'antd';
import { PictureOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons';
import LoginForm from './components/LoginForm';
import DamageImage from './components/DamageImage';
import DamageImageChat from './components/DamageImageChat';
import './App.css'; // Import custom styles

const { Header, Content } = Layout;

const App = () => {
  return (
    <Router>
      <Layout>
        <Header className="custom-header">
          <div className="logo">
            <img src="/GEALogo.png" alt="Logo" />
          </div>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style={{ flex: 1 }}>
          <Menu.Item key="1" icon={<MessageOutlined />}>
              <Link to="/conversation">AI Conversation</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<PictureOutlined />}>
              <Link to="/damage-image">Gallery</Link>
            </Menu.Item>
          
          </Menu>
          <div className="user-profile">
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
      </Layout>
    </Router>
  );
};

export default App;
