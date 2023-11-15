using Microsoft.AspNetCore.Http.Extensions;
using Serilog;
using System.Diagnostics;

namespace Pos.API.Common.HandleError
{
    public class ErrorHandlingMiddleware : IMiddleware
    {
        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            try
            {
                await next(context);
            }
            catch(Exception ex)
            {
                var msg = FormatStringException(ex, context);
                Log.Error(msg);
            }
        }

        private string FormatStringException(Exception exp, HttpContext context)
        {
            // Get stack trace for the exception with source file information
            var st = new StackTrace(exp, true);

            var content = "\n-----------Exception Details on {0} ----------------- \n" +
                          "Log Written Date: {1}\n"+
                          "Error Url: {2}\n" +
                          "Error Message: {3}\n" +
                          "Error Type: {4}\n" +
                          "Error Content: {5}\n" +
                          "Detail: {6}\n" +
                          "--------------------------------*End*------------------------------------------"
                          ;
            var result = string.Format(content,
                Utilities.GetDateTimeSystem().ToString(), 
                Utilities.GetDateTimeSystem().ToString(), 
                context.Request.GetDisplayUrl(), 
                exp.GetType().Name, 
                exp.GetType(), 
                exp.Message, 
                exp.StackTrace);

            return result;
        }
        private readonly ILogger<ErrorHandlingMiddleware> _logger;
        public ErrorHandlingMiddleware(ILogger<ErrorHandlingMiddleware> logger)
        {
            _logger = logger;
        }

    }
}
