/*
 * YRunner.cs - An ADO.NET SQL helper for Oracle.                              
 *                                                                             
 * Version 1.0                                                                 
 * Designed by Alberto on 2019/02/08 己亥初四                                   
 *                                                                             
 * This library is free software; you can redistribute it and/or modify it     
 * under the terms of the GNU Lesser General Public License as published by    
 * the Free Software Foundation; either version 2 of the License, or (at your  
 * option) any later version.                                                  
 *                                                                             
 * This library is distributed in the hope that it will be useful, but WITHOUT 
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or       
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public        
 * License for more details.                                                   
 */
using System;
using Oracle.ManagedDataAccess.Client;
using System.Web.Configuration;
using System.Data;
using System.Diagnostics;
using System.Web;
using System.Configuration;

namespace YRSample.DAL
{
    public partial class YRunner : IDisposable
    {
        private OracleConnection connOra;
        private OracleTransaction tranOra;
        private OracleCommand cmdOra;
        private int pendingTrans;

        public string message;

        #region SQL 
        /// <summary>
        /// Run SQL Statements
        /// </summary>
        /// <param name="cmdText"></param>
        /// <returns></returns>
        public bool RunSQL(string cmdText)
        {
            string[] cmdArray;
            string cmdStr;
            int rows_affected = 0;
            bool ret = true;

            ret = CheckCmdText(cmdText);

            if (ret)
            {
                cmdArray = cmdText.Split(new[] { ";" }, StringSplitOptions.None);
                for (int i = 0; i <= cmdArray.Length - 1; i++)
                {
                    // Empty command 
                    cmdStr = cmdArray[i].Trim();
                    if (cmdStr == "")
                        continue;
                    // Non-empty command
                    Debug.WriteLine("YRunner.RunSQL: " + cmdStr);
                    cmdOra.CommandText = cmdStr;
                    try
                    {
                        rows_affected = cmdOra.ExecuteNonQuery();
                        Debug.WriteLine(String.Format("YRunner.RunSQL.rows_affected: {0}", rows_affected));

                        // Increase pending transaction by 1 
                        pendingTrans++;
                    }
                    catch (OracleException ex)
                    {
                        message = message + ">An error has occurred while running SQL statement (YRunner.RunSQL).<br />";
                        message = message + ">" + ex.Message + "<br />";
                        message = message + ">" + ex.Source + "<br />";
                        message = message + ">SQL statement: " + cmdStr + "<br />";
                        ret = false;
                        break;
                    }
                }
            }
            else
                message = ">An error has occurred while checking SQL statement (YRunner.RunSQL).<br />" + message;

            Debug.WriteLine(String.Format("YRunner.RunSQL.message: {0}", message));
            Debug.WriteLine(String.Format("YRunner.RunSQL: {0} transaction{1} pending.", pendingTrans, (pendingTrans==1 ? "" : "s")));
            return ret;
        }

        /// <summary>
        /// Run SQL Statement and return a value 
        /// </summary>
        /// <param name="cmdText"></param>
        /// <returns></returns>
        public object RunValueSQL(string cmdText)
        {
            object ret;

            Debug.WriteLine("YRunner.RunValueSQL: " + cmdText);
            cmdOra.CommandText = cmdText;
            ret = cmdOra.ExecuteScalar();

            return ret;
        }

        /// <summary>
        /// Run SQL Statement and return a data table 
        /// </summary>
        /// <param name="cmdText"></param>
        /// <param name="cmdbehavior"></param>
        /// <returns></returns>
        public DataTable RunSelectSQL(string cmdText, CommandBehavior cmdbehavior = CommandBehavior.Default)
        {
            DataTable ret = new DataTable();

            Debug.WriteLine("YRunner.RunSelectSQL: " + cmdText);
            cmdOra.CommandText = cmdText;
            ret.Load(cmdOra.ExecuteReader(cmdbehavior));

            return ret;
        }

