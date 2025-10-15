using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using HRMS.Models;
using HRMS.Dtos.Employees;

namespace HRMS.Controllers
{
    [Route("api/[controller]")]// Data Annotation
    [ApiController]// Data Annotation
    public class EmployeesController : ControllerBase
    {
        public static List<Employee> employees = new List<Employee>() { 
           new Employee(){Id = 1, FirstName = "Ahmad", LastName = "Nassar", Email = "Ahmad@123.com", Position = "Developer", BirthDate = new DateTime(2000,1,25)},
           new Employee(){Id = 2, FirstName = "Layla", LastName = "Kareem", Position = "Manager", BirthDate = new DateTime(1996,10,21)},
           new Employee(){Id = 3, FirstName = "Yusef", LastName = "Faris", Position = "HR", BirthDate = new DateTime(1995,5,5)},
           new Employee(){Id = 4, FirstName = "Nadia", LastName = "Zaid", Email = "Nadia@123.com", Position = "Developer", BirthDate = new DateTime(1991,11,15)}
        };

        // CRUD Operations 
        // C : Create
        // R : Read
        // U : Update
        // D : Delete

        // Read
        [HttpGet("GetByCriteria")] // Data Annotation : Method -> Api Endpoint
        public IActionResult GetByCriteria([FromQuery] SearchEmployeeDto employeeDto) // (?) --> Optional / Nullable
        {
            var result = from employee in employees
                         where (employeeDto.Position == null || employee.Position.ToUpper().Contains(employeeDto.Position.ToUpper())) && 
                         (employeeDto.Name == null || employee.FirstName.ToUpper().Contains(employeeDto.Name.ToUpper()))
                         orderby employee.Id descending
                         select new EmployeeDto
                         {
                             Id = employee.Id,
                             Name = employee.FirstName + " " + employee.LastName,
                             Position = employee.Position,
                             BirthDate = employee.BirthDate,
                             Email = employee.Email
                         };

            return Ok(result);

            //return Ok(new { Name = "Ahmad", Age = 26});// 200
            //return NotFound("No Data Found");// 404
            //return BadRequest("Data Missing"); // 400
        }

        [HttpGet("GetById/{id}")] // Route Parameter
        public IActionResult GetById(long id)
        {
            if(id == 0)
            {
                return BadRequest("Id Value Is Invalid");
            }
            var result = employees.Select(x => new EmployeeDto
            {
                Id = x.Id,
                Name = x.FirstName + " " + x.LastName,
                Position = x.Position,
                BirthDate = x.BirthDate,
                Email = x.Email
            }).FirstOrDefault(x => x.Id == id);

            if(result == null)
            {
                return NotFound("Employee Not Found");
            }

            return Ok(result);
        }

        [HttpPost("Add")] // Create
        public IActionResult Add([FromBody] SaveEmployeeDto employeeDto)
        {
            var employee = new Employee()
            {
                Id = (employees.LastOrDefault()?.Id ?? 0) + 1,
                FirstName = employeeDto.FirstName,
                LastName = employeeDto.LastName,
                Email = employeeDto.Email,
                BirthDate = employeeDto.BirthDate,
                Position = employeeDto.Position
            };
            employees.Add(employee);

            return Ok();
        }

        [HttpPut("Update")] // Update
        public IActionResult Update([FromBody] SaveEmployeeDto employeeDto)
        {
            var employee = employees.FirstOrDefault(x => x.Id == employeeDto.Id);

            if(employee == null)
            {
                return NotFound("Employee Does Not Exist");
            }

            employee.FirstName = employeeDto.FirstName;
            employee.LastName = employeeDto.LastName;
            employee.Email = employeeDto.Email;
            employee.BirthDate = employeeDto.BirthDate;
            employee.Position = employeeDto.Position;

            return Ok();
        }

        [HttpDelete("Delete/{id}")] // Delete
        public IActionResult Delete(long id)
        {
            var employee = employees.FirstOrDefault(x => x.Id == id);

            if(employee == null)
            {
                return NotFound("Employee Does Not Exist"); // 404
            }

            employees.Remove(employee);
            return Ok();
        }

    }



    // Simple Data Types --> string, int, double, long.... // Query Parameter (By Default) 
    // Complix Data Types --> Objects, Dtos, Model... // Body Request (By Defualt)

    // Http Get : Can Not Use Body Request [FromBody], We Can Only Use Query Parameters [FromQuery]
    // Http Post/Put : Can Use Both Body Request [FromBody] And Query Parameter [FromQuery], But We Will Only Use [FromBody]
    // Http Delete : Can Use Both Body Request [FromBody] And Query Parameter [FromQuery], But We Will Only Use [FromQuery]

    // Method Cannot Use Multiple Parameters Of Type [FromBody]
    // Method Can Use Multiple Parameters Of Type [FromQuery]
}
