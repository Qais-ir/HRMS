using HRMS.Dtos.Department;
using HRMS.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HRMS.Controllers
{
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


        [HttpGet("GetByCriteria")]
        public IActionResult GetByCriteria([FromQuery] SearchDepartmentDto departmentDto)
        {
            var result = from department in departments
                         where (departmentDto.Name == null || department.Name.ToUpper().Contains(departmentDto.Name.ToUpper())) &&
                         (departmentDto.FloorNumber == null || department.FloorNumber == departmentDto.FloorNumber)
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

        [HttpGet("{id}")]
        public IActionResult GetById(long id)
        {
            var department = departments.Select(x => new DepartmentDto
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                FloorNumber = x.FloorNumber
            }).FirstOrDefault(x => x.Id == id);

            if(department == null)
            {
                return NotFound("Department Not Found"); // 404
            }

            return Ok(department); // 200

        }

        [HttpPost]
        public IActionResult Add([FromBody] SaveDepartmentDto departmentDto)
        {
            var department = new Department
            {
                Id = (departments.LastOrDefault()?.Id ?? 0) + 1, // departments.LastOrDefault()?.Id == null ? 0 : departments.LastOrDefault()?.Id
                Name = departmentDto.Name,
                Description = departmentDto.Description,
                FloorNumber = departmentDto.FloorNumber
            };
            departments.Add(department);

            return Ok(department.Id);
        }

        [HttpPut]
        public IActionResult Update([FromBody] SaveDepartmentDto departmentDto)
        {
            var department = departments.FirstOrDefault(x => x.Id == departmentDto.Id);


            if (department == null)
            {
                return NotFound("Department Does Not Exisit");
            }

            department.Name = departmentDto.Name;
            department.Description = departmentDto.Description;
            department.FloorNumber = departmentDto.FloorNumber;

            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(long id)
        {
            var department = departments.FirstOrDefault(x => x.Id == id);

            if(department == null)
            {
                return NotFound("Department Does Not Exisit");
            }

            departments.Remove(department);
            return Ok();
        }
    }
}
