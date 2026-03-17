# Image Background Remover - Web Application

A modern web application for removing backgrounds from images using Next.js and Tailwind CSS.

## Features

- 🎨 **AI-Powered Background Removal**: Remove backgrounds from images with advanced algorithms
- 🚀 **Fast Processing**: Real-time background removal with optimized algorithms
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🎯 **Multiple Algorithms**: Choose from edge detection, color-based, or ML-based removal
- 🎛️ **Customizable Options**: Adjust threshold and feathering for optimal results
- 📁 **Multiple Formats**: Support for PNG, JPG, WebP, and more
- 💾 **Easy Download**: Download processed images with transparent backgrounds

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Image Processing**: Canvas API with custom algorithms
- **State Management**: React Hooks
- **Icons**: SVG icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Lummyyl/image-background-remover.git
cd image-background-remover/web-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Upload an Image**: Drag and drop or click to upload an image
2. **Choose Algorithm**: Select from Edge Detection, Color Based, or ML-based
3. **Adjust Settings**: Fine-tune threshold and feathering options
4. **Process**: Click "Remove Background" to start processing
5. **Download**: Save the processed image with transparent background

## Algorithms

### Edge Detection
- Best for images with clear subject-background separation
- Removes background based on edge detection
- Good for high contrast images

### Color Based
- Removes background based on color similarity
- Works well when background has distinct colors
- Less effective for complex backgrounds

### Machine Learning (Coming Soon)
- Advanced AI-powered background removal
- Better results for complex scenes
- Currently in development

## Project Structure

```
web-app/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   │   ├── ImageUpload.tsx
│   │   ├── ImagePreview.tsx
│   │   └── BackgroundRemover.tsx
│   ├── lib/                # Utility functions
│   └── types/              # TypeScript definitions
├── public/                 # Static assets
├── tailwind.config.ts     # Tailwind configuration
├── next.config.js         # Next.js configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies
```

## Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Adding New Features

1. Create new components in `src/components/`
2. Add TypeScript types in `src/types/`
3. Update the main page in `src/app/page.tsx`
4. Add styles in `src/app/globals.css`

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Considerations

- Images are processed client-side using Canvas API
- Large images may take longer to process
- For production, consider server-side processing for better performance

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see the [LICENSE](../LICENSE) file for details

## Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/Lummyyl/image-background-remover/issues)
- Email: lummyyl@example.com

## Roadmap

- [ ] Machine learning-based background removal
- [ ] Batch processing
- [ ] API for developers
- [ ] Mobile app
- [ ] Advanced editing features
- [ ] Cloud processing for large images