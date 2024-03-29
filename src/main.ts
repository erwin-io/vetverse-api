import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";
import * as bodyParser from "body-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix("api/v1");
  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>("PORT");
  const options = new DocumentBuilder()
    .setTitle("vetverse-api")
    .setDescription("A documentation for vetverse-api")
    .setVersion("1.0")
    .addBearerAuth(
      { type: "http", scheme: "bearer", bearerFormat: "JWT", in: "header" },
      "jwt"
    )
    .build();
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("swagger", app, document, {
    swaggerOptions: { defaultModelsExpandDepth: -1 },
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(port, () => {
    console.log("[WEB]", config.get<string>("BASE_URL"));
  });
}
bootstrap();
