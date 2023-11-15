using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pos.API.Common;
using System.Security.Claims;

namespace Pos.API.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    [ApiController]
    public class BaseController : ControllerBase
    {

        public BaseController() {
        }

        internal int GetDonvi()
        {
            var donVi = User.FindFirstValue(ClaimTypes.PrimaryGroupSid); // will give the user's DonVi
            return int.Parse(donVi);
        }

        internal string GetUsername()
        {
            var username = User.FindFirstValue(ClaimTypes.NameIdentifier); // will give the user's DonVi
            return username;
        }
        private string AppendTimeStamp(string fileName)
        {
            return string.Concat(
                Path.GetFileNameWithoutExtension(fileName),
                "_",
                DateTime.Now.ToString("yyyyMMddHHmmssfff"),
                Path.GetExtension(fileName)
                );
        }

        internal async Task<string> UploadFileImage(IFormFile file, string filePath)
        {
            if (!Directory.Exists(filePath))
                Directory.CreateDirectory(filePath);

            var newFileName = AppendTimeStamp(file.FileName.Replace(" ", ""));

            using (Stream fileStream = new FileStream(Path.Combine(filePath, newFileName), FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }
            return newFileName;
        }

        internal async Task<string> ReturnFileNameAsync(IFormFile file, string FilePath,string requestPath, int DonVi, string pathOld, int maMH = 0)
        {
            if (file != null && file.FileName != "FILENULL")
            {
                string fileName = await UploadFileImage(file, FilePath);
                if (maMH== 0)
                {
                    if (DonVi == 0)
                    {
                        return string.Format("{0}://{1}{2}{3}/{4}", Request.Scheme, Request.Host, Request.PathBase, requestPath, fileName);

                    } 
                    else
                    {
                        return string.Format("{0}://{1}{2}{3}/{4}/{5}", Request.Scheme, Request.Host, Request.PathBase, requestPath, DonVi.ToString(), fileName);
                    }
                }
                var newPath = string.Format("{0}://{1}{2}{3}/{4}/{5}/{6}", Request.Scheme, Request.Host, Request.PathBase, requestPath, DonVi.ToString(),"mat-hang-"+ maMH, fileName);
                return newPath;
            }
            return pathOld;
        }

        internal void DeleteFile(string fullPath)
        {
            try
            {
                // Check if file exists with its full path    
                if (System.IO.File.Exists(fullPath))
                {
                    // If file found, delete it    
                    System.IO.File.Delete(fullPath);
                }
            }
            catch (IOException ioExp)
            {
                Console.WriteLine(ioExp.Message);
            }

        }
    }
}
