using System.ComponentModel.DataAnnotations.Schema;

namespace HRMS.Models
{
    public class Employee // Model
    {
        public long Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Position { get; set; }
        public DateTime BirthDate { get; set; }
        public string Phone { get; set; } // +9627955 , 078
        public bool IsActive { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; } // (?) --> Optional / Nullable
        public decimal? Salary { get; set; }

        [ForeignKey("Department")]
        public long? DepartmentId { get; set; }
        public Department? Department { get; set; } // Navigation Property

        [ForeignKey("Manager")]
        public long? ManagerId { get; set; }
        public Employee? Manager { get; set; }

    }
}
