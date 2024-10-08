import React, { useState, useEffect } from 'react';
import { List, Select, DatePicker, Button, Form, Row, Col, Spin, ConfigProvider, Typography, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import config from './config';
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
  const [manufacturingMonths, setManufacturingMonths] = useState([]); 
  const [damageType, setDamageType] = useState('All');
  const [damageSeverity, setDamageSeverity] = useState('All');
  const [partDamagedType, setPartDamagedType] = useState('All');
  const [manufacturingMonth, setManufacturingMonth] = useState('All'); 
  const [selectedModels, setSelectedModels] = useState(['All']); // Default to "All"
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);
  const [showImageInfo, setShowImageInfo] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          'Content-Type': 'application/json',
          'API-Key': config.apiKey
        };

        const [partsResponse, damageResponse, severityResponse, modelsResponse, monthsResponse] = await Promise.all([
          fetch(`${config.BASE_URL}?dataset=getPartsDamaged`, { headers }),
          fetch(`${config.BASE_URL}?dataset=getDamageTypes`, { headers }),
          fetch(`${config.BASE_URL}?dataset=getSeverityTypes`, { headers }),
          fetch(`${config.BASE_URL}?dataset=getModels`, { headers }),
          fetch(`${config.BASE_URL}?dataset=getManfMonth`, { headers }) 
        ]);

        if (!partsResponse.ok || !damageResponse.ok || !severityResponse.ok || !modelsResponse.ok || !monthsResponse.ok) {
          throw new Error('Failed to fetch data from one or more APIs');
        }

        const partsData = await partsResponse.json();
        const damageData = await damageResponse.json();
        const severityData = await severityResponse.json();
        const modelsData = await modelsResponse.json();
        const monthsData = await monthsResponse.json(); 

        setPartDamaged(partsData.data.partDamaged);
        setDamageTypes(damageData.data.damageType);
        setSeverityTypes(severityData.data.severity);
        setModels(modelsData.data.model);
        setManufacturingMonths(monthsData.data.manfMonth || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleModelChange = (value) => {
    if (value.includes('All') && value.length > 1) {
      // If "All" is selected along with others, remove "All"
      setSelectedModels(value.filter(model => model !== 'All'));
    } else if (!value.length) {
      // If nothing is selected, default back to "All"
      setSelectedModels(['All']);
    } else {
      setSelectedModels(value); // Otherwise, just set the selected values
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const headers = {
        'Content-Type': 'application/json',
        'API-Key': config.apiKey
      };

      let model = selectedModels.includes('All') ? 'All' : selectedModels.join(','); // If "All" is selected, use "All"

      const params = {
        dataset: "getImages",
        model,
        damageType,
        partDamaged: partDamagedType,
        severity: damageSeverity,
        prd_ln: "DISHWASHER",
        manufacturingMonth, 
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
      setSelectedImage(null); 
      setShowImageInfo(false);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (image) => {
    setSelectedImage(image);
    setImageLoading(true);
    setShowImageInfo(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setShowImageInfo(true);
  };

  return (
    <div className="images-component">
      <Form layout="vertical">
        <Row gutter={16}>
          <Col span={3}>
            <Form.Item label="Product Type" required>
              <Select value={productType} onChange={(value) => setProductType(value)}>
              <Option value="null">Select</Option>
                {productTypes.map(type => (
                  <Option key={type} value={type}>{type}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={3}>
            <Form.Item label="Manufacturing Month">
              <Select value={manufacturingMonth} onChange={(value) => setManufacturingMonth(value)}>
                <Option value="All">All</Option>
                {manufacturingMonths.map(month => (
                  <Option key={month} value={month}>{month}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={3}>
            <Form.Item label="Damage Type">
              <Select value={damageType} onChange={(value) => setDamageType(value)}>
                <Option value="All">All</Option>
                {damageTypes.map(type => (
                  <Option key={type} value={type}>{type}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={3}>
            <Form.Item label="Damage Severity">
              <Select value={damageSeverity} onChange={(value) => setDamageSeverity(value)}>
                <Option value="All">All</Option>
                {severityTypes.map(type => (
                  <Option key={type} value={type}>{type}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={3}>
            <Form.Item label="Part Damaged">
              <Select value={partDamagedType} onChange={(value) => setPartDamagedType(value)}>
                <Option value="All">All</Option>
                {partDamaged.map(part => (
                  <Option key={part} value={part}>{part}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={5}>
            <Form.Item label="Model">
              <Select
                mode="multiple" // Enable multi-selection
                showSearch
                value={selectedModels}
                onChange={handleModelChange}
                filterOption={(input, option) =>
                  option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                placeholder="Select Models"
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

          <Col span={24} style={{ textAlign: 'right' }}>
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
                <List.Item
                  onClick={() => handleItemClick(item)}
                  className="list-item"
                  style={{
                    backgroundColor: selectedImage === item ? '#577FB5' : 'white', // Highlight only when selected
                    cursor: 'pointer', // Make cursor pointer for clickable effect
                  }}
                >
                  <Typography.Text mark></Typography.Text> {item.title1 || item.title}
                </List.Item>
              )}
            />
          </div>
          <div className="selected-image-container" style={{ display: 'flex', alignItems: 'flex-start' }}>
            {imageLoading && (
              <div className="loading-spinner">
                <Spin size="large" />
              </div>
            )}
            {selectedImage && (
              <>
                <div className="selected-image">
                  <h2 className="image-title">{selectedImage.title1 || selectedImage.title}</h2>
                  {Array.isArray(selectedImage.path) && selectedImage.path.map((img, index) => (
                    <div key={index}>
                      <h3>{img.title}</h3>
                      <img src={img.path} alt={img.title} onLoad={handleImageLoad} />
                    </div>
                  ))}
                </div>

                {showImageInfo && (
                  <div className="image-info" style={{ marginLeft: '20px' }}>
                    <p><strong>Damage Type:</strong> {selectedImage.damageType}</p>
                    <p><strong>Severity:</strong> {selectedImage.severity}</p>
                    <p><strong>Part Damaged:</strong> {selectedImage.partDamaged}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DamageImage;
