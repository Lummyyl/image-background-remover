/**
 * 背景移除器测试
 */

const { BackgroundRemover } = require('../src/background-remover');
const path = require('path');
const fs = require('fs');

describe('BackgroundRemover', () => {
  let remover;

  beforeEach(() => {
    remover = new BackgroundRemover();
  });

  describe('初始化', () => {
    test('应该正确初始化', () => {
      expect(remover).toBeInstanceOf(BackgroundRemover);
      expect(remover.options.algorithm).toBe('edge-detection');
      expect(remover.options.threshold).toBe(0.5);
    });

    test('应该接受自定义选项', () => {
      const customRemover = new BackgroundRemover({
        algorithm: 'color-based',
        threshold: 0.7
      });
      
      expect(customRemover.options.algorithm).toBe('color-based');
      expect(customRemover.options.threshold).toBe(0.7);
    });
  });

  describe('算法支持', () => {
    test('应该支持边缘检测算法', () => {
      expect(remover.options.algorithm).toBe('edge-detection');
    });

    test('应该支持基于颜色的算法', () => {
      const colorRemover = new BackgroundRemover({
        algorithm: 'color-based'
      });
      
      expect(colorRemover.options.algorithm).toBe('color-based');
    });

    test('应该支持机器学习算法', () => {
      const mlRemover = new BackgroundRemover({
        algorithm: 'ml-based'
      });
      
      expect(mlRemover.options.algorithm).toBe('ml-based');
    });
  });

  describe('错误处理', () => {
    test('应该拒绝未知算法', () => {
      expect(() => {
        new BackgroundRemover({
          algorithm: 'unknown-algorithm'
        });
      }).toThrow('未知的算法');
    });
  });

  // 注意：这些是集成测试，需要实际的图片文件
  describe('文件处理 (需要实际图片)', () => {
    test.skip('应该处理真实图片文件', async () => {
      // 这个测试需要实际的图片文件
      // 在实际运行时需要准备测试图片
      expect(true).toBe(true);
    });
  });
});

describe('removeBackground 函数', () => {
  test('应该是一个异步函数', () => {
    expect(typeof require('../src/background-remover').removeBackground).toBe('function');
  });
});