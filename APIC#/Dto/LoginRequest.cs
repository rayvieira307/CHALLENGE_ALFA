using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace APIC_.Dto
{
    public class LoginRequest
    {
        public required string Email { get; set; }
        public required string Password { get; set; }

    }

}