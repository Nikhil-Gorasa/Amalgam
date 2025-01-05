# Amalgam Portfolio Tracker

## Overview

Amalgam Portfolio Tracker is a comprehensive web application designed to help users manage and track their stock portfolios in real-time. Built with React and Vite for the frontend and Spring Boot for the backend, this application provides a user-friendly interface for investors to monitor their investments effectively.

## Features

- **Real-time Stock Tracking**: Get live updates on stock prices and market status.
- **Portfolio Management**: Add, remove, and manage your stock investments easily.
- **Analytics Dashboard**: View your portfolio's performance with insightful analytics and charts.
- **User-Friendly Interface**: A clean and intuitive design for seamless navigation.
- **Help Center**: Access frequently asked questions and support resources.

## Technologies Used

- **Frontend**:
  - React
  - Vite
  - Recharts for data visualization
  - Axios for API calls

- **Backend**:
  - Spring Boot
  - MySQL for database management
  - JPA/Hibernate for ORM

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Java (JDK 11 or later)
- MySQL Server

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/amalgam-portfolio-tracker.git
   cd amalgam-portfolio-tracker
   ```

2. **Set up the backend**:
   - Navigate to the `SpringBoot/portfoliotracker` directory.
   - Update the `application.properties` file with your MySQL database credentials.
   - Run the following command to start the Spring Boot application:
     ```bash
     ./mvnw spring-boot:run
     ```

3. **Set up the frontend**:
   - Navigate to the `amalgam-frontend` directory.
   - Install the dependencies:
     ```bash
     npm install
     ```
   - Start the development server:
     ```bash
     npm run dev
     ```

4. **Access the application**:
   - Open your browser and go to `http://localhost:5173` to view the application.

## Usage

- Create an account or log in to start managing your portfolio.
- Use the dashboard to add stocks and view your portfolio's performance.
- Access the Help Center for any questions or support.

## Contributing

Contributions are welcome! If you have suggestions or improvements, please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
