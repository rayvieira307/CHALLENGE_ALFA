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

    [HttpPost("comprar/{userId}")]
public async Task<ActionResult<Purchase>> Comprar(int userId, List<PurchaseItemRequest> items)
{
   Console.WriteLine($"Requisição recebida para o userId: {userId}");
    var user = await _context.Users.FindAsync(userId);
    if (user == null)
    {
        return NotFound("Usuário não encontrado.");
    }


    var purchase = new Purchase
    {
        User = user,  
        OrderDate = DateTime.UtcNow,
        Total = 0,
        PurchaseItems = new List<PurchaseItem>()  
    };

    decimal total = 0;

   
    foreach (var itemRequest in items)
    {
        var product = await _context.Products.FindAsync(itemRequest.ProductId);
        if (product == null)
        {
            return NotFound($"Produto com ID {itemRequest.ProductId} não encontrado.");
        }

        var purchaseItem = new PurchaseItem
        {
            ProductId = itemRequest.ProductId,
            Quantity = itemRequest.Quantity,
            UnitPrice = product.Price
        };

        purchase.PurchaseItems.Add(purchaseItem);

        
        total += purchaseItem.Quantity * purchaseItem.UnitPrice;
    }

    purchase.Total = total;

    _context.Purchases.Add(purchase);
    await _context.SaveChangesAsync();


    return CreatedAtAction("GetPurchases", new { id = purchase.Id }, new
    {
        purchase.Id,
        UserName = user.Name,
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