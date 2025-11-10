using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMS.Models
{
   // [Index(nameof(UserId), IsUnique = true)]
    public class Employee
    {
        [Key]
        public long Id { get; set; }
        [MaxLength(50)]
        public string FirstName { get; set; }
        [MaxLength(50)]
        public string LastName { get; set; }
        [MaxLength(50)]
        public string? Email { get; set; }
        public DateTime? BirthDate { get; set; } // Optional / Nullable
        public decimal Salary { get; set; }
        [ForeignKey("Department")]
        public long? DepartmentId { get; set; }
        public Department? Department { get; set; } // Navigation Property


        [ForeignKey("Manager")]
        public long? ManagerId { get; set; }
        public Employee Manager { get; set; } // Navigation Property


        [ForeignKey("Lookup")]
        public long PositionId { get; set; }
        public Lookup Lookup { get; set; } // Navigation Property

        [ForeignKey("User")]
        public long? UserId { get; set; }
        public User? User { get; set; } // Navigation Property
    }
}
