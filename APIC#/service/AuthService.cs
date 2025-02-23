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
    private readonly IPasswordHasher<User> _passwordHasher; 

    public AuthService(ApplicationDbContext context, IConfiguration configuration, IPasswordHasher<User> passwordHasher)
    {
        _context = context;
        _configuration = configuration;
        _passwordHasher = passwordHasher;
    }

   public async Task<string?> Authenticate(string email, string password)
{
    var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == email);
    if (user == null)
    {
        return null;
    }

   
    var passwordVerificationResult = _passwordHasher.VerifyHashedPassword(user, user.Password, password);
    if (passwordVerificationResult == PasswordVerificationResult.Failed)
    {
        return null; 
    }

   
    var claims = new[] {
        new Claim(ClaimTypes.Name, user.Name),
        new Claim(ClaimTypes.Role, user.Role),
        new Claim("userId", user.Id.ToString())
    };

    
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

  
    return new JwtSecurityTokenHandler().WriteToken(token);
}

    
    private bool VerifyPasswordHash(string password, string storedHash)
    {
       
        return _passwordHasher.VerifyHashedPassword(null, storedHash, password) != PasswordVerificationResult.Failed;
    }


}

}
