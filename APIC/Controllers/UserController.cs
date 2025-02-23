using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using APIC_.Models;
using APIC_.Data;
using APIC_.service;
using APIC_.Dto;

namespace APIC_.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly PasswordHasher<User> _passwordHasher;
        private readonly AuthService _authService;

        public UserController(ApplicationDbContext context, AuthService authService)
        {
            _context = context;
            _passwordHasher = new PasswordHasher<User>();  
            _authService = authService; 
        }

    // POST: api/User
      [HttpPost] 
     public async Task<ActionResult<User>> CreateUser([FromBody] User user)
{
    // Verificando se o e-mail já existe
    var existingUser = await _context.Users
        .FirstOrDefaultAsync(u => u.Email == user.Email);

    if (existingUser != null)
    {
        return BadRequest("Já existe um usuário com este e-mail.");
    }

    // Criptografando a senha antes de salvar
    user.Password = _passwordHasher.HashPassword(user, user.Password);

    _context.Users.Add(user);
    await _context.SaveChangesAsync();
    return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
}


        // GET: api/User/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        // GET: api/User
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            var users = await _context.Users.ToListAsync();
            return Ok(users);
        }

   [HttpPut("{id}")]
public async Task<IActionResult> UpdateUser(int id, [FromBody] UserUpdateDto userDto)
{
    if (id != userDto.Id)
    {
        return BadRequest("IDs não correspondem.");
    }

    var user = await _context.Users.FindAsync(id);
    if (user == null)
    {
        return NotFound($"Usuário com ID {id} não encontrado.");
    }

    // Atualize apenas os campos necessários
    user.Name = userDto.Name;
    user.Role = userDto.Role;

    try
    {
        await _context.SaveChangesAsync();
    }
    catch (Exception ex)
    {
        return BadRequest($"Erro ao salvar usuário: {ex.Message}");
    }

    return NoContent(); // Sucesso sem dados de retorno
}

   
    // DELETE: api/User/{id}
[HttpDelete("{id}")]
public async Task<IActionResult> DeleteUser(int id)
{
  
    var user = await _context.Users.FindAsync(id);

  
    if (user == null)
    {
        return NotFound($"Usuário com o ID {id} não encontrado."); 
    }

    _context.Users.Remove(user);
    await _context.SaveChangesAsync();

    return NoContent(); 
}

    }
}
