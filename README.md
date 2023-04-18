## YRunner on Node ─ A generic API gateway to Oralce Database

### Prologue
Dating from my early days of learning [React](https://react.dev/), I was deeply impressed and fascinated by [Json Server](https://github.com/typicode/json-server). The idea of utilizing a <em>dead</em> simple [JSON](https://www.w3schools.com/js/js_json_intro.asp) text file to mimic so as to completely mocks up a [REST](https://restfulapi.net/) server, in such a way that it proves to be both convenient and indispensable to most of the front-end developers today. 

Four years ago, I have created a small C# library, aka [YRunner](https://github.com/Albert0i/yrunner-on-node/blob/main/oic/YRunner.cs), to facilitate the data manipulation on [Oracle Database](https://www.oracle.com/database/). It provides a handful of helpful methods on which one of my ASP.NET 4.5 project is heavy depended on it. 

Not until recently, do i meet [node-oracledb](https://oracle.github.io/node-oracledb/), a presentiment of faint sparkle of triumphant dawn upon me. 

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


### II. YRunner Direct  


### III. YRunner RESTful 


### IV. Summary 


### V. Reference

1. [typicode/json-server](https://github.com/typicode/json-server)
2. [Introduction to the Node-oracledb Driver for Oracle Database](https://node-oracledb.readthedocs.io/en/latest/user_guide/introduction.html#getting-started-with-node-oracledb)
3. [Oracle Instant Client Downloads for Microsoft Windows (x64) 64-bit](https://www.oracle.com/database/technologies/instant-client/winx64-64-downloads.html)
4. [node-oracledb/examples](https://github.com/oracle/node-oracledb/tree/main/examples)
5. [The Mystery of Marie Rogêt](https://poemuseum.org/the-mystery-of-marie-roget/)


### VI. Appendix 


### Epilogue 


### EOF (2023/04/18)
