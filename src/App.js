import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Tabs, Modal, Button, Typography } from 'antd';
import { UserOutlined, DashboardOutlined } from '@ant-design/icons';
import IntervieweeTab from './components/IntervieweeTab';
import InterviewerTab from './components/InterviewerTab';
import WelcomeBackModal from './components/WelcomeBackModal';
import { resumeInterview } from './store/slices/interviewSlice';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  const dispatch = useDispatch();
  const { stage, isPaused, candidateInfo, sessionId } = useSelector(state => state.interview);
  
  const [showWelcomeBack, setShowWelcomeBack] = React.useState(false);

  useEffect(() => {
    // Check if there's an unfinished session
    if (sessionId && stage !== 'completed' && stage !== 'upload') {
      setShowWelcomeBack(true);
    }
  }, [sessionId, stage]);

  const handleResumeSession = () => {
    dispatch(resumeInterview());
    setShowWelcomeBack(false);
  };

  const tabItems = [
    {
      key: 'interviewee',
      label: (
        <span>
          <UserOutlined />
          Interviewee
        </span>
      ),
      children: <IntervieweeTab />
    },
    {
      key: 'interviewer',
      label: (
        <span>
          <DashboardOutlined />
          Interviewer Dashboard
        </span>
      ),
      children: <InterviewerTab />
    }
  ];

  return (
    <div className="app-container">
      <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
        <Header style={{ 
          background: 'rgba(255, 255, 255, 0.95)', 
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <Title level={3} style={{ color: '#1890ff', margin: '16px 0' }}>
            AI Interview Assistant - Crisp
          </Title>
        </Header>
        
        <Content style={{ padding: '20px' }}>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.95)', 
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            minHeight: 'calc(100vh - 140px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <Tabs
              defaultActiveKey="interviewee"
              items={tabItems}
              size="large"
              style={{ padding: '20px' }}
            />
          </div>
        </Content>
      </Layout>

      <WelcomeBackModal
        visible={showWelcomeBack}
        onResume={handleResumeSession}
        onClose={() => setShowWelcomeBack(false)}
        candidateInfo={candidateInfo}
      />
    </div>
  );
}

export default App;