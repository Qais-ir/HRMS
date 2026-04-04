using HRMS.DbContexts;
using HRMS.Dtos.Employee;
using HRMS.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HRMS.Controllers
{
    // Data Annotations
    [Route("api/[controller]")] // api/Employees
    [ApiController]
    public class EmployeesController : ControllerBase
    {

        private readonly HRMSContext _dbContext;

        public EmployeesController(HRMSContext dbContext)
        {
            _dbContext = dbContext;
        }

        // Nuget Package : Library


        // CRUD Operations
        // C --> Create
        // R --> Read
        // U --> Update
        // D --> Delete

        // Endpoint
        [HttpGet("GetByCriteria")] // Read
        public IActionResult GetByCriteria([FromQuery] SearchEmployeeDto employeeDto) // (?) --> Optional / Nullable
        {

            var data = from employee in _dbContext.Employees
                      // from department in _dbContext.Departments.Where(x => x.Id == employee.DepartmentId).DefaultIfEmpty() // --> Left Join
                       from manager in _dbContext.Employees.Where(x => x.Id == employee.ManagerId).DefaultIfEmpty() // --> Left Join
                       where (employeeDto.Position == null || employee.Position.ToUpper().Contains(employeeDto.Position.ToUpper())) &&
                       (employeeDto.Name == null || employee.FirstName.ToUpper().Contains(employeeDto.Name.ToUpper()))
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
                           EndDate = employee.EndDate,
                           DepartmentId = employee.DepartmentId,
                          // DepartmentName = department.Name,
                           ManagerId = employee.ManagerId,
                           ManagerName = manager.FirstName
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

            //var data = _dbContext.Employees.Join(
            //        _dbContext.Departments,
            //        employee => employee.DepartmentId,
            //        department => department.Id,
            //        (employee, department) => new EmployeeDto
            //        {
            //            Id = employee.Id,
            //            Name = employee.FirstName + " " + employee.LastName,
            //            Position = employee.Position,
            //            BirthDate = employee.BirthDate,
            //            StartDate = employee.StartDate,
            //            EndDate = employee.EndDate,
            //            DepartmentId = employee.DepartmentId,
            //            DepartmentName = department.Name,
            //        }
            //    ).FirstOrDefault(x => x.Id == id);

            var data = _dbContext.Employees.Select(employee => new EmployeeDto
            {
                Id = employee.Id,
                Name = employee.FirstName + " " + employee.LastName,
                Position = employee.Position,
                BirthDate = employee.BirthDate,
                StartDate = employee.StartDate,
                EndDate = employee.EndDate,
                DepartmentId = employee.DepartmentId,
              //  DepartmentName = department.Name,
                ManagerId = employee.ManagerId,
               // ManagerName = manager.FirstName
            }).FirstOrDefault(x => x.Id == id);

            if (data == null)
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
                Id = 0, //(employees.LastOrDefault()?.Id ?? 0) + 1,
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
                DepartmentId = employee.DepartmentId,
                ManagerId = employee.ManagerId
            };

            _dbContext.Employees.Add(newEmployee);


            _dbContext.SaveChanges();

            return Ok(newEmployee.Id);
        }

       // [HttpPatch] // Update Only Specific Values
        [HttpPut] // Update All Values
        public IActionResult Update([FromBody] SaveEmployeeDto employeeDto)
        {
            //var employee = employees.Any(x => x.Id == employeeDto.Id); --> True / False

            var employee = _dbContext.Employees.FirstOrDefault(x => x.Id == employeeDto.Id);
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
            employee.DepartmentId = employeeDto.DepartmentId;
            employee.ManagerId = employeeDto.ManagerId;

            _dbContext.SaveChanges();
            return Ok();
        }


        [HttpDelete("{id}")] // Delete
        public IActionResult Delete(long id)
        {
            var employee = _dbContext.Employees.FirstOrDefault(x => x.Id == id);
            if(employee == null)
            {
                return NotFound("Employee Does Not Exist");
            }

            _dbContext.Employees.Remove(employee);

            _dbContext.SaveChanges();
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