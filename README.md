## YRunner on Node ─ A generic API gateway to Oralce Database

### Prologue

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
