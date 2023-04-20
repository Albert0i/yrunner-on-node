using System;
using System.Collections.Generic;
using System.Net;
using Newtonsoft.Json;

public partial class WebClient1 : System.Web.UI.Page
{
    protected void Button1_Click(object sender, EventArgs e)
    {
        if (RadioButtonList1.SelectedValue == "S")
        {
            GridView1.DataSource = SqlDataSource1;
            GridView1.DataBind();
            Label1.Text = String.Format("Success ({0})", GridView1.Rows.Count);
        }
        if (RadioButtonList1.SelectedValue == "R")
        {
            GridView1.DataSource = RESTfulCall();
            GridView1.DataBind();
        }
        if (RadioButtonList1.SelectedValue == "D")
            GridView1.DataSource = DirectCall();
            GridView1.DataBind();
    }

    protected List<ResultRowType> RESTfulCall()
    {
        string SERVICE_URL = "http://localhost:8989/api/v1/yr/tbrelcod?_sort=relcod&_order=asc";
        string retJSON = "";

        try
        {
            using (WebClient webClient = new WebClient())
            {
                webClient.Headers.Add("Content-Type", "application/json; charset=utf-8");
                webClient.Headers.Add("Authorization", "Bearer VEUdEii4n7nCvofaBRJEC");

                retJSON = webClient.DownloadString(SERVICE_URL);
                ResultType r = JsonConvert.DeserializeObject<ResultType>(retJSON);
                if (r.success)
                {
                    Label1.Text = String.Format("Success ({0})", r.rows.Count);
                    return r.rows;
                }

                return null;
            }
        }
        catch (WebException ex)
        {
            throw ex;
        }
    }

    protected List<ResultRowType> DirectCall()
    {
        string SERVICE_URL = "http://localhost:8989/api/v1/yr/runselectsql";
        string BodyData = @"{
                                ""cmdText"": ""select * from tbrelcod order by relcod asc""
                            }";
        string retJSON = "";

        try
        {
            using (WebClient webClient = new WebClient())
            {
                webClient.Headers.Add("Content-Type", "application/json; charset=utf-8");
                webClient.Headers.Add("Authorization", "Bearer VEUdEii4n7nCvofaBRJEC");

                retJSON = webClient.UploadString(SERVICE_URL, "POST", BodyData);
                ResultType r = JsonConvert.DeserializeObject<ResultType>(retJSON);
                if (r.success)
                {
                    Label1.Text = String.Format("Success ({0})", r.rows.Count);
                    return r.rows;
                }
                
                return null;
                
            }
        }
        catch (WebException ex)
        {
            throw ex;
        }
    }

    public class ResultRowType
    {
        public string relcod { get; set; }
        public string reldes { get; set; }
        public string reldesc { get; set; }
        public int update_ident { get; set; }
    }

    public class ResultType
    {
        public string cmdText { get; set; }
        public bool success { get; set; }
        public List<ResultRowType> rows { get; set; }
    }
}

/*
   WebClient Class
   https://learn.microsoft.com/en-us/dotnet/api/system.net.webclient?view=net-7.0 
  
   What does "Content-type: application/json; charset=utf-8" really mean?
   https://stackoverflow.com/questions/9254891/what-does-content-type-application-json-charset-utf-8-really-mean      
*/
