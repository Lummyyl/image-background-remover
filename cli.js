#!/usr/bin/env node

/**
 * Image Background Remover CLI
 * 命令行界面
 */

const { Command } = require('commander');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const { removeBackground } = require('./src/background-remover');

const program = new Command();

program
  .name('background-remover')
  .description('移除图片背景的工具')
  .version('1.0.0');

// 单文件处理
program
  .command('remove')
  .description('移除单张图片的背景')
  .requiredOption('-i, --input <path>', '输入图片路径')
  .requiredOption('-o, --output <path>', '输出图片路径')
  .option('-a, --algorithm <type>', '背景移除算法', 'edge-detection')
  .option('-t, --threshold <number>', '阈值 (0-1)', '0.5')
  .option('--feathering <number>', '羽化程度', '2')
  .option('--background <color>', '替换背景颜色')
  .action(async (options) => {
    try {
      console.log(chalk.blue('🎨 开始处理图片...'));
      
      const startTime = Date.now();
      
      await removeBackground(options.input, options.output, {
        algorithm: options.algorithm,
        threshold: parseFloat(options.threshold),
        feathering: parseInt(options.feathering)
      });
      
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      
      console.log(chalk.green(`✅ 处理完成!`));
      console.log(chalk.gray(`   用时: ${duration}秒`));
      console.log(chalk.gray(`   输出: ${options.output}`));
      
    } catch (error) {
      console.error(chalk.red('❌ 处理失败:'), error.message);
      process.exit(1);
    }
  });

// 批量处理
program
  .command('batch')
  .description('批量处理图片')
  .requiredOption('-i, --input-dir <path>', '输入目录')
  .requiredOption('-o, --output-dir <path>', '输出目录')
  .option('-a, --algorithm <type>', '背景移除算法', 'edge-detection')
  .option('-t, --threshold <number>', '阈值 (0-1)', '0.5')
  .option('--feathering <number>', '羽化程度', '2')
  .option('--background <color>', '替换背景颜色')
  .option('--pattern <pattern>', '文件匹配模式', '*.{png,jpg,jpeg,webp}')
  .action(async (options) => {
    try {
      console.log(chalk.blue('🚀 开始批量处理...'));
      
      if (!fs.existsSync(options.inputDir)) {
        throw new Error(`输入目录不存在: ${options.inputDir}`);
      }
      
      // 创建输出目录
      fs.mkdirSync(options.outputDir, { recursive: true });
      
      const { BackgroundRemover } = require('./src/background-remover');
      const remover = new BackgroundRemover({
        algorithm: options.algorithm,
        threshold: parseFloat(options.threshold),
        feathering: parseInt(options.feathering)
      });
      
      const results = await remover.batchRemove(options.inputDir, options.outputDir, {
        pattern: options.pattern
      });
      
      console.log(chalk.green(`✅ 批量处理完成!`));
      console.log(chalk.gray(`   处理文件: ${results.length} 个`));
      console.log(chalk.gray(`   输出目录: ${options.outputDir}`));
      
    } catch (error) {
      console.error(chalk.red('❌ 批量处理失败:'), error.message);
      process.exit(1);
    }
  });

// 信息命令
program
  .command('info')
  .description('显示工具信息')
  .action(() => {
    console.log(chalk.cyan('🎨 Image Background Remover'));
    console.log(chalk.gray('版本: 1.0.0'));
    console.log(chalk.gray('作者: Lummyyl'));
    console.log(chalk.gray('许可证: MIT'));
    console.log('');
    console.log(chalk.yellow('支持的算法:'));
    console.log(chalk.gray('  - edge-detection: 边缘检测'));
    console.log(chalk.gray('  - color-based: 基于颜色'));
    console.log(chalk.gray('  - ml-based: 机器学习 (开发中)'));
    console.log('');
    console.log(chalk.yellow('支持的图片格式:'));
    console.log(chalk.gray('  - PNG, JPEG, WebP, BMP'));
  });

// 如果直接运行此文件
if (require.main === module) {
  program.parse();
}

module.exports = program;