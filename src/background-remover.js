/**
 * Image Background Remover
 * 主要的背景移除功能模块
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

/**
 * 背景移除器类
 */
class BackgroundRemover {
  constructor(options = {}) {
    this.options = {
      algorithm: 'edge-detection', // edge-detection, color-based, ml-based
      threshold: 0.5,
      feathering: 2,
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
      let result;
      switch (finalOptions.algorithm) {
        case 'edge-detection':
          result = await this.edgeDetectionMethod(inputImage, metadata);
          break;
        case 'color-based':
          result = await this.colorBasedMethod(inputImage, metadata);
          break;
        case 'ml-based':
          result = await this.mlBasedMethod(inputImage, metadata);
          break;
        default:
          throw new Error(`未知的算法: ${finalOptions.algorithm}`);
      }

      // 保存结果
      await result.toFile(outputPath);
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
      .threshold(this.options.threshold * 255)
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
      .threshold(this.options.threshold * 255)
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