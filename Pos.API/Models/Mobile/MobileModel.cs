using Pos.API.Common;
using Pos.API.Domain.Entities;

namespace Pos.API.Models.Mobile
{
    public class ResponeDataListMobile<T>
    {
        public IEnumerable<T> Data { set; get; } = new List<T>();
        public int Page { set; get; }
        public int PageSize { set; get; }
        public int TotalPages { set; get; }
        public int TotaRecord
        {
            set { }
            get
            {
                return Data.Count();
            }
        }
        public int TotalReferrals { set; get; }
    }
    public class ResponeMobile<T>
    {
        public T Data { set; get; }
        public ResponseBase Results { set; get; }
    }
}
