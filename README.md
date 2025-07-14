# Smart Home Dashboard

![Smart Home Dashboard](https://img.shields.io/badge/React-18.2.0-blue)
![Material-UI](https://img.shields.io/badge/Material--UI-5.14.0-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## Overview
A modern, responsive smart home management dashboard built with React and Material-UI. This application allows users to monitor and control various smart devices throughout their home, manage rooms, track energy consumption, and view device statuses at a glance.

## 🚀 Features

### Home Management
- **Room Overview**: View all rooms in your home with their connected devices
- **Device Control**: Toggle devices on/off with a simple switch
- **Room Management**: Add, edit, and delete rooms
- **Device Management**: Add and remove devices from rooms
- **Device Status**: Real-time status monitoring of all connected devices
- **Room Temperature**: Monitor and control room temperatures
- **Lighting Control**: Adjust brightness and color of smart lights

### Dashboard
- **Energy Consumption Tracking**: View energy usage data in daily, weekly, or monthly formats
- **Quick Access Devices**: Control frequently used devices from any room
- **Room Controls**: Expand/collapse room details to manage devices
- **Device Discovery**: Automatically discover new devices on your network
- **Usage Analytics**: Detailed insights into device usage patterns
- **Cost Estimation**: Calculate energy costs based on usage
- **Customizable Widgets**: Arrange dashboard widgets according to preference

### User Management
- **User Authentication**: Basic login functionality with guest access option
- **Member Management**: View and manage household members with different access levels
- **Role-based Access**: Different permission levels for family members
- **Activity Logs**: Track user actions and device changes
- **Notification Preferences**: Customize alerts and notifications

## 🛠️ Getting Started

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- Git
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd project-internship
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Build for production
```bash
npm run build
```

5. Serve production build locally
```bash
serve -s build
```

### Environment Setup
Create a `.env` file in the root directory with the following variables:
```env
REACT_APP_API_URL=your_api_url
REACT_APP_WEBSOCKET_URL=your_websocket_url
```

## 📁 Project Structure

```
src/
├── components/         # React components
│   ├── Dashboard/     # Dashboard related components
│   ├── Home/         # Home management components
│   ├── Auth/         # Authentication components
│   ├── Layout/       # Layout components
│   └── Common/       # Shared components
├── hooks/            # Custom React hooks
├── context/          # React context providers
├── services/         # API and service integrations
├── utils/            # Utility functions
├── assets/           # Static assets
├── styles/           # Global styles
├── App.jsx           # Main application component
└── index.js          # Application entry point
```

## 🛠️ Technologies Used

- **React**: Frontend library for building user interfaces
- **Material-UI**: React component library implementing Google's Material Design
- **Recharts**: Composable charting library for data visualization
- **React Router**: Navigation and routing for React applications
- **Axios**: Promise-based HTTP client
- **WebSocket**: Real-time communication
- **JWT**: Authentication and authorization
- **Redux Toolkit**: State management
- **Styled Components**: CSS-in-JS styling solution

## 🔧 Development

### Code Style
- Follow the Airbnb JavaScript Style Guide
- Use ESLint for code linting
- Use Prettier for code formatting

### Testing
```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Generate coverage report
npm run test:coverage
```

## 🚀 Future Enhancements

- Local storage for persistent data
- User authentication with backend integration
- Real-time device status updates
- Mobile application with React Native
- Voice control integration
- Scene creation and scheduling
- Advanced energy analytics
- Integration with actual smart home APIs (Google Home, Amazon Alexa, etc.)
- AI-powered device recommendations
- Automated device scheduling
- Energy-saving suggestions
- Multi-language support
- Dark/Light theme toggle
- Offline mode support

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Pull Request Process
1. Update the README.md with details of changes if needed
2. Update the version numbers in any examples files and the README.md
3. The PR will be merged once you have the sign-off of at least one other developer

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Material-UI team for the amazing component library
- React team for the incredible framework
- All contributors who have helped shape this project

## 📞 Support

For support, email support@smarthomedashboard.com or join our Slack channel.

## 🔄 Updates

Check the [CHANGELOG.md](CHANGELOG.md) file for a list of all notable changes to this project.
