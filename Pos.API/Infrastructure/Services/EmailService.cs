using MailKit.Net.Smtp;
using MimeKit;
using Pos.API.Common;
using Pos.API.Models;
using System.Linq;

namespace Pos.API.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        public EmailService()
        {

        }
        public void SendEmail(MessageModel message)
        {
            var _emailConfig = Utilities.GetSection("EmailConfiguration").Get<EmailConfiguration>();
            var emailMessage = CreateEmailMessage(message, _emailConfig);
            Send(emailMessage, _emailConfig);
        }

        private MimeMessage CreateEmailMessage(MessageModel message, EmailConfiguration _emailConfig)
        {
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress(string.Format("Hi Pos {0}", message.Subject), _emailConfig.From));
            emailMessage.To.AddRange(message.To);
            emailMessage.Subject = message.Subject;
            emailMessage.Body = new TextPart(MimeKit.Text.TextFormat.Html) { Text = message.Content };

            if (!string.IsNullOrEmpty(_emailConfig.CC))
            {
                var ccEmail = _emailConfig.CC.Split(';').Where(x=>x.Length > 0).ToList();
                emailMessage.Cc.AddRange(ccEmail.Select(x => new MailboxAddress("email", x)).ToList());
            }
            return emailMessage;
        }

        private void Send(MimeMessage mailMessage, EmailConfiguration _emailConfig)
        {
            using var client = new SmtpClient();
            try
            {
                client.Connect(_emailConfig.SmtpServer, _emailConfig.Port, true);
                client.AuthenticationMechanisms.Remove("XOAUTH2");
                client.Authenticate(_emailConfig.UserName, _emailConfig.Password);

                client.Send(mailMessage);
            }
            catch
            {
                //log an error message or throw an exception or both.
                throw;
            }
            finally
            {
                client.Disconnect(true);
                client.Dispose();
            }
        }
    }
}
