# Multi-stage build for NightDrop Spring Boot Backend
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Install Maven and build package
RUN apk add --no-cache maven && \
    mvn clean package -DskipTests

# Run stage with lightweight JRE
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/nightdrop-backend-1.0.0.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
