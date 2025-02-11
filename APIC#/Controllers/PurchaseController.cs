using Microsoft.AspNetCore.Mvc;
using APIC_.Data;
using APIC_.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

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

        // GET: api/Purchase
        [HttpGet]
        public async Task<ActionResult> GetPurchases()
        {
            var purchases = await _context.Purchases.Include(p => p.User).ToListAsync();
            return Ok(purchases.Select(p => new
            {
                p.Id,
                UserName = p.User.Name,
                p.OrderDate,
                p.Total
            }));
        }

        // POST: api/Purchase
        [HttpPost]
        public async Task<ActionResult<Purchase>> CreatePurchase(Purchase purchase)
        {
            _context.Purchases.Add(purchase);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetPurchases", new { id = purchase.Id }, purchase);
        }
    }
}