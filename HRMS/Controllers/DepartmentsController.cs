using HRMS.DbContexts;
using HRMS.Dtos.Departments;
using HRMS.Dtos.Shared;
using HRMS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HRMS.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentsController : ControllerBase
    {


        private readonly HRMSContext _dbContext;
        public DepartmentsController(HRMSContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet("GetByCriteria")]
        public IActionResult GetByCriteria([FromQuery] FilterDepartmentsDto filterDto)
        {
            try
            {
                var result = from department in _dbContext.Departments
                             from type in _dbContext.Lookups.Where(x => x.Id == department.TypeId)
                             where (filterDto.Name == null || department.Name.ToUpper().Contains(filterDto.Name.ToUpper())) &&
                             (filterDto.FloorNumber == null || department.FloorNumber == filterDto.FloorNumber)
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
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpGet("GetById/{id}")]
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
                    return NotFound("Department Does Not Exist"); // 404
                }

                return Ok(department);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [Authorize(Roles = "HR,Admin")]
        [HttpPost("Add")]
        public IActionResult Add([FromBody] SaveDepartmentDto saveDto)
        {
            try
            {
                var department = new Department
                {
                    Id = 0,
                    Name = saveDto.Name,
                    Description = saveDto.Description,
                    FloorNumber = saveDto.FloorNumber,
                    TypeId = saveDto.TypeId,
                };

                _dbContext.Departments.Add(department);
                _dbContext.SaveChanges();
                return Ok();
            }
            catch (Exception ex) {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "HR,Admin")]
        [HttpPut("Update")]
        public IActionResult Update([FromBody] SaveDepartmentDto saveDto)
        {
            try
            {
                var department = _dbContext.Departments.FirstOrDefault(x => x.Id == saveDto.Id);
                if (department == null)
                {
                    return NotFound("Department Does Not Exist");
                }

                department.Name = saveDto.Name;
                department.Description = saveDto.Description;
                department.FloorNumber = saveDto.FloorNumber;
                department.TypeId = saveDto.TypeId;
                _dbContext.SaveChanges();

                return Ok();
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [Authorize(Roles = "HR,Admin")]
        [HttpDelete("Delete/{id}")]
        public IActionResult Delete(long id)
        {
            try
            {
                var department = _dbContext.Departments.FirstOrDefault(x => x.Id == id);
                if (department == null)
                {
                    return NotFound("Department Does Not Exist");
                }

                var isEmployee = _dbContext.Employees.Any(x => x.DepartmentId == id);
                if (isEmployee)
                {
                    return BadRequest("Department with assigned employees cannot be deleted");
                }

                _dbContext.Departments.Remove(department);
                _dbContext.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpGet("GetDepartmentsList")]
        public IActionResult GetDepartmetnsList()
        {
            try
            {
                var data = _dbContext.Departments.Select(x => new ListDto
                {
                    Id = x.Id,
                    Name = x.Name,
                });

                return Ok(data);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
