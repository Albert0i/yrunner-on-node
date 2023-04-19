## YRunner on Node ─ A generic API gateway to Oralce Database


### Prologue
Dating from my early days in learning [React](https://react.dev/), I was deeply impressed and fascinated by the delicacy of [Json Server](https://github.com/typicode/json-server) --- by utilizing a <em>dead</em> simple [JSON](https://www.w3schools.com/js/js_json_intro.asp) text file to mimic so as to completely mocks up a [REST](https://restfulapi.net/) server in such a way that it proves to be both convenient and indispensable to most of the front-end developers today. 

Four years ago, I have created a small [C#](https://learn.microsoft.com/en-us/dotnet/csharp/) library, aka [YRunner](https://github.com/Albert0i/yrunner-on-node/blob/main/oic/YRunner.cs), to facilitate data manipulation on [Oracle Database](https://www.oracle.com/database/). It provides a handful of helpful functions upon which one of my [ASP.NET](https://dotnet.microsoft.com/en-us/apps/aspnet) 4.5 project is heavily depended. 

Not until recently, do i meet [node-oracledb](https://oracle.github.io/node-oracledb/), a strange sense of presentiment dawned upon me... Instead of a JSON file, is it possible to wrap up a relational database by some kind of [API Gateway](https://www.redhat.com/en/topics/api/what-does-an-api-gateway-do), through which RESTful services are provided. From then on, a hideous grin is divulged in the visage of my portrait. 


### I. Basic setup 
1. Download [Oracle Instant Client](https://www.oracle.com/database/technologies/instant-client/winx64-64-downloads.html) binaries, in my case, I choose `Basic Package` of `Version 19.18.0.0.0`;

2. Extract `instantclient-basic-windows.x64-19.18.0.0.0dbru.zip` to folder `C:\app\client\albertoi\product\19.18\client_1\bin`; 

3. Add this folder to `PATH` environment variable;

4. Clone the [repository](https://github.com/Albert0i/yrunner-on-node.git), run `npm install` to install node modules;

5. Create .env file 
```
SERVER_PORT=8989

NODE_ORACLEDB_USER=myuser
NODE_ORACLEDB_PASSWORD=mypwd
NODE_ORACLEDB_CONNECTIONSTRING=localhost/XEPDB1

PASSPHRASE=VEUdEii4n7nCvofaBRJEC
DELAY404=10000
```
6. Run `npm run dev` to start the gateway. 


### II. YRunner RESTful  


### III. YRunner Direct 


### IV. Summary 


### V. Reference

1. [typicode/json-server](https://github.com/typicode/json-server)
2. [Introduction to the Node-oracledb Driver for Oracle Database](https://node-oracledb.readthedocs.io/en/latest/user_guide/introduction.html#getting-started-with-node-oracledb)
3. [Oracle Instant Client Downloads for Microsoft Windows (x64) 64-bit](https://www.oracle.com/database/technologies/instant-client/winx64-64-downloads.html)
4. [node-oracledb/examples](https://github.com/oracle/node-oracledb/tree/main/examples)
5. [The Mystery of Marie Rogêt](https://poemuseum.org/the-mystery-of-marie-roget/)


### VI. Appendix 


### Epilogue 


### EOF (2023/04/19)
