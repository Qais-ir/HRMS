using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using HRMS.Models;
using HRMS.Dtos.Employees;
using HRMS.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace HRMS.Controllers
{
    [Route("api/[controller]")]// Data Annotation
    [ApiController]// Data Annotation
    public class EmployeesController : ControllerBase
    {
        // Depndency Injuction
        private readonly HRMSContext _dbContext;
        public EmployeesController(HRMSContext dbContext)
        {
            _dbContext = dbContext;
        }



        // Nuget Packeage

        // CRUD Operations 
        // C : Create
        // R : Read
        // U : Update
        // D : Delete

        // Read
        [HttpGet("GetByCriteria")] // Data Annotation : Method -> Api Endpoint
        public IActionResult GetByCriteria([FromQuery] SearchEmployeeDto employeeDto) // (?) --> Optional / Nullable
        {
            var result = from employee in _dbContext.Employees
                         from department in _dbContext.Departments.Where(x => x.Id == employee.DepartmentId).DefaultIfEmpty() // Left Join
                         from manager in _dbContext.Employees.Where(x => x.Id == employee.ManagerId).DefaultIfEmpty() // Left Join
                         from lookup in _dbContext.Lookups.Where(x => x.Id == employee.PositionId)                                                                                            
                         where 
                         (employeeDto.PositionId == null || employee.PositionId == employeeDto.PositionId) && 
                         (employeeDto.Name == null || employee.FirstName.ToUpper().Contains(employeeDto.Name.ToUpper()))
                         orderby employee.Id descending
                         select new EmployeeDto
                         {
                             Id = employee.Id,
                             Name = employee.FirstName + " " + employee.LastName,
                             PositionId = employee.PositionId,
                             PositionName = lookup.Name,
                             BirthDate = employee.BirthDate,
                             Email = employee.Email,
                             Salary = employee.Salary,
                             DepartmentId = employee.DepartmentId,
                             DepartmentName = department.Name,
                             ManagerId = employee.ManagerId,
                             ManagerName = manager.FirstName,
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
            var result = _dbContext.Employees.Select(x => new EmployeeDto
            {
                Id = x.Id,
                Name = x.FirstName + " " + x.LastName,
                PositionId = x.PositionId,
                PositionName = x.Lookup.Name,
                BirthDate = x.BirthDate,
                Email = x.Email,
                Salary = x.Salary,
                DepartmentId = x.DepartmentId,
                DepartmentName = x.Department.Name,
                ManagerId = x.ManagerId,
                ManagerName = x.Manager.FirstName
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
                Id = 0, //(employees.LastOrDefault()?.Id ?? 0) + 1,
                FirstName = employeeDto.FirstName,
                LastName = employeeDto.LastName,
                Email = employeeDto.Email,
                BirthDate = employeeDto.BirthDate,
                PositionId = employeeDto.PositionId,
                Salary = employeeDto.Salary,
                DepartmentId = employeeDto.DepartmentId,
                ManagerId = employeeDto.ManagerId
            };
            _dbContext.Employees.Add(employee);
            _dbContext.SaveChanges(); // Commit

            return Ok();
        }

        [HttpPut("Update")] // Update
        public IActionResult Update([FromBody] SaveEmployeeDto employeeDto)
        {
            var employee = _dbContext.Employees.FirstOrDefault(x => x.Id == employeeDto.Id);

            if(employee == null)
            {
                return NotFound("Employee Does Not Exist");
            }

            employee.FirstName = employeeDto.FirstName;
            employee.LastName = employeeDto.LastName;
            employee.Email = employeeDto.Email;
            employee.BirthDate = employeeDto.BirthDate;
            employee.PositionId = employeeDto.PositionId;
            employee.Salary = employeeDto.Salary;
            employee.DepartmentId = employeeDto.DepartmentId;
            employee.ManagerId = employeeDto.ManagerId;
            _dbContext.SaveChanges();

            return Ok();
        }

        [HttpDelete("Delete/{id}")] // Delete
        public IActionResult Delete(long id)
        {
            var employee = _dbContext.Employees.FirstOrDefault(x => x.Id == id);

            if(employee == null)
            {
                return NotFound("Employee Does Not Exist"); // 404
            }

            _dbContext.Employees.Remove(employee);
            _dbContext.SaveChanges();
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
