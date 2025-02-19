using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using APIC_.service;
using APIC_.Models;
using APIC_.Data;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Configuração do DbContext com a string de conexão
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Adicionando controladores para o Web API
builder.Services.AddControllers();

// Registro do PasswordHasher no DI
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();

// Adicionando o AuthService para injeção de dependência
builder.Services.AddScoped<AuthService>();

// Configuração do Swagger (OpenAPI) - habilitando suporte para JWT na UI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Minha API",
        Version = "v1",
        Description = "Documentação da API",
        Contact = new OpenApiContact
        {
            Name = "Rayssa",
            Email = "vieirarayssa167@gmail.com",
            Url = new Uri("https://www.seusite.com"),
        }
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Por favor, insira o token JWT no formato **'Bearer {token}'**",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// Configuração de autenticação JWT (para as rotas da API, mas não para o Swagger)
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],  // Deixe isso configurado no appsettings.json
            ValidAudience = builder.Configuration["Jwt:Audience"], // Deixe isso configurado no appsettings.json
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"])) // Chave secreta do JWT, deve ser configurada no appsettings.json
        };
    });

// Configuração de autorização (caso precise de políticas específicas)
builder.Services.AddAuthorization();

var app = builder.Build();

// Habilitando HTTPS redirection, mas apenas se estiver em produção
if (!builder.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();  // Apenas em produção
}

// Habilitando o Swagger
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1");
    c.RoutePrefix = string.Empty;  // Deixe o Swagger UI como página inicial
});

// Habilitando autenticação e autorização
app.UseAuthentication();


app.MapControllers();

app.Run();
