using Microsoft.AspNetCore.Mvc;
using APIC_.Data;
using APIC_.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;

namespace APIC_.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PurchaseController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PurchaseController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Rota para listar todas as compras
        [HttpGet("listar")]
        public async Task<ActionResult> GetPurchases()
        {
            var purchases = await _context.Purchases.Include(p => p.User)
                                                     .Include(p => p.PurchaseItems)
                                                     .ThenInclude(pi => pi.Product)
                                                     .ToListAsync();
            return Ok(purchases.Select(p => new
            {
                p.Id,
                UserName = p.User.Name,
                p.OrderDate,
                p.Total,
                Items = p.PurchaseItems.Select(pi => new
                {
                    pi.Product.Name,
                    pi.Quantity,
                    pi.UnitPrice
                })
            }));
        }

        // Rota para listar compras por ID do usuário
        [HttpGet("listar/{userId}")]
        public async Task<ActionResult> GetPurchasesByUser(int userId)
        {
            var purchases = await _context.Purchases
                                           .Include(p => p.User)
                                           .Include(p => p.PurchaseItems)
                                               .ThenInclude(pi => pi.Product)
                                           .Where(p => p.UserId == userId)
                                           .ToListAsync();

            if (purchases == null || !purchases.Any())
            {
                return NotFound("Nenhuma compra encontrada para este usuário.");
            }

            return Ok(purchases.Select(p => new
            {
                p.Id,
                UserName = p.User.Name,
                p.OrderDate,
                p.Total,
                Items = p.PurchaseItems.Select(pi => new
                {
                    ProductName = pi.Product.Name,
                    pi.Quantity,
                    pi.UnitPrice
                })
            }));
        }

        // Rota para adicionar produto ao carrinho
        [HttpPost("adicionarAoCarrinho")]
        public async Task<ActionResult> AddAoCarrinho(int userId, int productId, int quantity)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("Usuário não encontrado.");
            }

            var product = await _context.Products.FindAsync(productId);
            if (product == null)
            {
                return NotFound("Produto não encontrado.");
            }

            var purchase = await _context.Purchases
                                          .FirstOrDefaultAsync(p => p.UserId == userId && p.Total == 0); // Carrinho vazio

            if (purchase == null)
            {
                purchase = new Purchase
                {
                    User = user,
                    OrderDate = DateTime.UtcNow,
                    Total = 0,
                    PurchaseItems = new List<PurchaseItem>()
                };

                _context.Purchases.Add(purchase);
            }

            // Verificar se o produto já está no carrinho
            var existingItem = purchase.PurchaseItems.FirstOrDefault(pi => pi.ProductId == productId);
            if (existingItem != null)
            {
                existingItem.Quantity += quantity;
            }
            else
            {
                purchase.PurchaseItems.Add(new PurchaseItem
                {
                    ProductId = productId,
                    Quantity = quantity,
                    UnitPrice = product.Price
                });
            }

            await _context.SaveChangesAsync();
            return Ok(purchase);
        }

        // Rota para finalizar a compra (checkout)
        [HttpPost("comprar")]
        public async Task<ActionResult<Purchase>> Comprar(int userId)
        {
            var purchase = await _context.Purchases
                                          .Include(p => p.User)
                                          .Include(p => p.PurchaseItems)
                                              .ThenInclude(pi => pi.Product)
                                          .FirstOrDefaultAsync(p => p.UserId == userId && p.Total == 0);

            if (purchase == null)
            {
                return NotFound("Carrinho vazio ou já finalizado.");
            }

            decimal total = 0;

            // Calcular o total
            foreach (var item in purchase.PurchaseItems)
            {
                total += item.Quantity * item.UnitPrice;
            }

            // Atualizar o total e a data da compra
            purchase.Total = total;
            purchase.OrderDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPurchases", new { id = purchase.Id }, new
            {
                purchase.Id,
                UserName = purchase.User.Name,
                purchase.OrderDate,
                purchase.Total,
                Items = purchase.PurchaseItems.Select(pi => new
                {
                    ProductName = pi.Product.Name,
                    pi.Quantity,
                    pi.UnitPrice
                })
            });
        }
    }
}
