using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using HRMS.Models;
using HRMS.Dtos.Employees;
using HRMS.DbContexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using HRMS.Dtos.Shared;

namespace HRMS.Controllers
{
    //[Authorize]
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
            try
            {
                // From Token
                var role = User.FindFirst(ClaimTypes.Role)?.Value; // Admin, Hr, Manager, Developer
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;



                var result = from employee in _dbContext.Employees
                             from department in _dbContext.Departments.Where(x => x.Id == employee.DepartmentId).DefaultIfEmpty() // Left Join
                             from manager in _dbContext.Employees.Where(x => x.Id == employee.ManagerId).DefaultIfEmpty() // Left Join
                             from lookup in _dbContext.Lookups.Where(x => x.Id == employee.PositionId)
                             where
                             (employeeDto.PositionId == null || employee.PositionId == employeeDto.PositionId) &&
                             (employeeDto.Name == null || employee.FirstName.ToUpper().Contains(employeeDto.Name.ToUpper())) &&
                             (employeeDto.Status == null || employee.Status == employeeDto.Status)
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
                                 UserId = employee.UserId,
                                 Status = employee.Status
                             };

                if(role?.ToUpper() != "ADMIN" && role?.ToUpper() != "HR")
                {
                   // result = result.Where(x => x.UserId == long.Parse(userId));
                }

                return Ok(result);

                //return Ok(new { Name = "Ahmad", Age = 26});// 200
                //return NotFound("No Data Found");// 404
                //return BadRequest("Data Missing"); // 400
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpGet("GetById/{id}")] // Route Parameter
        public IActionResult GetById(long id)
        {
            try {
                // From Token
                var role = User.FindFirst(ClaimTypes.Role)?.Value; // Admin, Hr, Manager, Developer
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                    if (id == 0)
                    {
                        return BadRequest("Id Value Is Invalid");
                    }
                    var result = _dbContext.Employees.Select(x => new EmployeeDto // Projection
                    {
                        Id = x.Id,
                        Name = x.FirstName + " " + x.LastName,
                        FirstName = x.FirstName,
                        LastName = x.LastName,
                        PositionId = x.PositionId,
                        PositionName = x.Lookup.Name,
                        BirthDate = x.BirthDate,
                        Email = x.Email,
                        Salary = x.Salary,
                        DepartmentId = x.DepartmentId,
                        DepartmentName = x.Department.Name,
                        ManagerId = x.ManagerId,
                        ManagerName = x.Manager.FirstName,
                        UserId = x.UserId,
                        Status = x.Status
                    }).FirstOrDefault(x => x.Id == id);


                    /*
                     var result = _dbContext.Employees.Include(x => x.Lookup).Include(x => x.Manager).ThenInclude(x => x.Lookup) // Eager Loading
                        .FirstOrDefault(x => x.Id == id); 
                    */


                    // Projection --> Select
                    // Eager Loading --> Include
                    // Lazy Loading --> ??

                    if (result == null)
                    {
                        return NotFound("Employee Not Found");
                    }


                    if (role?.ToUpper() != "ADMIN" && role?.ToUpper() != "HR")
                    {
                        //if (result.UserId != long.Parse(userId))
                        //{
                        //    return Forbid(); // 403
                        //}
                    }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //[Authorize(Roles = "HR,Admin")]
        [HttpPost("Add")] // Create
        public IActionResult Add([FromBody] SaveEmployeeDto employeeDto)
        {
            try
            {
                var user = new User()
                {
                    Id = 0,
                    Username = $"{employeeDto.FirstName}_{employeeDto.LastName}_HRMS", // Ahmad_Khalid_HRMS
                    HashedPassword = BCrypt.Net.BCrypt.HashPassword($"{employeeDto.FirstName}@123"), // Ahmad@123
                    IsAdmin = false
                };

                var isUsername = _dbContext.Users.Any(x => x.Username.ToUpper() == user.Username.ToUpper());
                if(isUsername)
                {
                    return BadRequest("Username Already Exist, Please choose another one");
                }

                _dbContext.Users.Add(user);

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
                                ManagerId = employeeDto.ManagerId,
                                //UserId = user.Id
                                User = user,
                                Status = employeeDto.Status
                            };
                 _dbContext.Employees.Add(employee);

                 _dbContext.SaveChanges(); // Commit

                 return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

}
       // [Authorize(Roles = "HR,Admin")]
        [HttpPut("Update")] // Update
        public IActionResult Update([FromBody] SaveEmployeeDto employeeDto)
        {
            try
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
                employee.Status = employeeDto.Status;
                _dbContext.SaveChanges();

                return Ok();
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
            
        }

        //[Authorize(Roles = "HR,Admin")]
        [HttpDelete("Delete/{id}")] // Delete
        public IActionResult Delete(long id)
        {
            try
            {
                 var employee = _dbContext.Employees.FirstOrDefault(x => x.Id == id);

                            if(employee == null)
                            {
                                return NotFound("Employee Does Not Exist"); // 404
                            }

                var employeeManager = _dbContext.Employees.Any(x => x.ManagerId == id);
                if (employeeManager)
                {
                    return BadRequest(new Exception("Managers with assigned employees can not be deleted."));
                }

                _dbContext.Employees.Remove(employee);
                _dbContext.SaveChanges();
                 return Ok();
            }
            
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpGet("GetManagers")]
        public IActionResult GetManagers()
        {
            try
            {
                var data = from emp in _dbContext.Employees
                           from pos in _dbContext.Lookups.Where(x => x.Id == emp.PositionId)
                           where pos.MajorCode == 0 && pos.MinorCode == 3
                           select new ListDto
                           {
                               Id = emp.Id,
                               Name = emp.FirstName + " " + emp.LastName
                           };

                return Ok(data);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

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
