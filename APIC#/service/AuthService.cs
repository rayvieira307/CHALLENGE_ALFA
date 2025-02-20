using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using APIC_.Data;
using APIC_.Models;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace APIC_.service
{
   public class AuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly IPasswordHasher<User> _passwordHasher; // Injetando o PasswordHasher

    public AuthService(ApplicationDbContext context, IConfiguration configuration, IPasswordHasher<User> passwordHasher)
    {
        _context = context;
        _configuration = configuration;
        _passwordHasher = passwordHasher;
    }

    public async Task<(string? token, string? redirectUrl)> Authenticate(string email, string password)
    {
        var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == email);
        if (user == null)
        {
            return (null, null); // Usuário não encontrado
        }

        // Verificando se a senha está correta com o PasswordHasher
        var passwordVerificationResult = _passwordHasher.VerifyHashedPassword(user, user.Password, password);
        if (passwordVerificationResult == PasswordVerificationResult.Failed)
        {
            return (null, null); // Senha inválida
        }

        // Gerando os claims
        var claims = new[] {
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim("userId", user.Id.ToString())
        };

        // Gerando o JWT
        var secret = _configuration["Jwt:Secret"];
        if (string.IsNullOrEmpty(secret))
        {
            throw new InvalidOperationException("A chave secreta do JWT não foi configurada.");
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(1),
            signingCredentials: creds
        );

        // Determinando o redirecionamento com base na role
        string redirectUrl = DetermineRedirectUrl(user.Role);

        return (new JwtSecurityTokenHandler().WriteToken(token), redirectUrl);
    }

    // Método para verificar o hash da senha usando o PasswordHasher do Identity
    private bool VerifyPasswordHash(string password, string storedHash)
    {
        // Não precisamos mais usar a lógica manual de hash, pois o PasswordHasher já lida com isso
        return _passwordHasher.VerifyHashedPassword(null, storedHash, password) != PasswordVerificationResult.Failed;
    }

    // Método para determinar a URL de redirecionamento baseada na role do usuário
    private string DetermineRedirectUrl(string role)
    {
        switch (role.ToLower())
        {
            case "Admin":
                return "/admin-home"; // Página de Admin
            case "Client":
                return "/home";    // Página de Cliente
            default:
                return "";           // Página padrão
        }
    }
}

}
