import React, { useState, useEffect } from 'react';
import { List, Select, DatePicker, Button, Form, Row, Col, Spin, ConfigProvider, Typography, message, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import './DamageImage.css';

const { Option } = Select;
const { RangePicker } = DatePicker;

const productTypes = [
  "Commercial AC",
  "Zoneline",
  "Refrigeration",
  "Dishwasher",
  "Cooking",
  "Ductless",
  "Freezer",
  "Hoods",
  "HVAC",
  "Laundry",
  "Microwave",
  "RAC",
  "Water Heater",
  "Water Softener"
];

const DamageImage = () => {
  const [productType, setProductType] = useState('Dishwasher');
  const [damageTypes, setDamageTypes] = useState([]);
  const [severityTypes, setSeverityTypes] = useState([]);
  const [partDamaged, setPartDamaged] = useState([]);
  const [models, setModels] = useState([]);
  const [damageType, setDamageType] = useState('All');
  const [damageSeverity, setDamageSeverity] = useState('All');
  const [partDamagedType, setPartDamagedType] = useState('All');
  const [model, setModel] = useState('All');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);

  // Fetch environment variables from the .env.int file
  const BASE_URL = process.env.REACT_APP_FULFIL_BASE_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    if (!BASE_URL || !apiKey) {
      console.error("Missing environment variables: NEXT_PUBLIC_FULFIL_BASE_API_URL or NEXT_PUBLIC_API_KEY");
      return;
    }

    const fetchData = async () => {
      try {
        const headers = {
          'Content-Type': 'application/json',
          'API-Key': apiKey
        };

        const [partsResponse, damageResponse, severityResponse, modelsResponse] = await Promise.all([
          fetch(`${BASE_URL}?dataset=getPartsDamaged`, { headers }),
          fetch(`${BASE_URL}?dataset=getDamageTypes`, { headers }),
          fetch(`${BASE_URL}?dataset=getSeverityTypes`, { headers }),
          fetch(`${BASE_URL}?dataset=getModels`, { headers })
        ]);

        if (!partsResponse.ok || !damageResponse.ok || !severityResponse.ok || !modelsResponse.ok) {
          throw new Error('Failed to fetch data from one or more APIs');
        }

        const partsData = await partsResponse.json();
        const damageData = await damageResponse.json();
        const severityData = await severityResponse.json();
        const modelsData = await modelsResponse.json();

        setPartDamaged(partsData.data.partDamaged);
        setDamageTypes(damageData.data.damageType);
        setSeverityTypes(severityData.data.severity);
        setModels(modelsData.data.model);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [BASE_URL, apiKey]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const headers = {
        'Content-Type': 'application/json',
        'API-Key': apiKey
      };

      const params = {
        dataset: "getImages",
        model,
        damageType,
        partDamaged: partDamagedType,
        severity: damageSeverity,
        prd_ln: "DISHWASHER",
        from_booked_date: fromDate ? fromDate.format('YYYY-MM-DD') : '',
        to_booked_date: toDate ? toDate.format('YYYY-MM-DD') : ''
      };

      const query = new URLSearchParams(params).toString();
      const response = await fetch(`${BASE_URL}?${query}`, { headers });

      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }

      const data = await response.json();
      setImageList(data.data.images || []);
      setSelectedImage(null); 
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (image) => {
    setSelectedImage(image);
    setImageLoading(true);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <div className="images-component">
      <Form layout="vertical">
        <Row gutter={16}>
          <Col span={4}>
            <Form.Item label="Product Type" required>
              <Select
                value={productType}
                onChange={(value) => setProductType(value)}
              >
                {productTypes.map(type => (
                  <Option key={type} value={type}>{type}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="Damage Type">
              <Select
                value={damageType}
                onChange={(value) => setDamageType(value)}
              >
                <Option value="All">All</Option>
                {damageTypes.map(type => (
                  <Option key={type} value={type}>{type}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="Damage Severity">
              <Select
                value={damageSeverity}
                onChange={(value) => setDamageSeverity(value)}
              >
                <Option value="All">All</Option>
                {severityTypes.map(type => (
                  <Option key={type} value={type}>{type}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="Part Damaged">
              <Select
                value={partDamagedType}
                onChange={(value) => setPartDamagedType(value)}
              >
                <Option value="All">All</Option>
                {partDamaged.map(part => (
                  <Option key={part} value={part}>{part}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="Model">
              <Select
                value={model}
                onChange={(value) => setModel(value)}
              >
                <Option value="All">All</Option>
                {models.map(model => (
                  <Option key={model} value={model}>{model}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <ConfigProvider theme={{ token: { colorPrimary: '#1890ff', colorText: 'black' } }}>
              <Form.Item
                label={
                  <span>
                    Book Date Range{' '}
                    <Tooltip title="Default date range is last 6 months">
                      <InfoCircleOutlined style={{ color: '#1890ff', cursor: 'pointer' }} />
                    </Tooltip>
                  </span>
                }
              >
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
            </ConfigProvider>
          </Col>
          <Col span={24} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Form.Item>
              <Button type="primary" onClick={handleSearch}>Search Images</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      {loading ? (
        <div className="loading-spinner">
          <Spin size="large" />
        </div>
      ) : (
        <div className="image-container">
          <div className="image-list">
            <List
              size="large"
              header={<div>Search Images</div>}
              bordered
              dataSource={imageList}
              renderItem={item => (
                <List.Item onClick={() => handleItemClick(item)} className="list-item">
                  <Typography.Text mark></Typography.Text> {item.title}
                </List.Item>
              )}
            />
          </div>
          <div className="selected-image-container">
            {imageLoading && (
              <div className="loading-spinner">
                <Spin size="large" />
              </div>
            )}
            {selectedImage && (
              <div className="selected-image">
                <h2>{selectedImage.title}</h2>
                <img src={selectedImage.path} alt={selectedImage.title} onLoad={handleImageLoad} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DamageImage;