        // Begin add (2021/02/05)
        // How to get the generated id from an inserted row using ExecuteScalar?
        // https://stackoverflow.com/questions/1336911/how-to-get-the-generated-id-from-an-inserted-row-using-executescalar
        /// <summary>
        /// Run SQL Insert Statement and return the auto increment row id
        /// </summary>
        /// <param name="cmdText"></param>
        /// <param name="rowid_name"></param>
        /// <returns>non-zero integer on success; -1 on failure.</returns>
        public int RunInsertSQLYieldRowID(string cmdText, string rowid_name = "id")
        {
            int row_id = 0;
            int rows_affected = 0;            
            string sql_stub = " returning {0} into :temp_id";
            OracleParameter outputParameter = new OracleParameter("temp_id", OracleDbType.Decimal);
            outputParameter.Direction = ParameterDirection.Output;

            cmdOra.CommandText = cmdText + String.Format(sql_stub, rowid_name);
            Debug.WriteLine("YRunner.RunInsertSQLYieldRowID: " + cmdOra.CommandText);
            cmdOra.Parameters.Add(outputParameter);
            try
            {
                rows_affected = cmdOra.ExecuteNonQuery();
                Debug.WriteLine(String.Format("YRunner.RunInsertSQLYieldRowID.rows_affected: {0}", rows_affected));
                row_id = Int32.Parse(outputParameter.Value.ToString());
                cmdOra.Parameters.Remove(outputParameter);

                // Increase pending transaction by 1 
                pendingTrans++;
            }
            catch (OracleException ex)
            {
                message = message + ">An error has occurred while running SQL statement (YRunner.RunInsertSQLYieldRowID).<br />";
                message = message + ">" + ex.Message + "<br />";
                message = message + ">" + ex.Source + "<br />";
                message = message + ">SQL statement: " + cmdOra.CommandText + "<br />";
                row_id = -1;
            }

            return row_id; 
        }
        // End add (2021/02/05)

        public void Commit()
        {
            Debug.WriteLine(String.Format("YRunner.Commit: {0} transaction{1} will be committed.", pendingTrans, (pendingTrans == 1 ? "" : "s")));
            tranOra.Commit();

            // Start a local transaction
            tranOra = connOra.BeginTransaction(System.Data.IsolationLevel.ReadCommitted);
            // Assign transaction object for a pending local transaction
            cmdOra.Transaction = tranOra;

            // Set pending transaction to zero
            pendingTrans = 0;
        }

        public void Rollback()
        {
            Debug.WriteLine(String.Format("YRunner.Rollback: {0} transaction{1} will be rollbacked.", pendingTrans, (pendingTrans == 1 ? "" : "s")));
            tranOra.Rollback();

            // Start a local transaction
            tranOra = connOra.BeginTransaction(System.Data.IsolationLevel.ReadCommitted);
            // Assign transaction object for a pending local transaction
            cmdOra.Transaction = tranOra;

            // Set pending transaction to zero
            pendingTrans = 0;
        }
        #endregion

        #region Initialization and cleanup
        public YRunner(string connStrOra, int timeOut = 300)
        {
            Debug.WriteLine(String.Format("YRunner.YRunner(\"{0}\")", connStrOra));

            try
            {
                // Oracle​Connection.​Begin​Transaction Method 
                // https://docs.microsoft.com/en-us/dotnet/api/system.data.oracleclient.oracleconnection.begintransaction?view=netframework-4.7.2
                connOra = new OracleConnection(WebConfigurationManager.ConnectionStrings[connStrOra].ConnectionString);
                connOra.Open();
                cmdOra = connOra.CreateCommand();

                // Start a local transaction
                tranOra = connOra.BeginTransaction(System.Data.IsolationLevel.ReadCommitted);
                // Assign transaction object for a pending local transaction
                cmdOra.Transaction = tranOra;

                // Set pending transaction to zero
                pendingTrans = 0;

            }
            //catch (OracleInternal.Network.NetworkException e)
            //{
            //    // ORA-12520: TNS:listener could not find available handler for registered type of server
            //}
            //catch (Oracle.ManagedDataAccess.Client.OracleException e)
            //{
            //    // Pooled connection request timed out 
            //}
            //catch (Oracle.DataAccess.Client.OracleException e)
            //{
            //    // Oracle.DataAccess.Client.OracleException: ORA-03114: 未與 ORACLE 相連
            //}
            //catch (System.NullReferenceException)
            //{
            //    // Object reference not set to an instance of an object.
            //}
#pragma warning disable CS0168
            catch (Exception e)
#pragma warning restore CS0168
            {
                Debug.WriteLine(ConfigurationManager.AppSettings["YR_MASK_MSG"]);
                Debug.WriteLine(e.ToString());

                if (Convert.ToBoolean(ConfigurationManager.AppSettings["YR_MASK_FLAG"]))
                {
                    Http​Context.Current.Response.Redirect(String.Format(ConfigurationManager.AppSettings["YR_REDIRECT_URL"],                                                                         
                                                                        ConfigurationManager.AppSettings["YR_MASK_MSG"].ToString()) +                                                                                                                                                  
                                                                        HttpContext.Current.Server.UrlEncode(Environment.NewLine + 
                                                                                                             Environment.NewLine + 
                                                                                                             e.ToString()));
                }
                else
                {
                    // 💀「死亡，也許沒有你想像的那樣可怕‧‧‧」
                    throw e; 
                }
            }
        }

