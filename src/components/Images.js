import React, { useState } from 'react';
import { List, Select, DatePicker, Button, Form, Row, Col } from 'antd';
import './Images.css';

const { Option } = Select;
const { RangePicker } = DatePicker;

const Images = () => {
  const [damageType, setDamageType] = useState('Bent');
  const [damageSeverity, setDamageSeverity] = useState('Severe');
  const [partDamaged, setPartDamaged] = useState('Door');
  const [model, setModel] = useState('GDT670SYVFS');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [imageList, setImageList] = useState([]); // State to manage the list of images
  const [selectedImage, setSelectedImage] = useState(null); // State to manage the selected image

  const handleSearch = () => {
    // Implement your search functionality here
    console.log('Search Images:', { damageType, damageSeverity, partDamaged, model, fromDate, toDate });

    // Simulate fetching image data (update this logic as needed)
    const fetchedImageList = [
      { id: 1, title: 'Image 1', src: '/path/to/your/image1.jpg' },
      { id: 2, title: 'Image 2', src: '/path/to/your/image2.jpg' },
      { id: 3, title: 'Image 3', src: '/path/to/your/image3.jpg' },
      { id: 4, title: 'Image 4', src: '/path/to/your/image4.jpg' },
      // Add more list items as needed
    ];
    setImageList(fetchedImageList); // Update this with actual fetched data
    setSelectedImage(null); // Clear the selected image
  };

  const handleItemClick = (image) => {
    setSelectedImage(image);
  };

  return (
    <div className="images-component">
      <h1>Dishwasher Damage Photos</h1>
      <Form layout="vertical">
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="Damage Type">
              <Select
                value={damageType}
                onChange={(value) => setDamageType(value)}
              >
                <Option value="Bent">Bent</Option>
                {/* <Option value="Scratched">Scratched</Option>
                <Option value="Dented">Dented</Option> */}
                {/* Add more options as needed */}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Damage Severity">
              <Select
                value={damageSeverity}
                onChange={(value) => setDamageSeverity(value)}
              >
                <Option value="Severe">Select</Option>
                
                <Option value="Moderate">Moderate</Option>
                <Option value="Mild">Mild</Option>
                {/* Add more options as needed */}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Part Damaged">
              <Select
                value={partDamaged}
                onChange={(value) => setPartDamaged(value)}
              >
                <Option value="Door">Door</Option>
                <Option value="Handle">Handle</Option>
                <Option value="Panel">Panel</Option>
                {/* Add more options as needed */}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Model">
              <Select
                value={model}
                onChange={(value) => setModel(value)}
              >
                <Option value="GDT670SYVFS">GDT670SYVFS</Option>
                <Option value="GDT665SSNSS">GDT665SSNSS</Option>
                <Option value="GDT630PYRFS">GDT630PYRFS</Option>
                {/* Add more options as needed */}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Book Date Range">
              <RangePicker
                value={fromDate && toDate ? [fromDate, toDate] : []}
                onChange={(dates) => {
                  if (dates) {
                    setFromDate(dates[0]);
                    setToDate(dates[1]);
                  }
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <div className="search-button-container">
            <Button type="primary" onClick={handleSearch}>Search Images</Button>
          </div>
        </Form.Item>
      </Form>
      {/* Container for image list and selected image */}
      <div className="image-container">
        <div className="image-list">
          <List
            dataSource={imageList}
            renderItem={item => (
              <List.Item onClick={() => handleItemClick(item)} style={{ cursor: 'pointer' }}>
                <div className="list-item-content">
                  <h3>{item.title}</h3>
                </div>
              </List.Item>
            )}
          />
        </div>
        <div className="selected-image-container">
          {/* Display selected image */}
          {selectedImage && (
            <div className="selected-image">
              <h2>{selectedImage.title}</h2>
              <img src={selectedImage.src} alt={selectedImage.title} style={{ width: '100%', maxWidth: '600px' }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Images;
