import React, { useState, useEffect } from 'react';
import { List, Select, DatePicker, Button, Form, Row, Col, Spin } from 'antd';
import config from './config';
import './DamageImage.css';

const { Option } = Select;
const { RangePicker } = DatePicker;

const productTypes = [
  "Commercial AC",
  "Zoneline",
  "Refrigeration",
  "Dish",
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
  const [productType, setProductType] = useState('null');
  const [damageTypes, setDamageTypes] = useState([]);
  const [severityTypes, setSeverityTypes] = useState([]);
  const [partDamaged, setPartDamaged] = useState([]);
  const [models, setModels] = useState([]);
  const [damageType, setDamageType] = useState('null');
  const [damageSeverity, setDamageSeverity] = useState('null');
  const [partDamagedType, setPartDamagedType] = useState('null');
  const [model, setModel] = useState('null');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [imageList, setImageList] = useState([]); // State to manage the list of images
  const [selectedImage, setSelectedImage] = useState(null); // State to manage the selected image
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          'Content-Type': 'application/json',
          'API-Key': 'f073d13164ce42a5a6ac3b5cfd39300277'
        };

        const [partsResponse, damageResponse, severityResponse, modelsResponse] = await Promise.all([
          fetch(`${config.BASE_URL}?dataset=getPartsDamaged`, { headers }),
          fetch(`${config.BASE_URL}?dataset=getDamageTypes`, { headers }),
          fetch(`${config.BASE_URL}?dataset=getSeverityTypes`, { headers }),
          fetch(`${config.BASE_URL}?dataset=getModels`, { headers })
        ]);

        // Check if responses are OK
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
  }, []);

  const handleSearch = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'API-Key': 'f073d13164ce42a5a6ac3b5cfd39300277'
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
      const response = await fetch(`${config.BASE_URL}?${query}`, { headers });

      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }

      const data = await response.json();
      setImageList(data.data.images || []);
      setSelectedImage(null); // Clear the selected image
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleItemClick = (image) => {
    setSelectedImage(image);
  };

  if (loading) {
    return <Spin />;
  }

  return (
    <div className="images-component">
      <Form layout="vertical">
        <Row gutter={16}>
          <Col span={4}>
            <Form.Item label="Product Type">
              <Select
                value={productType}
                onChange={(value) => setProductType(value)}
              >
                <Option value="null">Select</Option>
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
                <Option value="null">Select</Option>
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
                <Option value="null">Select</Option>
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
                <Option value="null">Select</Option>
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
                <Option value="null">Select</Option>
                {models.map(model => (
                  <Option key={model} value={model}>{model}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
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
          <Col span={4}>
            <Form.Item>
              <div className="search-button-container">
                <Button type="primary" onClick={handleSearch}>Search Images</Button>
              </div>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      {/* Container for image list and selected image */}
      <div className="image-container">
        <div className="image-list">
          <h3 className="list-header">Image List</h3>
          <List
            dataSource={imageList}
            renderItem={item => (
              <List.Item onClick={() => handleItemClick(item)} className="list-item">
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
              <img src={selectedImage.path} alt={selectedImage.title} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DamageImage;
