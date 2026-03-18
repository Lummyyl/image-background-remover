import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [imageInput, setImageInput] = useState(null);
  const [processBtn, setProcessBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resultSection, setResultSection] = useState(false);
  const [originalImage, setOriginalImage] = useState('');
  const [processedImage, setProcessedImage] = useState('');
  const [downloadBtn, setDownloadBtn] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setProcessBtn(false);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAlgorithmChange = (e) => {
    const algorithm = e.target.value;
    const apiKeyGroup = document.getElementById('apiKeyGroup');
    
    if (algorithm === 'remove-bg') {
      apiKeyGroup.style.display = 'flex';
      // 自动填充 API Key
      const configApiKey = 'NR6A5rLUCEkNykgRyivU1MXu';
      document.getElementById('removeBgApiKey').value = configApiKey;
    } else {
      apiKeyGroup.style.display = 'none';
    }
  };

  const handleProcess = async () => {
    if (!uploadedFile) return;

    setError('');
    setSuccess('');
    setLoading(true);
    setResultSection(false);

    const formData = new FormData();
    formData.append('image', uploadedFile);
    formData.append('algorithm', document.getElementById('algorithm').value);
    formData.append('threshold', document.getElementById('threshold').value);
    formData.append('feathering', document.getElementById('feathering').value);
    
    const algorithm = document.getElementById('algorithm').value;
    if (algorithm === 'remove-bg') {
      const apiKey = document.getElementById('removeBgApiKey').value;
      if (!apiKey) {
        setLoading(false);
        setError('请输入 Remove.bg API Key');
        return;
      }
      formData.append('removeBgApiKey', apiKey);
    }

    try {
      const response = await fetch('/api/remove-background', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        setLoading(false);
        setSuccess(result.message);
        setProcessedImage(result.outputUrl);
        setResultSection(true);
        
        setDownloadBtn(() => () => {
          const link = document.createElement('a');
          link.href = result.outputUrl;
          link.download = `processed-${uploadedFile.name}`;
          link.click();
        });
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setLoading(false);
      setError('处理失败: ' + err.message);
    }
  };

  return (
    <div>
      <Head>
        <title>图像背景移除工具</title>
        <meta name="description" content="专业的图像背景移除工具，支持多种算法" />
      </Head>

      <div className="container">
        <div className="header">
          <h1>🎨 图像背景移除工具</h1>
          <p>轻松移除图片背景，支持多种算法和自定义参数</p>
        </div>

        <div className="content">
          <div className="upload-section">
            <div className="upload-area">
              <div className="upload-icon">📸</div>
              <h3>选择图片文件</h3>
              <p>支持 PNG, JPEG, WebP, BMP 格式，最大 10MB</p>
              <input 
                type="file" 
                id="imageInput" 
                className="file-input" 
                accept="image/*"
                onChange={handleImageChange}
              />
              <button className="upload-btn" onClick={() => document.getElementById('imageInput').click()}>
                选择图片
              </button>
            </div>

            <div className="controls">
              <div className="control-group">
                <label htmlFor="algorithm">处理算法</label>
                <select id="algorithm" onChange={handleAlgorithmChange}>
                  <option value="edge-detection">边缘检测</option>
                  <option value="color-based">基于颜色</option>
                  <option value="remove-bg">Remove.bg API</option>
                </select>
              </div>
              <div className="control-group">
                <label htmlFor="threshold">阈值 (0-1)</label>
                <input 
                  type="number" 
                  id="threshold" 
                  min="0" 
                  max="1" 
                  step="0.1" 
                  value="0.5"
                />
              </div>
              <div className="control-group">
                <label htmlFor="feathering">羽化程度</label>
                <input 
                  type="number" 
                  id="feathering" 
                  min="0" 
                  max="10" 
                  step="1" 
                  value="2"
                />
              </div>
              <div className="control-group" id="apiKeyGroup" style={{ display: 'none' }}>
                <label htmlFor="removeBgApiKey">Remove.bg API Key</label>
                <input 
                  type="password" 
                  id="removeBgApiKey" 
                  placeholder="输入你的 API Key"
                />
              </div>
            </div>

            <button className="process-btn" onClick={handleProcess} disabled={!uploadedFile}>
              开始处理
            </button>
          </div>

          <div className="loading" style={{ display: loading ? 'block' : 'none' }}>
            <div className="spinner"></div>
            <h3>正在处理图片...</h3>
            <p>请稍候，这可能需要几秒钟</p>
          </div>

          <div className="error" style={{ display: error ? 'block' : 'none' }}>
            {error}
          </div>

          <div className="success" style={{ display: success ? 'block' : 'none' }}>
            {success}
          </div>

          <div className="result-section" style={{ display: resultSection ? 'block' : 'none' }}>
            <h2>处理结果</h2>
            <div className="result-grid">
              <div className="result-item">
                <h3>原始图片</h3>
                <img 
                  src={originalImage} 
                  alt="原始图片" 
                  className="result-image"
                />
              </div>
              <div className="result-item">
                <h3>处理后图片</h3>
                <img 
                  src={processedImage} 
                  alt="处理后图片" 
                  className="result-image"
                />
                <br />
                <button className="download-btn" onClick={downloadBtn}>
                  下载结果
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}