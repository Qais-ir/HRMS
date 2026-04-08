using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMS.Models
{
    public class Employee // Model
    {
        public long Id { get; set; }
        [MaxLength(50)]
        public string FirstName { get; set; }
        [MaxLength(50)]
        public string LastName { get; set; }
        [MaxLength(50)]
        public string Email { get; set; }
        public DateTime BirthDate { get; set; }
        [MaxLength(50)]
        public string Phone { get; set; } // +9627955 , 078
        public bool IsActive { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; } // (?) --> Optional / Nullable
        public decimal? Salary { get; set; }

        [ForeignKey("Department")]
        public long? DepartmentId { get; set; } // 1
        public Department? Department { get; set; } // Navigation Property

        [ForeignKey("Manager")]
        public long? ManagerId { get; set; }
        public Employee? Manager { get; set; } // Navigation Property

        [ForeignKey("Lookup")]
        public long? PositionId { get; set; }
        public Lookup? Lookup { get; set; } // Navigation Property

    }
}
