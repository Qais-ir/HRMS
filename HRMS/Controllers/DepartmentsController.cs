using HRMS.DbContexts;
using HRMS.Dtos.Department;
using HRMS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HRMS.Controllers
{
    //[Authorize]
    [Route("api/[controller]")] // api/Departments
    [ApiController]
    public class DepartmentsController : ControllerBase
    {
        public static List<Department> departments = new List<Department>()
        {
            new Department(){ Id = 1, Name = "Human Resources", Description = "HR Deaprtment", FloorNumber = 1},
            new Department(){ Id = 2, Name = "Finance", Description = "Finance Deaprtment", FloorNumber = 2},
            new Department(){ Id = 3, Name = "Development", Description = "Development Deaprtment", FloorNumber = 1}
        };

        private readonly HRMSContext _dbContext;
        public DepartmentsController(HRMSContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet("GetByCriteria")]
        public IActionResult GetByCriteria([FromQuery] SearchDepartmentDto departmentDto)
        {
            try
            {
                var result = from department in _dbContext.Departments
                             from type in _dbContext.Lookups.Where(x => x.Id == department.TypeId).DefaultIfEmpty()
                             where (departmentDto.Name == null || department.Name.ToUpper().Contains(departmentDto.Name.ToUpper())) &&
                             (departmentDto.FloorNumber == null || department.FloorNumber == departmentDto.FloorNumber)
                             orderby department.Id descending
                             select new DepartmentDto
                             {
                                 Id = department.Id,
                                 Name = department.Name,
                                 Description = department.Description,
                                 FloorNumber = department.FloorNumber,
                                 TypeId = department.TypeId,
                                 TypeName = type.Name
                             };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }

        [HttpGet("{id}")]
        public IActionResult GetById(long id)
        {
            try
            {
                var department = _dbContext.Departments.Select(x => new DepartmentDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Description = x.Description,
                    FloorNumber = x.FloorNumber,
                    TypeId = x.TypeId,
                    TypeName = x.Type.Name
                }).FirstOrDefault(x => x.Id == id);

                if (department == null)
                {
                    return NotFound("Department Not Found"); // 404
                }

                return Ok(department); // 200
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }


        }

       // [Authorize(Roles = "Admin,HR")] // 403
        [HttpPost]
        public IActionResult Add([FromBody] SaveDepartmentDto departmentDto)
        {
            try
            {
                var department = new Department
                {
                    Id = 0, // departments.LastOrDefault()?.Id == null ? 0 : departments.LastOrDefault()?.Id
                    Name = departmentDto.Name,
                    Description = departmentDto.Description,
                    FloorNumber = departmentDto.FloorNumber,
                    TypeId = departmentDto.TypeId
                };

                _dbContext.Departments.Add(department);
                _dbContext.SaveChanges();

                return Ok(department.Id);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }

       // [Authorize(Roles = "Admin,HR")]
        [HttpPut]
        public IActionResult Update([FromBody] SaveDepartmentDto departmentDto)
        {
            try
            {
                var department = _dbContext.Departments.FirstOrDefault(x => x.Id == departmentDto.Id);


                if (department == null)
                {
                    return NotFound("Department Does Not Exisit");
                }

                department.Name = departmentDto.Name;
                department.Description = departmentDto.Description;
                department.FloorNumber = departmentDto.FloorNumber;
                department.TypeId = departmentDto.TypeId;

                _dbContext.SaveChanges();

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }

      //  [Authorize(Roles = "Admin,HR")]
        [HttpDelete("{id}")]
        public IActionResult Delete(long id)
        {
            try
            {
                var department = _dbContext.Departments.FirstOrDefault(x => x.Id == id);

                if (department == null)
                {
                    return NotFound("Department Does Not Exisit");
                }

                var isEmployee = _dbContext.Employees.Any(x => x.DepartmentId == id);
                if (isEmployee)
                {
                    return BadRequest("Department with assigned employees can not be deleted");
                }

                _dbContext.Departments.Remove(department);
                _dbContext.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }

        [HttpGet("GetList")]
        public IActionResult GetList()
        {
            try
            {
                var data = _dbContext.Departments.Select(x => new {
                    Id = x.Id,
                    Name = x.Name
                });

                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