        public void Dispose()
        {
            Debug.WriteLine(String.Format("YRunner.Dispose()"));
            Debug.WriteLine(String.Format("YRunner: {0} transaction{1} pending.", pendingTrans, (pendingTrans == 1 ? "" : "s")));
            connOra.Close();
            connOra.Dispose();
        }
        #endregion

        #region Helper functions
        protected bool CheckCmdText(String cmdText)
        {
            string[] cmdArray;
            string cmdStr;
            bool ret = true;

            message = "";
            // VB: cmdArray = String.Split(cmdText, ";");
            cmdArray = cmdText.Split(new[] { ";" }, StringSplitOptions.None);
            for (int i = 0; i <= cmdArray.Length - 1; i++)
            {
                // Omit empty command. 
                cmdStr = cmdArray[i].Trim();
                if (cmdStr == "")
                    continue;
                else
                {
                    // Only allow 'insert', 'update' and 'delete'; 
                    // 'update' and 'delete' must have 'where' clause. 
                    // VB: switch (Strings.Split(cmdStr)(0).ToLower())
                    switch (cmdStr.Split(new[] { " " }, StringSplitOptions.None)[0].ToLower())
                    {
                        case "insert":
                            break;
                        case "update":
                            if ((cmdStr.ToLower().Contains("where")))
                                continue;
                            else
                            {
                                message += ("Command no." + (i + 1) + ": Update missing where clause.<br />");
                                ret = false;
                            }
                            break;
                        case "delete":
                            if ((cmdStr.ToLower().Contains("where")))
                                continue;
                            else
                            {
                                message += ("Command no." + (i + 1) + ": Delete missing where clause.<br />");
                                ret = false;
                            }
                            break;
                        default:
                            message += ("Command no." + (i + 1) + ": Only insert, update and delete are allowed.<br />");
                            ret = false;
                            break;
                    }
                }
            }
            return ret;
        }

        /// <summary>
        /// Convert a data table column to string 
        /// </summary>
        /// <param name="dt"></param>
        /// <param name="index"></param>
        /// <param name="delimiter"></param>
        /// <returns></returns>
        public string DataTableToString(DataTable dt, int index = 0, string delimiter = ", ")
        {
            string ret = "";

            if ((index < 0) | (index >= dt.Columns.Count))
                index = 0;
            // 
            foreach (DataRow r in dt.Rows)
            {
                if ((ret != ""))
                    ret = ret + delimiter;
                ret = ret + r[index].ToString().Trim();
            }
            return ret;
        }

        //protected string escQuote(string s)
        //{
        //    return s.Replace("'", "''");
        //}
        protected string escQuote(string s)
        {
            if (s == "")
                return " ";
            else
                return s.Replace("'", "''");
        }
        #endregion
    }
}

/*

                 uuuuuuu
             uu$$$$$$$$$$$uu
          uu$$$$$$$$$$$$$$$$$uu
         u$$$$$$$$$$$$$$$$$$$$$u
        u$$$$$$$$$$$$$$$$$$$$$$$u
       u$$$$$$$$$$$$$$$$$$$$$$$$$u
       u$$$$$$$$$$$$$$$$$$$$$$$$$u
       u$$$$$$"   "$$$"   "$$$$$$u
       "$$$$"      u$u       $$$$"
        $$$u       u$u       u$$$
        $$$u      u$$$u      u$$$
         "$$$$uu$$$   $$$uu$$$$"
          "$$$$$$$"   "$$$$$$$"
            u$$$$$$$u$$$$$$$u
             u$"$"$"$"$"$"$u
  uuu        $$u$ $ $ $ $u$$       uuu
 u$$$$        $$$$$u$u$u$$$       u$$$$
  $$$$$uu      "$$$$$$$$$"     uu$$$$$$
u$$$$$$$$$$$uu    """""    uuuu$$$$$$$$$$
$$$$"""$$$$$$$$$$uuu   uu$$$$$$$$$"""$$$"
 """      ""$$$$$$$$$$$uu ""$"""
           uuuu ""$$$$$$$$$$uuu
  u$$$uuu$$$$$$$$$uu ""$$$$$$$$$$$uuu$$$

ASCII art for tag skull
https://textart.io/art/tag/skull/3


░▒▒ 💀 ▒▒░
Cool text art to use on your socials (>‿◠)✌
https://cooltext.top/skull
*/
