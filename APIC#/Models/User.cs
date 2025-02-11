using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;  


namespace APIC_.Models
{
    public class User
    {
        public int Id { get; set; }
       public required string Email { get; set; }
    public required string Password { get; set; }
    public required string Name { get; set; }
        public bool IsAdmin { get; set; }  
    }
}
