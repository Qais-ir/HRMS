using HRMS.Dtos.Departments;
using HRMS.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HRMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentsController : ControllerBase
    {
        public static List<Department> departments = new List<Department>()
        {
            new Department(){Id = 1, Name = "Human Resources", Description = "Hr Department", FloorNumber = 1},
            new Department(){Id = 2, Name = "Finance", Description = "Finance Department", FloorNumber = 2},
            new Department(){Id = 3, Name = "Development", Description = "Development Department", FloorNumber = 1},
        };

        [HttpGet("GetByCriteria")]
        public IActionResult GetByCriteria([FromQuery] FilterDepartmentsDto filterDto)
        {
            var result = from department in departments
                         where (filterDto.Name == null || department.Name.ToUpper().Contains(filterDto.Name.ToUpper())) &&
                         (filterDto.FloorNumber == null || department.FloorNumber == filterDto.FloorNumber)
                         orderby department.Id descending
                         select new DepartmentDto
                         {
                             Id = department.Id,
                             Name = department.Name,
                             Description = department.Description,
                             FloorNumber = department.FloorNumber
                         };
            return Ok(result);
        }

        [HttpGet("GetById/{id}")]
        public IActionResult GetById(long id)
        {
            var department = departments.Select(x => new DepartmentDto
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                FloorNumber = x.FloorNumber,
            }).FirstOrDefault(x => x.Id == id);

            if(department == null)
            {
                return NotFound("Department Does Not Exist"); // 404
            }

            return Ok(department);
        }

        [HttpPost("Add")]
        public IActionResult Add([FromBody] SaveDepartmentDto saveDto)
        {
            var department = new Department
            {
                Id = (departments.LastOrDefault()?.Id ?? 0) + 1,
                Name = saveDto.Name,
                Description = saveDto.Description,
                FloorNumber = saveDto.FloorNumber,
            };

            departments.Add(department);
            return Ok();
        }

        [HttpPut("Update")]
        public IActionResult Update([FromBody] SaveDepartmentDto saveDto)
        {
            var department = departments.FirstOrDefault(x => x.Id == saveDto.Id);
            if(department == null)
            {
                return NotFound("Department Does Not Exist");
            }

            department.Name = saveDto.Name;
            department.Description = saveDto.Description;
            department.FloorNumber = saveDto.FloorNumber;

            return Ok();
        }

        [HttpDelete("Delete/{id}")]
        public IActionResult Delete(long id)
        {
            var department = departments.FirstOrDefault(x => x.Id == id);
            if(department == null)
            {
                return NotFound("Department Does Not Exist");
            }

            departments.Remove(department);
            return Ok();
        }
    }
}
