using HRMS.DbContexts;
using HRMS.Dtos.Shared;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HRMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LookupsController : ControllerBase
    {
        private HRMSContext _dbContext;
        public LookupsController(HRMSContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet("GetByMajorCode")]
        public IActionResult GetByMajorCode([FromQuery] int MajorCode)
        {
            var data = from lookup in _dbContext.Lookups
                       where lookup.MajorCode == MajorCode && lookup.MinorCode != 0
                       select new ListDto
                       {
                           Id = lookup.Id,
                           Name = lookup.Name,
                       };

            return Ok(data);

        }
    }
}
