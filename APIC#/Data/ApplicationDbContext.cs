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

       
            modelBuilder.Entity<Purchase>()
                .HasOne(p => p.User)  
                .WithMany()  
                .HasForeignKey(p => p.UserId)  
                .OnDelete(DeleteBehavior.Cascade);  

            modelBuilder.Entity<PurchaseItem>()
                .HasOne(pi => pi.Purchase)  
                .WithMany(p => p.PurchaseItems)  
                .HasForeignKey(pi => pi.PurchaseId)  
                .OnDelete(DeleteBehavior.Cascade); 
        }
    }
}
