using Microsoft.AspNetCore.Mvc;
using APIC_.Dto;
using APIC_.service;

namespace APIC_.Controllers
{
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly AuthService _authService;

        public LoginController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var (token, redirectUrl) = await _authService.Authenticate(request.Email, request.Password);
            
            // Verifica se o token ou a URL de redirecionamento são nulos
            if (token == null || redirectUrl == null)
            {
                return Unauthorized("Credenciais inválidas");
            }

            // Retorna o token e a URL de redirecionamento
            return Ok(new { Token = token, RedirectUrl = redirectUrl });
        }
    }
}
