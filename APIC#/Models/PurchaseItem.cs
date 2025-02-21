using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace APIC_.Models
{
    public class PurchaseItem
{
      public int Id { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public int ProductId { get; set; }
    public Product Product { get; set; } 

     public int PurchaseId { get; set; }
        public Purchase Purchase { get; set; }
}
}