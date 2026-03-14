using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using HRMS.Models;
using HRMS.Dtos.Employee;

namespace HRMS.Controllers
{
    // Data Annotations
    [Route("api/[controller]")] // api/Employees
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        public static List<Employee> employees = new List<Employee>()
        {
            new Employee(){ Id = 1, FirstName = "Ahmad", LastName = "Nasser", Email = "Ahmad@123.com", Position = "Developer", BirthDate = new DateTime(2000,1,25), Phone = "+96255888625", IsActive = true, StartDate = new DateTime(2026,1,1), EndDate = new DateTime(2026,3,1)},
            new Employee(){ Id = 2, FirstName = "Layla", LastName = "Kareem", Email = "Layla@123.com", Position = "HR", BirthDate = new DateTime(1996,1,25), Phone = "+96255888625", IsActive = true, StartDate = new DateTime(2026,1,1)},
            new Employee(){ Id = 3, FirstName = "Yousef", LastName = "Faris", Email = "Yousef@123.com", Position = "Manager", BirthDate = new DateTime(1999,1,25), Phone = "+96255888625", IsActive = true, StartDate = new DateTime(2026,1,1)},
            new Employee(){ Id = 4, FirstName = "Nadia", LastName = "Zaid", Email = "Nadia@123.com", Position = "Developer", BirthDate = new DateTime(2001,1,25), Phone = "+96255888625", IsActive = true, StartDate = new DateTime(2026,1,1)},
        };

        // CRUD Operations
        // C --> Create
        // R --> Read
        // U --> Update
        // D --> Delete

        // Endpoint
        [HttpGet("GetByCriteria")] // Read
        public IActionResult GetByCriteria([FromQuery] string? position) // (?) --> Optional / Nullable
        {

            var data = from employee in employees
                       where (position == null || employee.Position == position)
                       orderby employee.Id
                       select new EmployeeDto
                       {
                           Id = employee.Id,
                           //FirstName = employee.FirstName,
                          // LastName = employee.LastName,
                           Name = employee.FirstName + " " + employee.LastName,
                           Position = employee.Position,
                           BirthDate = employee.BirthDate,
                           StartDate = employee.StartDate,
                           EndDate = employee.EndDate
                       };

            return Ok(data);
          //return StatusCode(200, new { Name = "Ahmad", Position = "Developer" });        
          //return Ok(new { Name = "Ahmad", Position = "Developer" }); // 200 OK                                                                       
          //return NotFound("Employee Not Found"); // 404 Not Found
          // return BadRequest("Data Not Loaded"); // 400 Bad Request
        }


        [HttpGet("{id}")] // Route Paramater
        public IActionResult GetById(long id)
        {
            // var data = employees.SingleOrDefault(x => x.Id == id);
            var data = employees.Select(employee => new EmployeeDto
            {
                Id = employee.Id,
                Name = employee.FirstName + " " + employee.LastName,
                Position = employee.Position,
                BirthDate = employee.BirthDate,
                StartDate = employee.StartDate,
                EndDate = employee.EndDate
            }).FirstOrDefault(x => x.Id == id);

            if(data == null)
            {
                return NotFound("Employee Not Found");
            }

            return Ok(data);
        }

        [HttpPost] // Create
        public IActionResult Add([FromBody] SaveEmployeeDto employee)
        {
            var newEmployee = new Employee()
            {
                Id = (employees.LastOrDefault()?.Id ?? 0) + 1,
                FirstName = employee.FirstName,
                LastName = employee.LastName,
                Position = employee.Position,
                BirthDate = employee.BirthDate,
                StartDate = employee.StartDate,
                EndDate = employee.EndDate,
                Email = employee.Email,
                IsActive = employee.IsActive,
                Phone = employee.Phone,
                Salary = employee.Salary,
            };

            employees.Add(newEmployee);

            return Ok(newEmployee.Id);
        }

       // [HttpPatch] // Update Only Specific Values
        [HttpPut] // Update All Values
        public IActionResult Update([FromBody] SaveEmployeeDto employeeDto)
        {
            //var employee = employees.Any(x => x.Id == employeeDto.Id); --> True / False

            var employee = employees.FirstOrDefault(x => x.Id == employeeDto.Id);
            if(employee == null)
            {
                return NotFound("Employee Does Not Exist");
            }

            employee.FirstName = employeeDto.FirstName;
            employee.LastName = employeeDto.LastName;
            employee.Position = employeeDto.Position;
            employee.BirthDate = employeeDto.BirthDate;
            employee.StartDate = employeeDto.StartDate;
            employee.Email = employeeDto.Email;
            employee.IsActive = employeeDto.IsActive;
            employee.Phone = employeeDto.Phone;
            employee.EndDate = employeeDto.EndDate;
            employee.Salary = employeeDto.Salary;

            return Ok();
        }


        [HttpDelete("{id}")] // Delete
        public IActionResult Delete(long id)
        {
            var employee = employees.FirstOrDefault(x => x.Id == id);
            if(employee == null)
            {
                return NotFound("Employee Does Not Exist");
            }

            employees.Remove(employee);
            return Ok();
        }
    }
   
}


// Query Paramater --> FromQuery
// Request Body --> FromBody

// Simple Data Type --> string, int, long.... --> (By Default) Query Parameter
// Complix Data Type --> Model, Dto, Object.... --> (By Default) Request Body

// Method Can Use Multiple Parameters Of Type [FromQuery]
// Method Cannot Use Multiple Parameter Of Type [FromBody]

// Http Post/Put : Can Use Both Body Request [FromBody] And Query Parameter [FromQuery], But We Will Only Use [FromBody]
// Http Get : Cannot Use Body Request [FromBody], We can only use Query Parameter [FromQuery] Or Route Paramter
// Http Delete : Can Use Both Body Request [FromBody] And Query Parameter [FromQuery], We Will Only Use Query Parameter [FromQuery] Or Route Paramter