namespace Pos.API.Models
{
    public class FileHoSoNhanVienModelResponse
    {
        public int Id { get; set; }
        public int File_No { get; set; }
        public string? File_Name { get; set; }
        public string? File_Description { get; set; }
        public DateTime File_Start { get; set; }
        public DateTime File_End { get; set; }
        public DateTime File_Warning { get; set; }
        public string File_URL { get; set; }
        public int File_Status { get; set; }
    }
}
