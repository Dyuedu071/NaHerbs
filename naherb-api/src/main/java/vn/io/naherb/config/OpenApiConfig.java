package vn.io.naherb.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    OpenAPI naherbOpenApi(SecurityProperties properties) {
        String schemeName = "cookieAuth";
        return new OpenAPI()
                .info(new Info()
                        .title("NaHerb API")
                        .version("v1")
                        .description("API sử dụng JWT trong HttpOnly cookie và CSRF double-submit cookie."))
                .components(new Components().addSecuritySchemes(
                        schemeName,
                        new SecurityScheme()
                                .type(SecurityScheme.Type.APIKEY)
                                .in(SecurityScheme.In.COOKIE)
                                .name(properties.getCookie().getAccessName())))
                .addSecurityItem(new SecurityRequirement().addList(schemeName));
    }
}
