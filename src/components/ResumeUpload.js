import React, { useState } from 'react';
import { Upload, message, Card, Typography, Button } from 'antd';
import { InboxOutlined, FileTextOutlined } from '@ant-design/icons';
import { extractTextFromPDF, extractTextFromDOCX, parseResumeText } from '../utils/resumeParser';

const { Dragger } = Upload;
const { Title, Text } = Typography;

const ResumeUpload = ({ onUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileUpload = async (file) => {
    setUploading(true);
    
    try {
      let extractedText = '';
      
      if (file.type === 'application/pdf') {
        extractedText = await extractTextFromPDF(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        extractedText = await extractTextFromDOCX(file);
      } else {
        throw new Error('Unsupported file type. Please upload PDF or DOCX files only.');
      }
      
      const parsedData = parseResumeText(extractedText);
      
      setUploadedFile({
        name: file.name,
        type: file.type,
        size: file.size
      });
      
      onUpload(parsedData);
      
      message.success('Resume uploaded and processed successfully!');
    } catch (error) {
      message.error(error.message || 'Failed to process resume. Please try again.');
    } finally {
      setUploading(false);
    }
    
    return false; // Prevent default upload behavior
  };

  const uploadProps = {
    name: 'resume',
    multiple: false,
    accept: '.pdf,.docx',
    beforeUpload: handleFileUpload,
    showUploadList: false,
    disabled: uploading
  };

  return (
    <Card>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Title level={4}>Upload Your Resume</Title>
        <Text type="secondary">
          Please upload your resume in PDF or DOCX format. We'll extract your information automatically.
        </Text>
      </div>
      
      {!uploadedFile ? (
        <Dragger {...uploadProps} className="upload-area">
          <p className="ant-upload-drag-icon">
            <InboxOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
          </p>
          <p className="ant-upload-text" style={{ fontSize: '16px', fontWeight: 'bold' }}>
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint" style={{ fontSize: '14px' }}>
            Support for PDF and DOCX files only. Maximum file size: 10MB
          </p>
          {uploading && (
            <div style={{ marginTop: '20px' }}>
              <Text type="secondary">Processing your resume...</Text>
            </div>
          )}
        </Dragger>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <FileTextOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }} />
          <Title level={5} style={{ color: '#52c41a', marginBottom: '8px' }}>
            Resume Uploaded Successfully!
          </Title>
          <Text type="secondary" style={{ display: 'block', marginBottom: '20px' }}>
            {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)
          </Text>
          <Button 
            type="link" 
            onClick={() => {
              setUploadedFile(null);
            }}
          >
            Upload Different Resume
          </Button>
        </div>
      )}
      
      <div style={{ marginTop: '20px', padding: '16px', background: '#f6ffed', borderRadius: '6px' }}>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          <strong>Privacy Note:</strong> Your resume data is processed locally and stored only in your browser. 
          We extract basic information (name, email, phone) to personalize your interview experience.
        </Text>
      </div>
    </Card>
  );
};

export default ResumeUpload;