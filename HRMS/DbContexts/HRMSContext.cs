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

        // Table Seeding
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder); // Call Parent Version Of The Override Method

            modelBuilder.Entity<Lookup>().HasData(

                // Major Code => 0 (Employees Positions)
                new Lookup { Id = 1, MajorCode = 0, MinorCode = 0, Name = "Employees Positions" },
                new Lookup { Id = 2, MajorCode = 0, MinorCode = 1, Name = "Manager" },
                new Lookup { Id = 3, MajorCode = 0, MinorCode = 2, Name = "Developer" },
                new Lookup { Id = 4, MajorCode = 0, MinorCode = 3, Name = "HR" },

                // Major Code => 1 (Department Types)
                new Lookup { Id = 5, MajorCode = 1, MinorCode = 0, Name = "Department Types" },
                new Lookup { Id = 6, MajorCode = 1, MinorCode = 1, Name = "Finance" },
                new Lookup { Id = 7, MajorCode = 1, MinorCode = 2, Name = "Adminstrative" },
                new Lookup { Id = 8, MajorCode = 1, MinorCode = 3, Name = "Technical" }

             );
        }

        // Tables --> DbSet
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Lookup> Lookups { get; set; }
    }
}
