# Bill Generator

A professional invoice generator application with logo upload functionality and multiple templates.

## Features

- **Logo Upload**: Upload and preview company logos that appear on all invoice templates
- **Multiple Templates**: Choose from 4 professional invoice templates:
  - Modern: Clean and professional design
  - Classic: Traditional business invoice
  - Minimal: Simple and elegant layout
  - Colorful: Vibrant and eye-catching
- **Multi-Currency Support**: Support for USD, KES, EUR, GBP, and INR
- **Real-time Preview**: See invoice changes instantly as you type
- **PDF Download**: Generate and download professional PDF invoices
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Sample Data**: Quick-fill functionality for testing and demonstration

## Technology Stack

- **Frontend**: React 19 with Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Icons**: Lucide React
- **PDF Generation**: jsPDF with html2canvas
- **Build Tool**: Vite
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 20 or higher
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/garymike07/billgen.git
cd billgen/bill-generator
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
pnpm run build
```

The built files will be in the `dist` directory.

## Usage

1. **Upload Logo**: Click the "Upload Logo" button to add your company logo
2. **Select Template**: Choose from the available invoice templates
3. **Choose Currency**: Select your preferred currency from the dropdown
4. **Fill Information**: Use the tabbed interface to enter:
   - Company information
   - Client details
   - Invoice information
   - Items and services
5. **Preview**: View the real-time invoice preview on the right
6. **Download**: Click "Download PDF" to generate and save your invoice

## Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Manual GitHub Pages Setup

1. Go to your repository settings
2. Navigate to "Pages" in the left sidebar
3. Under "Source", select "GitHub Actions"
4. The deployment workflow will automatically trigger on pushes to the main branch

### Live Demo

Once deployed, your bill generator will be available at:
`https://garymike07.github.io/billgen/`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/garymike07/billgen/issues) on GitHub.

