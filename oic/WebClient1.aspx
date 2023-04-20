<%@ Page Language="C#" AutoEventWireup="true" CodeFile="WebClient1.aspx.cs" Inherits="WebClient1" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>WebClient 1</title>
</head>
<body>
    <h3>WebClient 1</h3>
    <form id="form1" runat="server">
    <div>
        <asp:RadioButtonList ID="RadioButtonList1" runat="server">
            <asp:ListItem Value="S">SQL Datasource</asp:ListItem>
            <asp:ListItem Value="R" Selected="True">YRunner RESTful</asp:ListItem>
            <asp:ListItem Value="D">YRunner Direct</asp:ListItem>
        </asp:RadioButtonList>
        <div>
            <asp:Button ID="Button1" runat="server" Text="Invoke" OnClick="Button1_Click" />
        </div>
        <div>
            <asp:Label ID="Label1" runat="server" Text="" style="font:bolder; color: maroon"></asp:Label>
        </div>
                
        <hr />
        <asp:GridView ID="GridView1" runat="server" AutoGenerateColumns="False" CellPadding="4" DataKeyNames="RELCOD" ForeColor="#333333" GridLines="None">
            <AlternatingRowStyle BackColor="White" ForeColor="#284775" />
            <Columns>
                <asp:BoundField DataField="RELCOD" HeaderText="RELCOD" ReadOnly="True" SortExpression="RELCOD" />
                <asp:BoundField DataField="RELDES" HeaderText="RELDES" SortExpression="RELDES" />
                <asp:BoundField DataField="RELDESC" HeaderText="RELDESC" SortExpression="PHYDESC" />
                <asp:BoundField DataField="UPDATE_IDENT" HeaderText="UPDATE_IDENT" SortExpression="UPDATE_IDENT" />
            </Columns>
            <EditRowStyle BackColor="#999999" />
            <FooterStyle BackColor="#5D7B9D" Font-Bold="True" ForeColor="White" />
            <HeaderStyle BackColor="#5D7B9D" Font-Bold="True" ForeColor="White" />
            <PagerStyle BackColor="#284775" ForeColor="White" HorizontalAlign="Center" />
            <RowStyle BackColor="#F7F6F3" ForeColor="#333333" />
            <SelectedRowStyle BackColor="#E2DED6" Font-Bold="True" ForeColor="#333333" />
            <SortedAscendingCellStyle BackColor="#E9E7E2" />
            <SortedAscendingHeaderStyle BackColor="#506C8C" />
            <SortedDescendingCellStyle BackColor="#FFFDF8" />
            <SortedDescendingHeaderStyle BackColor="#6F8DAE" />
        </asp:GridView>
        <asp:SqlDataSource ID="SqlDataSource1" runat="server" ConnectionString="<%$ ConnectionStrings:ORACLE %>" ProviderName="<%$ ConnectionStrings:ORACLE.ProviderName %>" SelectCommand="select * from tbrelcod order by relcod asc "></asp:SqlDataSource>
    </div>
    </form>
</body>
</html>
