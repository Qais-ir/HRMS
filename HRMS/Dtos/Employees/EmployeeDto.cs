﻿namespace HRMS.Dtos.Employees
{
    // DTO : Data Transfer Object
    public class EmployeeDto
    {
        public long? Id { get; set; }
        public string? Name { get; set; }
        public string? Position { get; set; }
        public DateTime? BirthDate { get; set; }
        public string? Email { get; set; }
    }
}
