using HRMS.Models;
using Microsoft.EntityFrameworkCore;

namespace HRMS.DbContexts
{
    public class HRMSContext : DbContext
    {

        public HRMSContext(DbContextOptions<HRMSContext> options) : base(options)
        {
            // options:
            // 1) Database Type (provider) : Sql Server
            // 2) Connection String
        }



        // Tables --> DbSet
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Department> Departments { get; set; }
    }
}
