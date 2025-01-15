# Build stage
FROM amazoncorretto:21-alpine as build
WORKDIR /app

# Copy pom.xml first for better caching
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
COPY src src

# Fix permissions and build
RUN chmod +x mvnw && \
    ./mvnw clean package -DskipTests

# Run stage
FROM amazoncorretto:21-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"] 