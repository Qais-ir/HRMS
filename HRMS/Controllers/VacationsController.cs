using HRMS.DbContexts;
using HRMS.Dtos.Vacations;
using HRMS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HRMS.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class VacationsController : ControllerBase
    {

        private readonly HRMSContext _dbContext;
        public VacationsController(HRMSContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet("GetByCriteria")]
        public IActionResult GetByCriteria([FromQuery] VacationsFilterDto vacationFilterDto)
        {
            try
            {
                // Extracted From Token
                var role = User.FindFirst(ClaimTypes.Role)?.Value;// Admin, HR, Manager, Dveleoper
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                var data = from vac in _dbContext.Vacations
                           from emp in _dbContext.Employees.Where(x => x.Id == vac.EmployeeId) // Join
                           from lookup in _dbContext.Lookups.Where(x => x.Id == vac.TypeId)
                           where (vacationFilterDto.VacationTypeId == null || vacationFilterDto.VacationTypeId == vac.TypeId) &&
                           (vacationFilterDto.EmployeeId == null || vacationFilterDto.EmployeeId == vac.EmployeeId)
                           orderby vac.CreationDate descending
                           select new VacationDto
                           {
                               Id = vac.Id,
                               EmployeeId = vac.EmployeeId, // emp.Id
                               EmployeeName = emp.FirstName + " " + emp.LastName,
                               CreationDate = vac.CreationDate,
                               StartDate = vac.StartDate,
                               EndDate = vac.EndDate,
                               TypeId = vac.TypeId,
                               TypeName = lookup.Name,
                               Notes = vac.Notes,
                               UserId = emp.UserId
                           };

                if (role?.ToUpper() != "ADMIN" && role?.ToUpper() != "HR")
                {
                    data = data.Where(x => x.UserId == long.Parse(userId));
                }

                return Ok(data);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }


        }

        [HttpGet("GetById/{id}")]
        public IActionResult GetById(long Id)
        {
            try
            {
                var data = _dbContext.Vacations.Select(x => new VacationDto
                {
                    Id = x.Id,
                    EmployeeId = x.EmployeeId, // emp.Id
                    EmployeeName = x.Employee.FirstName + " " + x.Employee.LastName,
                    CreationDate = x.CreationDate,
                    StartDate = x.StartDate,
                    EndDate = x.EndDate,
                    TypeId = x.TypeId,
                    TypeName = x.Type.Name,
                    Notes = x.Notes
                }).FirstOrDefault(x => x.Id == Id);

                return Ok(data);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpPost("Add")]
        public IActionResult Add([FromBody] SaveVacationDto saveVacationDto)
        {


            try
            {

                var role = User.FindFirst(ClaimTypes.Role)?.Value;
                if (role?.ToUpper() != "ADMIN" && role?.ToUpper() != "HR") // Check if user admin or hr
                {
                    if (!IsCurrentUser(saveVacationDto.EmployeeId)) // check if user is assigning the vacation to himself
                    {
                        return BadRequest("You cannot assign a vacation to another employee");
                    }
                }

                var vacation = new Vacation()
                {
                    Id = 0,
                    StartDate = saveVacationDto.StartDate,
                    EndDate = saveVacationDto.EndDate,
                    Notes = saveVacationDto.Notes,
                    EmployeeId = saveVacationDto.EmployeeId,
                    TypeId = saveVacationDto.TypeId,
                };

                _dbContext.Vacations.Add(vacation);
                _dbContext.SaveChanges();
                return Ok();

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("Update")]
        public IActionResult Update([FromBody] SaveVacationDto saveVacationDto)
        {


            try
            {
                var vacation = _dbContext.Vacations.FirstOrDefault(x => x.Id == saveVacationDto.Id);
                if (vacation == null)
                {
                    return BadRequest("Vacation Not Found");
                }

                var role = User.FindFirst(ClaimTypes.Role)?.Value;
                if (role?.ToUpper() != "ADMIN" && role?.ToUpper() != "HR")
                {
                    if (!IsCurrentUser(vacation.EmployeeId))
                    {
                        return BadRequest("You cannot update a vacation assigned to another employee");
                    }
                }

                vacation.StartDate = saveVacationDto.StartDate;
                vacation.EndDate = saveVacationDto.EndDate;
                vacation.Notes = saveVacationDto.Notes;
                vacation.EmployeeId = saveVacationDto.EmployeeId;
                vacation.TypeId = saveVacationDto.TypeId;

                _dbContext.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("Delete/{id}")]
        public IActionResult Delete(long Id)
        {


            try
            {
                var vacation = _dbContext.Vacations.FirstOrDefault(x => x.Id == Id);
                if (vacation == null)
                {
                    return BadRequest("Vacation Not Found");
                }

                var role = User.FindFirst(ClaimTypes.Role)?.Value;
                if (role?.ToUpper() != "ADMIN" && role?.ToUpper() != "HR")
                {
                    if (!IsCurrentUser(vacation.EmployeeId))
                    {
                        return BadRequest("You cannot delete a vacation assigned to another employee");
                    }
                }

                _dbContext.Vacations.Remove(vacation);
                _dbContext.SaveChanges();

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        private bool IsCurrentUser(long employeeId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;//token

            var empUserId = _dbContext.Employees.FirstOrDefault(x => x.Id == employeeId)?.UserId;

            if (empUserId == long.Parse(userId))
            {
                return true;
            }

            return false;

        }

    }
}
