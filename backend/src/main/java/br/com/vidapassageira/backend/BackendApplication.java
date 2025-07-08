package br.com.vidapassageira.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure()
    	.filename(".env")
    .load();
		System.setProperty("spring.datasource.url", dotenv.get("DATABASE_URL"));
		System.setProperty("spring.datasource.username", dotenv.get("DATABASE_USERNAME"));
		System.setProperty("spring.datasource.password", dotenv.get("DATABASE_PASSWORD"));
		System.setProperty("keycloak.client-id", dotenv.get("KEYCLOAK_CLIENT_ID"));
		System.setProperty("keycloak.username", dotenv.get("KEYCLOAK_USERNAME"));
		System.setProperty("keycloak.password", dotenv.get("KEYCLOAK_PASSWORD"));
		System.setProperty("deepseek.api.key", dotenv.get("DEEPSEEK_API_KEY"));
		SpringApplication.run(BackendApplication.class, args);
	}

}
