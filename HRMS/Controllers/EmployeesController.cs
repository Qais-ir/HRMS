using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using HRMS.Models;
using HRMS.Dtos.Employees;
using HRMS.DbContexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using HRMS.Dtos.Shared;
using HRMS.Enums;

namespace HRMS.Controllers
{
    [Authorize]
    [Route("api/[controller]")]// Data Annotation
    [ApiController]// Data Annotation
    public class EmployeesController : ControllerBase
    {
        // Depndency Injuction
        private readonly HRMSContext _dbContext;
        private readonly IWebHostEnvironment _env;
        private readonly IConfiguration _config;
        public EmployeesController(HRMSContext dbContext, IWebHostEnvironment env, IConfiguration config)
        {
            _dbContext = dbContext;
            _env = env;
            _config = config;
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
                                 Status = employee.Status,
                                 ImagePath = employee.ImagePath != null ? Path.Combine(_config["BaseUrl"], employee.ImagePath) : ""
                             };

                if(role?.ToUpper() != "ADMIN" && role?.ToUpper() != "HR")
                {
                    result = result.Where(x => x.UserId == long.Parse(userId));
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
                        Status = x.Status,
                        ImagePath = x.ImagePath,
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

        [Authorize(Roles = "HR,Admin")]
        [HttpPost("Add")] // Create
        public IActionResult Add([FromForm] SaveEmployeeDto employeeDto)
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
                                Status = employeeDto.Status,
                                ImagePath = employeeDto.Image != null? UploadImage(employeeDto.Image) : null
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
        [Authorize(Roles = "HR,Admin")]
        [HttpPut("Update")] // Update
        public IActionResult Update([FromForm] SaveEmployeeDto employeeDto)
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

                if(employeeDto.Image != null)
                {
                    employee.ImagePath = UploadImage(employeeDto.Image);
                }
                else if(employeeDto.Image == null && employeeDto.IsImage == false)
                {
                    employee.ImagePath = null;
                }

                _dbContext.SaveChanges();

                return Ok();
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
            
        }

        [Authorize(Roles = "HR,Admin")]
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
                           where pos.MajorCode == (int)LookupMajorCodes.Positions
                           && pos.MinorCode == (int)PositionsMinorCodes.Manager
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

        [HttpGet("GetEmployeeList")]
        public IActionResult GetEmployeeList([FromQuery] bool? currentUserOnly)
        {

            var data = _dbContext.Employees.Where(x => x.Status);

            if (currentUserOnly == true)// check if you want to return the current user only
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                data = data.Where(x => x.UserId == long.Parse(userId));
            }

            var employees = data.Select(x => new ListDto
            {
                Id = x.Id,
                Name = x.FirstName + " " + x.LastName,
            });
            return Ok(employees);
        }

        private string UploadImage(IFormFile Image)
        {
            /*
                \n  // Antoher Line
                \"  // Quatiation in string
                \t  // tab space
                \\  // back slash in string
             */
            //var employeeImagesPath = "D:\\HRMS\\HRMS\\wwwroot\\Attachments\\EmployeesImages";
            var employeeImagesPath = Path.Combine( "Attachments", "EmployeesImages");

            // _env.WebRootPath = "D:\\HRMS\\HRMS\\wwwroot"
            var wwwrootPath = Path.Combine(_env.WebRootPath, employeeImagesPath);

            if (!Directory.Exists(wwwrootPath)) // True If Path Found, False If Not
            {
                Directory.CreateDirectory(wwwrootPath); // If Not Found, Then Create Directory     
            }

            var fileExtnesion = Path.GetExtension(Image.FileName); // --> .png, .jpg ...
            var fileName = Guid.NewGuid() + fileExtnesion; // --> 0f8fad5b-d9cb-469f-a165-70867728950e.jpg

            var filePath = Path.Combine(wwwrootPath, fileName);

            using(var stream = new FileStream(filePath, FileMode.Create)) // To make a connection with database or windows files
            {
                Image.CopyTo(stream); // Copy from original image to file path
            }

            return Path.Combine(employeeImagesPath, fileName); 
            // Attachments\\EmployeesImages\\0f8fad5b-d9cb-469f-a165-70867728950e.jpg
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
