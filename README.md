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

## Live API Documentation

The Amalgam Portfolio Tracker provides live API documentation using Swagger UI. You can access the documentation at the following URL:

- **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

This interface allows you to explore the available API endpoints, view request/response models, and test the API directly from your browser.

### Assumptions

1. **User Familiarity**: It is assumed that users have a basic understanding of stock market terminology and concepts, such as stocks, portfolios, and market prices.

2. **Internet Connectivity**: The application assumes that users have a stable internet connection to fetch real-time stock data and interact with the backend services.

3. **API Availability**: The application relies on third-party APIs (e.g., Finnhub) for real-time stock data. It is assumed that these APIs will be available and functioning as expected.

4. **Single User Access**: The current implementation assumes that each user will manage their own portfolio without multi-user collaboration features.

5. **Data Accuracy**: It is assumed that the data provided by the APIs is accurate and up-to-date, and the application does not verify the authenticity of the stock prices.

### Limitations

1. **API Rate Limiting**: The application is subject to the rate limits imposed by the Finnhub API (60 calls per minute for the free tier), which may affect the frequency of data updates.

2. **Limited Market Coverage**: The application currently supports only US stock markets. Other global markets are not included in the current implementation.

3. **No Real-time Streaming**: The application does not support real-time price streaming; it relies on periodic API calls to fetch the latest stock prices.

4. **Basic Authentication**: The user authentication system is basic and does not include advanced security features such as password hashing or token-based authentication.

5. **Limited Historical Data**: The application does not provide extensive historical data analysis or visualization features, which may limit users' ability to perform in-depth portfolio analysis.

6. **No Support for Other Assets**: The application currently focuses solely on stocks and does not support other asset classes such as cryptocurrencies or bonds.

These assumptions and limitations should be considered when using the Amalgam Portfolio Tracker application, and users are encouraged to provide feedback for future improvements.

## Future Plans

1. **User Authentication**:
   - Implement secure OAuth-based authentication to allow users to log in using their existing accounts from platforms like Google or Facebook.

2. **Real-time Price Updates**:
   - Integrate WebSocket support for live stock price updates, allowing users to monitor their portfolios in real-time.

3. **Expanded Market Coverage**:
   - Add support for Indian stock markets and cryptocurrencies to provide users with a wider range of investment options.

4. **Advanced Analytics**:
   - Introduce features for portfolio diversification analysis and risk assessment to help users make informed investment decisions.

5. **Mobile Application Development**:
   - Develop a mobile version of the Amalgam Portfolio Tracker to enhance accessibility and user experience on mobile devices.

## Contributing

Contributions are welcome! If you have suggestions or improvements, please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
