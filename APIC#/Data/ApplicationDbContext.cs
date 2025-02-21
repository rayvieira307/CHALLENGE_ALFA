using Microsoft.EntityFrameworkCore;
using APIC_.Models;

namespace APIC_.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Purchase> Purchases { get; set; }
        public DbSet<PurchaseItem> PurchaseItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configurar exclusão em cascata entre Purchase e User
            modelBuilder.Entity<Purchase>()
                .HasOne(p => p.User)  // Relacionamento entre Purchase e User
                .WithMany()  // Não precisamos da coleção de Purchases em User
                .HasForeignKey(p => p.UserId)  // Chave estrangeira em Purchase
                .OnDelete(DeleteBehavior.Cascade);  // Exclusão em cascata: exclui as compras quando o usuário for excluído

            // Configurar exclusão em cascata entre PurchaseItem e Purchase
            modelBuilder.Entity<PurchaseItem>()
                .HasOne(pi => pi.Purchase)  // Relacionamento entre PurchaseItem e Purchase
                .WithMany(p => p.PurchaseItems)  // Uma compra pode ter muitos itens
                .HasForeignKey(pi => pi.PurchaseId)  // Chave estrangeira em PurchaseItem
                .OnDelete(DeleteBehavior.Cascade);  // Exclusão em cascata: exclui os itens de compra quando a compra for excluída
        }
    }
}
