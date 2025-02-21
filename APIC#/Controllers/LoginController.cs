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
            // Chama o método de autenticação, que agora retorna apenas o token
            var token = await _authService.Authenticate(request.Email, request.Password);

            // Verifica se o token é nulo
            if (token == null)
            {
                return Unauthorized("Credenciais inválidas");
            }

            // Retorna apenas o token no formato JSON
            return Ok(new { Token = token });
        }
    }
}
