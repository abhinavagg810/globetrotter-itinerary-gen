# VoyageAI Spring Boot Backend

A production-ready Spring Boot backend for the VoyageAI travel planning application.

## Tech Stack

- **Java 17** + **Spring Boot 3.2**
- **Spring Security** with JWT authentication
- **Spring Data JPA** with PostgreSQL
- **AWS S3** for document storage
- **OpenAPI/Swagger** for API documentation
- **Docker** for containerization
- **AWS ECS/Fargate** for deployment

## Project Structure

```
spring-boot-backend/
├── src/main/java/com/voyageai/
│   ├── entity/          # JPA entities
│   ├── repository/      # Data access layer
│   ├── service/         # Business logic
│   ├── controller/      # REST endpoints
│   ├── dto/             # Data transfer objects
│   ├── security/        # JWT & Spring Security
│   ├── config/          # App configuration
│   └── exception/       # Error handling
├── src/main/resources/
│   ├── application.yml
│   └── db/migration/    # Flyway migrations
├── aws/                 # AWS deployment configs
├── Dockerfile
└── docker-compose.yml
```

## Quick Start

### Prerequisites
- Java 17+
- Maven 3.8+
- PostgreSQL 15+
- Docker (optional)

### Local Development

1. **Clone and navigate:**
   ```bash
   cd spring-boot-backend
   ```

2. **Configure database:**
   ```bash
   export DATABASE_URL=jdbc:postgresql://localhost:5432/voyageai
   export DATABASE_USERNAME=postgres
   export DATABASE_PASSWORD=your_password
   export JWT_SECRET=your-256-bit-secret-key
   ```

3. **Run:**
   ```bash
   mvn spring-boot:run
   ```

4. **Access API docs:**
   - Swagger UI: http://localhost:8080/swagger-ui.html
   - OpenAPI spec: http://localhost:8080/api-docs

### Docker

```bash
docker-compose up -d
```

## AWS Deployment

1. **Create infrastructure:**
   ```bash
   aws cloudformation create-stack \
     --stack-name voyage-backend \
     --template-body file://aws/cloudformation-template.yml \
     --parameters ParameterKey=DBPassword,ParameterValue=your_password
   ```

2. **Build and push image:**
   ```bash
   aws ecr get-login-password | docker login --username AWS --password-stdin YOUR_ECR_URL
   docker build -t voyage-backend .
   docker tag voyage-backend:latest YOUR_ECR_URL:latest
   docker push YOUR_ECR_URL:latest
   ```

3. **Deploy to ECS:**
   - Update `aws/task-definition.json` with your account details
   - Create ECS service using the task definition

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user

### Itineraries
- `GET /api/itineraries` - List user's itineraries
- `POST /api/itineraries` - Create itinerary
- `GET /api/itineraries/{id}` - Get itinerary details
- `PUT /api/itineraries/{id}` - Update itinerary
- `DELETE /api/itineraries/{id}` - Delete itinerary

### AI Generation
- `POST /api/ai/generate-itinerary` - Generate AI itinerary
- `POST /api/ai/regenerate-day` - Regenerate specific day

### Expenses
- `GET /api/itineraries/{id}/expenses` - List expenses
- `POST /api/itineraries/{id}/expenses` - Create expense
- `GET /api/itineraries/{id}/expenses/summary` - Get expense summary

### Documents
- `GET /api/itineraries/{id}/documents` - List documents
- `POST /api/itineraries/{id}/documents` - Upload document
- `DELETE /api/documents/{id}` - Delete document

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| DATABASE_URL | PostgreSQL connection URL | Yes |
| DATABASE_USERNAME | Database username | Yes |
| DATABASE_PASSWORD | Database password | Yes |
| JWT_SECRET | 256-bit secret for JWT | Yes |
| AI_API_KEY | OpenAI API key | Yes |
| AWS_ACCESS_KEY_ID | AWS access key | For S3 |
| AWS_SECRET_ACCESS_KEY | AWS secret key | For S3 |
| AWS_S3_BUCKET | S3 bucket name | For S3 |
| CORS_ORIGINS | Allowed CORS origins | Yes |

## Security

- JWT-based authentication
- Role-based access control (USER, MODERATOR, ADMIN)
- BCrypt password hashing
- CORS configuration
- Rate limiting (configure in API Gateway)

## Next Steps

To complete the backend:

1. Add remaining DTOs in `dto/` package
2. Add controllers in `controller/` package
3. Add security config in `security/` package
4. Add Flyway migrations in `resources/db/migration/`
5. Update frontend to call Spring Boot APIs instead of Supabase

## License

MIT
