using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic; 

namespace APIC_.Models
{
    public class PurchaseItemRequest
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
