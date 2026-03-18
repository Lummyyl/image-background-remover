/**
 * Image Background Remover
 * 主要的背景移除功能模块
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const axios = require('axios');
const FormData = require('form-data');

/**
 * 背景移除器类
 */
class BackgroundRemover {
  constructor(options = {}) {
    this.options = {
      algorithm: 'edge-detection', // edge-detection, color-based, ml-based, remove-bg
      threshold: 0.5,
      feathering: 2,
      removeBgApiKey: '', // Remove.bg API Key
      ...options
    };
  }

  /**
   * 移除图片背景
   * @param {string} inputPath - 输入图片路径
   * @param {string} outputPath - 输出图片路径
   * @param {Object} options - 额外选项
   * @returns {Promise<void>}
   */
  async removeBackground(inputPath, outputPath, options = {}) {
    const finalOptions = { ...this.options, ...options };
    
    try {
      // 读取图片
      const inputImage = sharp(inputPath);
      const metadata = await inputImage.metadata();
      
      console.log(`处理图片: ${inputPath}`);
      console.log(`图片信息: ${metadata.width}x${metadata.height}, ${metadata.format}`);

      // 根据算法处理
      switch (finalOptions.algorithm) {
        case 'edge-detection':
          result = await this.edgeDetectionMethod(inputImage, metadata);
          await result.toFile(outputPath);
          break;
        case 'color-based':
          result = await this.colorBasedMethod(inputImage, metadata);
          await result.toFile(outputPath);
          break;
        case 'ml-based':
          result = await this.mlBasedMethod(inputImage, metadata);
          await result.toFile(outputPath);
          break;
        case 'remove-bg':
          await this.removeBgMethod(inputPath, outputPath);
          break;
        default:
          throw new Error(`未知的算法: ${finalOptions.algorithm}`);
      }
      console.log(`背景移除完成: ${outputPath}`);

    } catch (error) {
      console.error('背景移除失败:', error.message);
      throw error;
    }
  }

  /**
   * 基于边缘检测的方法
   */
  async edgeDetectionMethod(inputImage, metadata) {
    // 灰度化
    const grayscale = await inputImage.grayscale().toBuffer();
    
    // 边缘检测（简化版本）
    // 在实际应用中，这里会使用更复杂的算法
    const edges = await sharp(grayscale)
      .convolve({
        width: 3,
        height: 3,
        kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1]
      })
      .toBuffer();

    // 创建蒙版
    const mask = await sharp(edges)
      .threshold(Math.round(this.options.threshold * 255))
      .toBuffer();

    // 应用蒙版
    return inputImage.composite([{
      input: mask,
      blend: 'dest-in'
    }]);
  }

  /**
   * 基于颜色的方法
   */
  async colorBasedMethod(inputImage, metadata) {
    // 转换为 RGBA
    const rgba = await inputImage.toColorspace('srgb').toBuffer();
    
    // 创建蒙版（简化版本）
    // 在实际应用中，这里会分析背景颜色并创建精确的蒙版
    const mask = await sharp(rgba)
      .threshold(Math.round(this.options.threshold * 255))
      .toBuffer();

    return inputImage.composite([{
      input: mask,
      blend: 'dest-in'
    }]);
  }

  /**
   * 基于机器学习的方法（预留）
   */
  async mlBasedMethod(inputImage, metadata) {
    // 这里可以集成 TensorFlow.js 或其他 ML 模型
    console.log('ML 方法暂未实现，使用边缘检测替代');
    return this.edgeDetectionMethod(inputImage, metadata);
  }

  /**
   * 使用 Remove.bg API 移除背景
   */
  async removeBgMethod(inputPath, outputPath) {
    if (!this.options.removeBgApiKey) {
      throw new Error('Remove.bg API Key 未配置');
    }

    try {
      console.log('使用 Remove.bg API 处理图片...');
      console.log('API Key:', this.options.removeBgApiKey.substring(0, 8) + '...');
      
      // 创建 FormData
      const formData = new FormData();
      
      // 读取图片文件并添加到 FormData
      const imageBuffer = await fs.readFile(inputPath);
      const imageStats = await fs.stat(inputPath);
      
      formData.append('image_file', imageBuffer, {
        filename: path.basename(inputPath),
        contentType: 'image/jpeg'  // 保持原始图片格式
      });
      
      // 添加其他参数
      formData.append('size', 'auto');
      formData.append('type', 'auto');
      formData.append('format', 'png');
      formData.append('crop', 'false');
      
      console.log(`图片大小: ${imageStats.size} bytes`);
      
      // 调用 Remove.bg API
      const response = await axios.post(
        'https://api.remove.bg/v1.0/removebg',
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            'X-Api-Key': this.options.removeBgApiKey
          },
          responseType: 'arraybuffer',
          timeout: 60000  // 60秒超时
        }
      );

      // 检查响应状态
      if (response.status !== 200) {
        throw new Error(`Remove.bg API 返回状态码: ${response.status}`);
      }

      // 检查响应数据
      if (!response.data || response.data.byteLength === 0) {
        throw new Error('Remove.bg API 返回空数据');
      }

      // 保存处理后的图片
      await fs.writeFile(outputPath, Buffer.from(response.data));
      console.log(`Remove.bg 处理完成: ${outputPath}`);
      console.log(`输出文件大小: ${Buffer.from(response.data).length} bytes`);

    } catch (error) {
      console.error('Remove.bg API 调用失败:', error.message);
      if (error.response) {
        console.error('错误响应:', error.response.status);
        console.error('错误数据:', error.response.data?.toString?.() || error.response.data);
      }
      throw error;
    }
  }

  /**
   * 批量处理图片
   * @param {string} inputDir - 输入目录
   * @param {string} outputDir - 输出目录
   * @param {Object} options - 选项
   * @returns {Promise<Array<string>>}
   */
  async batchRemove(inputDir, outputDir, options = {}) {
    const files = await fs.readdir(inputDir);
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.bmp'];
    
    const imageFiles = files.filter(file => 
      imageExtensions.includes(path.extname(file).toLowerCase())
    );

    const results = [];
    
    for (const file of imageFiles) {
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(outputDir, file);
      
      try {
        await this.removeBackground(inputPath, outputPath, options);
        results.push(outputPath);
      } catch (error) {
        console.error(`处理 ${file} 失败:`, error.message);
      }
    }

    return results;
  }
}

/**
 * 便捷函数：移除背景
 * @param {string} inputPath - 输入图片路径
 * @param {string} outputPath - 输出图片路径
 * @param {Object} options - 选项
 * @returns {Promise<void>}
 */
async function removeBackground(inputPath, outputPath, options = {}) {
  const remover = new BackgroundRemover(options);
  return remover.removeBackground(inputPath, outputPath, options);
}

module.exports = {
  BackgroundRemover,
  removeBackground
};