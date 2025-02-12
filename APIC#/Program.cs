using Microsoft.EntityFrameworkCore;
using APIC_.Data;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Configuração do DbContext com a string de conexão
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Adicionando controladores para o Web API
builder.Services.AddControllers();

// Configuração do Swagger (OpenAPI)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Minha API",
        Version = "v1",
        Description = "Documentação da API ",
        Contact = new OpenApiContact
        {
            Name = "Rayssa",
            Email = "vieirarayssa167@gmail.com",
            Url = new Uri("https://www.seusite.com"),
        }
    });
});

var app = builder.Build();

// Habilitando o Swagger no ambiente de desenvolvimento
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Minha API v1");
    });
}

app.UseHttpsRedirection();

// Configuração de roteamento para os controladores
app.MapControllers();

app.Run();
