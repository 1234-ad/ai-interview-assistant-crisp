import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Card,
  Table,
  Input,
  Select,
  Button,
  Typography,
  Space,
  Tag,
  Modal,
  Descriptions,
  Timeline,
  Badge,
  Empty,
  Statistic,
  Row,
  Col
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  DeleteOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import {
  setSearchTerm,
  setSortBy,
  setSortOrder,
  setSelectedCandidate,
  deleteCandidate,
  clearAllCandidates
} from '../store/slices/candidatesSlice';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;

const InterviewerTab = () => {
  const dispatch = useDispatch();
  const { candidates, searchTerm, sortBy, sortOrder, selectedCandidate } = useSelector(
    state => state.candidates
  );
  
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  // Filter and sort candidates
  const filteredAndSortedCandidates = useMemo(() => {
    let filtered = candidates.filter(candidate =>
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'date':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'score':
        default:
          aValue = a.score || 0;
          bValue = b.score || 0;
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [candidates, searchTerm, sortBy, sortOrder]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (candidates.length === 0) {
      return {
        totalCandidates: 0,
        averageScore: 0,
        highestScore: 0,
        completionRate: 0
      };
    }

    const totalScore = candidates.reduce((sum, candidate) => sum + (candidate.score || 0), 0);
    const averageScore = totalScore / candidates.length;
    const highestScore = Math.max(...candidates.map(c => c.score || 0));
    const completedCandidates = candidates.filter(c => c.status === 'completed').length;
    const completionRate = (completedCandidates / candidates.length) * 100;

    return {
      totalCandidates: candidates.length,
      averageScore: Math.round(averageScore * 10) / 10,
      highestScore,
      completionRate: Math.round(completionRate)
    };
  }, [candidates]);

  const handleViewDetails = (candidate) => {
    dispatch(setSelectedCandidate(candidate));
    setDetailModalVisible(true);
  };

  const handleDeleteCandidate = (candidateId) => {
    Modal.confirm({
      title: 'Delete Candidate',
      content: 'Are you sure you want to delete this candidate? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      onOk: () => {
        dispatch(deleteCandidate(candidateId));
      }
    });
  };

  const handleClearAll = () => {
    Modal.confirm({
      title: 'Clear All Candidates',
      content: 'Are you sure you want to delete all candidates? This action cannot be undone.',
      okText: 'Clear All',
      okType: 'danger',
      onOk: () => {
        dispatch(clearAllCandidates());
      }
    });
  };

  const getScoreColor = (score) => {
    if (score >= 8) return '#52c41a'; // Green
    if (score >= 6) return '#faad14'; // Orange
    if (score >= 4) return '#1890ff'; // Blue
    return '#ff4d4f'; // Red
  };

  const getScoreTag = (score) => {
    if (score >= 8) return { color: 'success', text: 'Excellent' };
    if (score >= 6) return { color: 'warning', text: 'Good' };
    if (score >= 4) return { color: 'processing', text: 'Average' };
    return { color: 'error', text: 'Poor' };
  };

  const columns = [
    {
      title: 'Candidate',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div>
          <Text strong>{name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.email}
          </Text>
        </div>
      ),
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      render: (score) => {
        const tag = getScoreTag(score);
        return (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: getScoreColor(score) }}>
              {score}/10
            </div>
            <Tag color={tag.color} style={{ fontSize: '10px' }}>
              {tag.text}
            </Tag>
          </div>
        );
      },
      sorter: true,
      width: 120,
    },
    {
      title: 'Interview Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => (
        <div>
          <Text>{moment(date).format('MMM DD, YYYY')}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {moment(date).format('HH:mm')}
          </Text>
        </div>
      ),
      sorter: true,
      width: 140,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge
          status={status === 'completed' ? 'success' : 'processing'}
          text={status === 'completed' ? 'Completed' : 'In Progress'}
        />
      ),
      width: 120,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewDetails(record)}
          >
            View
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDeleteCandidate(record.id)}
          />
        </Space>
      ),
      width: 120,
    },
  ];

  const renderDetailModal = () => {
    if (!selectedCandidate) return null;

    return (
      <Modal
        title={`Interview Details - ${selectedCandidate.name}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
        style={{ top: 20 }}
      >
        <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {/* Candidate Info */}
          <Card size="small" style={{ marginBottom: '16px' }}>
            <Descriptions title="Candidate Information" column={2}>
              <Descriptions.Item label="Name">{selectedCandidate.name}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedCandidate.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{selectedCandidate.phone}</Descriptions.Item>
              <Descriptions.Item label="Final Score">
                <Text style={{ fontSize: '16px', fontWeight: 'bold', color: getScoreColor(selectedCandidate.score) }}>
                  {selectedCandidate.score}/10
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* AI Summary */}
          {selectedCandidate.summary && (
            <Card size="small" title="AI Summary" style={{ marginBottom: '16px' }}>
              <Text>{selectedCandidate.summary}</Text>
            </Card>
          )}

          {/* Questions and Answers */}
          <Card size="small" title="Interview Questions & Answers">
            <Timeline>
              {selectedCandidate.questions?.map((question, index) => {
                const answer = selectedCandidate.answers?.[index];
                return (
                  <Timeline.Item
                    key={index}
                    dot={
                      <Badge
                        count={index + 1}
                        style={{ backgroundColor: '#1890ff' }}
                      />
                    }
                  >
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ marginBottom: '8px' }}>
                        <Tag color={
                          question.difficulty === 'easy' ? 'green' :
                          question.difficulty === 'medium' ? 'orange' : 'red'
                        }>
                          {question.difficulty.toUpperCase()}
                        </Tag>
                        <Text strong>{question.question}</Text>
                      </div>
                      
                      {answer && (
                        <div style={{ 
                          backgroundColor: '#f5f5f5', 
                          padding: '12px', 
                          borderRadius: '6px',
                          marginTop: '8px'
                        }}>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            Answer:
                          </Text>
                          <div style={{ marginTop: '4px' }}>
                            <Text>{answer.answer}</Text>
                          </div>
                          {answer.timeUsed && (
                            <div style={{ marginTop: '8px' }}>
                              <Text type="secondary" style={{ fontSize: '11px' }}>
                                Time used: {answer.timeUsed}s
                              </Text>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Timeline.Item>
                );
              })}
            </Timeline>
          </Card>
        </div>
      </Modal>
    );
  };

  return (
    <div>
      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Candidates"
              value={stats.totalCandidates}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Average Score"
              value={stats.averageScore}
              suffix="/ 10"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: getScoreColor(stats.averageScore) }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Highest Score"
              value={stats.highestScore}
              suffix="/ 10"
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: getScoreColor(stats.highestScore) }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Completion Rate"
              value={stats.completionRate}
              suffix="%"
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Table Card */}
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4} style={{ margin: 0 }}>
              Candidates Dashboard
            </Title>
            {candidates.length > 0 && (
              <Button danger onClick={handleClearAll}>
                Clear All
              </Button>
            )}
          </div>
        }
      >
        {/* Filters */}
        <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Input
            placeholder="Search by name or email..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            style={{ width: 300 }}
          />
          
          <Select
            value={sortBy}
            onChange={(value) => dispatch(setSortBy(value))}
            style={{ width: 120 }}
          >
            <Option value="score">Score</Option>
            <Option value="name">Name</Option>
            <Option value="date">Date</Option>
          </Select>
          
          <Select
            value={sortOrder}
            onChange={(value) => dispatch(setSortOrder(value))}
            style={{ width: 120 }}
          >
            <Option value="desc">Descending</Option>
            <Option value="asc">Ascending</Option>
          </Select>
        </div>

        {/* Table */}
        {filteredAndSortedCandidates.length === 0 ? (
          <Empty
            description={
              candidates.length === 0 
                ? "No candidates have completed interviews yet"
                : "No candidates match your search criteria"
            }
            style={{ padding: '40px' }}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredAndSortedCandidates}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} candidates`,
            }}
            className="candidate-table"
          />
        )}
      </Card>

      {/* Detail Modal */}
      {renderDetailModal()}
    </div>
  );
};

export default InterviewerTab;