using HRMS.DbContexts;
using HRMS.Dtos.AuthDto;
using HRMS.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace HRMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly HRMSContext _dbContext;

        public AuthController(HRMSContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost("Login")]
        public IActionResult Login([FromBody] LoginDto loginDto)
        {
            // admin == Admin
            var user = _dbContext.Users.FirstOrDefault(x => x.Username.ToUpper() == loginDto.Username.ToUpper());

            if(user == null)
            {
                return Unauthorized("Invalid Username Or Password"); // 401
            }

            // $2a$11$tizSPUwyAVKiSCsq6U5NseLdmKVBhoyXNHCwMUphnf9kF38MzrE9O != Admin@123
            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.HashedPassword))
            {
                return Unauthorized("Invalid Username Or Password"); // 401
            }

            // Token
            var token = GenerateJwtToken(user);

            return Ok(token);
        }


        private string GenerateJwtToken(User user)
        {

            // Claims --> User Info
            var claims = new List<Claim>();
            // Key | Value
            claims.Add(new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())); // Id
            claims.Add(new Claim(ClaimTypes.Name, user.Username)); // Username

            // Role
            if (user.IsAdmin)
            {
                claims.Add(new Claim(ClaimTypes.Role, "Admin"));
            }
            else
            {
                // Get Employee Position As Role
                var employee = _dbContext.Employees.Include(x => x.Lookup).FirstOrDefault(x => x.UserId == user.Id);
                claims.Add(new Claim(ClaimTypes.Role, employee.Lookup.Name));
            }


            // Secret Key = WHAFWEI#!@S!!112312WQEQW@RWQEQW324
            // WHAFWEI#!@S!!112312WQEQW@RWQEQW324 = [35, 32, 15......]
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("WHAFWEI#!@S!!112312WQEQW@RWQEQW324"));


            // Signing Credentials
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Token Settings
            var tokenSettings = new JwtSecurityToken(
                    claims: claims,
                    signingCredentials: creds,
                    expires: DateTime.Now.AddDays(1)
                );

            // Create New Token
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.WriteToken(tokenSettings);

            return token;
    
        }
    }
}
