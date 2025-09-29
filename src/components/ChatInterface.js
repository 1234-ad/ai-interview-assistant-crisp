import React, { useEffect, useRef } from 'react';
import { Card, Typography, Avatar, Space } from 'antd';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Text } = Typography;

const ChatInterface = ({ messages, loading }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderMessage = (message, index) => {
    const isUser = message.type === 'user';
    
    return (
      <div
        key={index}
        style={{
          display: 'flex',
          justifyContent: isUser ? 'flex-end' : 'flex-start',
          marginBottom: '16px'
        }}
      >
        <div
          style={{
            maxWidth: '70%',
            display: 'flex',
            flexDirection: isUser ? 'row-reverse' : 'row',
            alignItems: 'flex-start',
            gap: '8px'
          }}
        >
          <Avatar
            icon={isUser ? <UserOutlined /> : <RobotOutlined />}
            style={{
              backgroundColor: isUser ? '#1890ff' : '#52c41a',
              flexShrink: 0
            }}
          />
          
          <div
            style={{
              backgroundColor: isUser ? '#e6f7ff' : '#f6ffed',
              padding: '12px 16px',
              borderRadius: '12px',
              border: `1px solid ${isUser ? '#91d5ff' : '#b7eb8f'}`,
              position: 'relative'
            }}
          >
            <Text style={{ fontSize: '14px', lineHeight: '1.5' }}>
              {message.content}
            </Text>
            
            {message.timestamp && (
              <Text
                type="secondary"
                style={{
                  fontSize: '11px',
                  display: 'block',
                  marginTop: '4px',
                  textAlign: isUser ? 'right' : 'left'
                }}
              >
                {moment(message.timestamp).format('HH:mm')}
              </Text>
            )}
            
            {message.score !== undefined && (
              <div
                style={{
                  marginTop: '8px',
                  padding: '4px 8px',
                  backgroundColor: '#fff2e8',
                  borderRadius: '6px',
                  border: '1px solid #ffbb96'
                }}
              >
                <Text style={{ fontSize: '12px', fontWeight: 'bold' }}>
                  Score: {message.score}/10
                </Text>
                {message.feedback && (
                  <Text
                    type="secondary"
                    style={{ fontSize: '11px', display: 'block', marginTop: '2px' }}
                  >
                    {message.feedback}
                  </Text>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card
      title="Interview Chat"
      style={{ height: '500px', display: 'flex', flexDirection: 'column' }}
      bodyStyle={{ flex: 1, overflow: 'hidden', padding: '16px' }}
    >
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingRight: '8px'
        }}
      >
        {messages.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '40px',
              color: '#8c8c8c'
            }}
          >
            <RobotOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
            <Text type="secondary">
              Chat messages will appear here during the interview
            </Text>
          </div>
        ) : (
          messages.map((message, index) => renderMessage(message, index))
        )}
        
        {loading && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Space>
              <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#52c41a' }} />
              <Text type="secondary">AI is thinking...</Text>
            </Space>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </Card>
  );
};

export default ChatInterface;