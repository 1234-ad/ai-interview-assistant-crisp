import React from 'react';
import { Typography } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

const Timer = ({ timeRemaining, difficulty }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerClass = () => {
    const totalTime = difficulty === 'easy' ? 20 : difficulty === 'medium' ? 60 : 120;
    const ratio = timeRemaining / totalTime;
    
    if (ratio <= 0.2) return 'timer-display'; // Red - critical
    if (ratio <= 0.5) return 'timer-display warning'; // Orange - warning
    return 'timer-display normal'; // Green - normal
  };

  const getTimerColor = () => {
    const totalTime = difficulty === 'easy' ? 20 : difficulty === 'medium' ? 60 : 120;
    const ratio = timeRemaining / totalTime;
    
    if (ratio <= 0.2) return '#ff4d4f'; // Red
    if (ratio <= 0.5) return '#faad14'; // Orange
    return '#52c41a'; // Green
  };

  return (
    <div className={getTimerClass()}>
      <ClockCircleOutlined style={{ marginRight: '8px' }} />
      <Text strong style={{ color: 'white' }}>
        {formatTime(timeRemaining)}
      </Text>
    </div>
  );
};

export default Timer;