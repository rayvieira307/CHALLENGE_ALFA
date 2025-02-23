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


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
        policy.WithOrigins("http://localhost:4200")  
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});


builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));


builder.Services.AddControllers();

builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();


builder.Services.AddScoped<AuthService>();


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


builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],  
            ValidAudience = builder.Configuration["Jwt:Audience"], 
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"])) // Chave secreta do JWT, deve ser configurada no appsettings.json
        };
    });


builder.Services.AddAuthorization();

var app = builder.Build();


if (!builder.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();  
}


app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1");
    c.RoutePrefix = string.Empty;  
});

app.UseCors("AllowAngularApp");
app.UseAuthentication();

app.MapControllers();

app.Run();
