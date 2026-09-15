# ==========================================================
# STAGE 1: Build artifact with Eclipse Temurin JDK 17
# ==========================================================
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /build

# Copy Maven wrapper & pom.xml first to leverage Docker layer caching
COPY pom.xml mvnw ./
COPY .mvn .mvn

# Make wrapper executable and download dependencies
RUN chmod +x ./mvnw && ./mvnw dependency:go-offline -B

# Copy source code and build production jar
COPY src ./src
RUN ./mvnw clean package -DskipTests -B

# ==========================================================
# STAGE 2: Lightweight, Secure Production Runtime
# ==========================================================
FROM eclipse-temurin:17-jre-alpine AS runner

WORKDIR /app

# Create a non-root dedicated user and group for defense-in-depth
RUN addgroup -S spring && adduser -S spring -G spring

# Copy compiled jar from builder stage
COPY --from=builder /build/target/*.jar app.jar

# Set ownership to unprivileged user
RUN chown -R spring:spring /app

USER spring:spring

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost:8080/actuator/health | grep UP || exit 1

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
