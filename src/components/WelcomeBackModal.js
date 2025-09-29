import React from 'react';
import { Modal, Button, Typography, Space, Card } from 'antd';
import { UserOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const WelcomeBackModal = ({ visible, onResume, onClose, candidateInfo }) => {
  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={500}
      className="welcome-back-modal"
      centered
    >
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>
          👋
        </div>
        
        <Title level={3} style={{ marginBottom: '8px' }}>
          Welcome Back!
        </Title>
        
        <Text type="secondary" style={{ fontSize: '16px', display: 'block', marginBottom: '24px' }}>
          You have an unfinished interview session
        </Text>

        {candidateInfo && (
          <Card 
            size="small" 
            style={{ 
              marginBottom: '24px', 
              textAlign: 'left',
              backgroundColor: '#f6ffed',
              border: '1px solid #b7eb8f'
            }}
          >
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              {candidateInfo.name && (
                <div>
                  <UserOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
                  <Text strong>{candidateInfo.name}</Text>
                </div>
              )}
              
              {candidateInfo.email && (
                <div>
                  <Text type="secondary" style={{ fontSize: '14px' }}>
                    {candidateInfo.email}
                  </Text>
                </div>
              )}
              
              <div>
                <ClockCircleOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Session started earlier
                </Text>
              </div>
            </Space>
          </Card>
        )}

        <Space size="large">
          <Button 
            type="primary" 
            size="large"
            onClick={onResume}
            style={{ minWidth: '120px' }}
          >
            Resume Interview
          </Button>
          
          <Button 
            size="large"
            onClick={onClose}
            style={{ minWidth: '120px' }}
          >
            Start Fresh
          </Button>
        </Space>

        <div style={{ marginTop: '20px', padding: '12px', backgroundColor: '#fff7e6', borderRadius: '6px' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            💡 Your progress is automatically saved. You can resume where you left off or start a new session.
          </Text>
        </div>
      </div>
    </Modal>
  );
};

export default WelcomeBackModal;