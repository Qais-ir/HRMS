using HRMS.DbContexts;
using HRMS.Dtos.Employee;
using HRMS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace HRMS.Controllers
{
    // Data Annotations
    //[Authorize]
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
            try
            {

                // Extract From Token : 1) UserId 2) Role
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var role = User.FindFirst(ClaimTypes.Role)?.Value;

                var data = from employee in _dbContext.Employees
                           from department in _dbContext.Departments.Where(x => x.Id == employee.DepartmentId).DefaultIfEmpty() // --> Left Join
                           from manager in _dbContext.Employees.Where(x => x.Id == employee.ManagerId).DefaultIfEmpty() // --> Left Join
                           from lookup in _dbContext.Lookups.Where(x => x.Id == employee.PositionId).DefaultIfEmpty()
                           where (employeeDto.PositionId == null || employee.PositionId == employeeDto.PositionId) &&
                           (employeeDto.Name == null || employee.FirstName.ToUpper().Contains(employeeDto.Name.ToUpper()))
                           orderby employee.Id
                           select new EmployeeDto
                           {
                               Id = employee.Id,
                               //FirstName = employee.FirstName,
                               // LastName = employee.LastName,
                               Name = employee.FirstName + " " + employee.LastName,
                               //  Position = employee.Position,
                               PositionId = employee.PositionId,
                               PositionName = lookup.Name,
                               BirthDate = employee.BirthDate,
                               StartDate = employee.StartDate,
                               EndDate = employee.EndDate,
                               DepartmentId = employee.DepartmentId,
                               DepartmentName = department.Name,
                               ManagerId = employee.ManagerId,
                               ManagerName = manager.FirstName,
                               UserId = employee.UserId,
                               Salary = employee.Salary,
                               Email = employee.Email,
                               IsActive = employee.IsActive

                           };

                //if (role?.ToUpper() != "ADMIN" && role?.ToUpper() != "HR")
                //{
                //    data = data.Where(x => x.UserId == long.Parse(userId));
                //}

                return Ok(data);
                //return StatusCode(200, new { Name = "Ahmad", Position = "Developer" });        
                //return Ok(new { Name = "Ahmad", Position = "Developer" }); // 200 OK                                                                       
                //return NotFound("Employee Not Found"); // 404 Not Found
                // return BadRequest("Data Not Loaded"); // 400 Bad Request
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }


        [HttpGet("{id}")] // Route Paramater
        public IActionResult GetById(long id)
        {

            try
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
                    //Position = employee.Position,
                    BirthDate = employee.BirthDate,
                    StartDate = employee.StartDate,
                    EndDate = employee.EndDate,
                    DepartmentId = employee.DepartmentId,
                    DepartmentName = employee.Department.Name,
                    ManagerId = employee.ManagerId,
                    ManagerName = employee.Manager.FirstName,
                    PositionId = employee.PositionId,
                    PositionName = employee.Lookup.Name
                }).FirstOrDefault(x => x.Id == id);

                //var data = _dbContext.Employees.Include(x => x.Department).Include(x => x.Manager).FirstOrDefault(x => x.Id == id);

                if (data == null)
                {
                    return NotFound("Employee Not Found");
                }

                return Ok(data);

            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }

        // Include --> Eager Loading
        // Select --> Projection
        // Lazy Loading --> ??

        //[Authorize(Roles = "Admin,HR")] // 403
        [HttpPost] // Create
        public IActionResult Add([FromBody] SaveEmployeeDto employee)
        {
            try
            {
                var user = new User()
                {
                    Id = 0,
                    Username = $"{employee.FirstName}_{employee.LastName}_HRMS", // Ahmad Nasser --> Ahmad_Nasser_HRMS
                    HashedPassword = BCrypt.Net.BCrypt.HashPassword($"{employee.FirstName}@123"), // Ahmad --> Ahmad@123
                    IsAdmin = false                                                                              
                };

                var duplicatedUser = _dbContext.Users.Any(x => x.Username.ToUpper() == user.Username.ToUpper());
                if (duplicatedUser)
                {
                    return BadRequest("Cannot add this employee: the username already exists. Please choose a diffreant username");
                }

                _dbContext.Users.Add(user);
               // _dbContext.SaveChanges();

                var newEmployee = new Employee()
                {
                    Id = 0, //(employees.LastOrDefault()?.Id ?? 0) + 1,
                    FirstName = employee.FirstName,
                    LastName = employee.LastName,
                    PositionId = employee.PositionId,
                    BirthDate = employee.BirthDate,
                    StartDate = employee.StartDate,
                    EndDate = employee.EndDate,
                    Email = employee.Email,
                    IsActive = employee.IsActive,
                    Phone = employee.Phone,
                    Salary = employee.Salary,
                    DepartmentId = employee.DepartmentId,
                    ManagerId = employee.ManagerId,
                   // UserId = user.Id
                    User = user
                };

                _dbContext.Employees.Add(newEmployee);


                _dbContext.SaveChanges();

                return Ok(newEmployee.Id);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }

        // [HttpPatch] // Update Only Specific Values
        //[Authorize(Roles = "Admin,HR")]
        [HttpPut] // Update All Values
        public IActionResult Update([FromBody] SaveEmployeeDto employeeDto)
        {
            try
            {
                //var employee = employees.Any(x => x.Id == employeeDto.Id); --> True / False

                var employee = _dbContext.Employees.FirstOrDefault(x => x.Id == employeeDto.Id);
                if (employee == null)
                {
                    return NotFound("Employee Does Not Exist");
                }

                employee.FirstName = employeeDto.FirstName;
                employee.LastName = employeeDto.LastName;
                employee.PositionId = employeeDto.PositionId;
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
            catch(Exception ex){

                return StatusCode(500, ex.Message);
            }
           
        }

       // [Authorize(Roles = "Admin,HR")]
        [HttpDelete("{id}")] // Delete
        public IActionResult Delete(long id)
        {
            try
            {
                var employee = _dbContext.Employees.FirstOrDefault(x => x.Id == id);
                if (employee == null)
                {
                    return NotFound("Employee Does Not Exist");
                }

                _dbContext.Employees.Remove(employee);

                _dbContext.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

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