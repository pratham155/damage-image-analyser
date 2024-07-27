import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Layout, Menu, Avatar } from 'antd';
import { HomeOutlined, PictureOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons';
import LoginForm from './components/LoginForm';
import Home from './components/Home';
import DamageImage from './components/DamageImage';
import DamageImageChat from './components/DamageImageChat';
import PrivateRoute from './components/PrivateRoute';
import './App.css'; // Import custom styles

const { Header, Content } = Layout;

const App = () => {
  return (
    <Router>
      <Layout>
        <Header className="custom-header">
          <div className="logo">
            {/* <img src="https://via.placeholder.com/150?text=GE+Appliance+Logo1" alt=" Logo" /> */}
          </div>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style={{ flex: 1 }}>
            <Menu.Item key="1" icon={<HomeOutlined />}>
              <Link to="/home">Home</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<PictureOutlined />}>
              <Link to="/damage-image">Gallery</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<MessageOutlined />}>
              <Link to="/conversation">Conversation</Link>
            </Menu.Item>
          </Menu>
          <div className="user-profile">
            <Avatar size="large" icon={<UserOutlined />} />
          </div>
        </Header>
        <Content className="app-content">
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/home" element={<PrivateRoute component={Home} />} />
            <Route path="/damage-image" element={<PrivateRoute component={DamageImage} />} />
            <Route path="/conversation" element={<PrivateRoute component={DamageImageChat} />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
};

export default App;
