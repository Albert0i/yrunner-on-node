## YRunner on Node ─ A generic API gateway to Oralce Database


### Prologue
Dating from my early days in learning [React](https://react.dev/), I was deeply impressed and fascinated by the delicacy of [Json Server](https://github.com/typicode/json-server) --- by utilizing a <em>dead simple</em> [JSON](https://www.w3schools.com/js/js_json_intro.asp) text file to mimic so as to completely mocks up a [REST](https://restfulapi.net/) server in such a way that it proves to be both convenient and indispensable to most of the front end developers today. 

Few years ago, I have created a small [C#](https://learn.microsoft.com/en-us/dotnet/csharp/) library, aka [YRunner](https://github.com/Albert0i/yrunner-on-node/blob/main/oic/YRunner.cs), to facilitate data manipulation on [Oracle Database](https://www.oracle.com/database/). It provides a handful of helpful functions upon which one of my [ASP.NET](https://dotnet.microsoft.com/en-us/apps/aspnet) 4.5 project is heavily depended. 

Not until recently, do i meet [node-oracledb](https://oracle.github.io/node-oracledb/), a strange sense of presentiment dawned upon me... Instead of a JSON file, is it possible to wrap up the whole relational database by some kind of [API Gateway](https://www.redhat.com/en/topics/api/what-does-an-api-gateway-do), so that [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) services are exposed. 


### I. Project setup 
1. Download [Oracle Instant Client](https://www.oracle.com/database/technologies/instant-client/winx64-64-downloads.html) binary files, as of this writing, `Basic Package` of `Version 19.18.0.0.0` is used;

2. Extract `instantclient-basic-windows.x64-19.18.0.0.0dbru.zip` to folder such as  `C:\app\client\albertoi\product\19.18\client_1\bin`; 

3. Add this folder to `PATH` environment variable;

4. Clone this [repository](https://github.com/Albert0i/yrunner-on-node.git), and run `npm install`;

5. Create a .env file 
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
1. Get all 
```
GET http://localhost:8989/api/v1/yr/tbrelcod
```

2. Get all with options
```
GET http://localhost:8989/api/v1/yr/tbrelcod?_filter=relcod>='20'&_sort=relcod&_order=asc&_offset=5&_limit=10&_lowerKeys=true&_norun=true
```
where 
- _filter     - condition 
- _sort       - sort by field
- _order      - asc or desc 
- _offset     - skip n rows  
- _limit      - take n rows 
- _lowerkeys  - lowercase object keys, default 'false'
- _norun      - do not run, default 'false'

Previous GET statement returns: 
```json
{
  "cmdText": "select * from tbrelcod where relcod>='20' order by relcod asc offset 5 rows fetch next 10 rows only "
}
```

3. Get one 
```
GET http://localhost:8989/api/v1/yr/tbrelcod/KK?_keyname=relcod&_keytype=string&_lowerKeys=true
```
where
- _keyname    - keyname, default 'id'
- _keytype    - keytype, default 'number' 
- _lowerkeys  - lowercase object keys, default 'false'

4. Create one
```
POST http://localhost:8989/api/v1/yr/tbrelcod
Content-Type: application/json

{ 
    "relcod" : "KK",
    "reldes" : "testing 1",
    "reldesc" : "測試一",
    "update_ident" : 0
}
```

5. Update one 
```
PATCH http://localhost:8989/api/v1/yr/tbrelcod/KK?_keyname=relcod&_keytype=string
Content-Type: application/json

{ 
    "reldes" : "testing 2",
    "reldesc" : "測試二",
    "update_ident" : 101 
}
```
where
- _keyname    - keyname, default 'id'
- _keytype    - keytype, default 'number' 

6. Delete one 
```
DELETE http://localhost:8989/api/v1/yr/tbrelcod/KK?_keyname=relcod&_keytype=string
Content-Type: application/json
```
where
- _keyname    - keyname, default 'id'
- _keytype    - keytype, default 'number' 


### III. YRunner Direct 

1. runSelectSQL
```
POST http://localhost:8989/api/v1/yr/runselectsql
Content-Type: application/json

{
  "cmdText": "select * from tbrelcod",
  "lowerKeys": true
}
```

2. runValueSQL
```
POST http://localhost:8989/api/v1/yr/runvaluesql
Content-Type: application/json

{
  "cmdText": "select update_ident from tbrelcod where relcod='KK'",
  "lowerKeys": true
}
```

3. runSQL
```
POST http://localhost:8989/api/v1/yr/runsql
Content-Type: application/json

{
  "cmdTexts": [
      "update tbrelcod set update_ident=update_ident+1 where relcod='KK'",
      "update tbrelcod set update_ident=update_ident+1 where relcod='KK'",
      "update tbrelcod set update_ident=update_ident+1 where relcod='KK'"
      ]
}
```

4. runInsertSQLYieldRowID
```
POST http://localhost:8989/api/v1/yr/runinsertsqlyieldrowid
Content-Type: application/json

{
  "cmdText": "insert into tausers(tunamec, tunamep) values('測試一', 'Test1')",
  "id": "tuid"
}
```


### IV. Summary 
By insulating applications and databases, an API gateway effectively decouples front end and back end so that one end varies independently of the other. Moreover, most front end frameworks and javascript libraries can not do without API endpoints.

Lastly, by dint of [WebClient Class](https://learn.microsoft.com/en-us/dotnet/api/system.net.webclient?view=net-7.0) and [Newtonsoft.Json](https://www.newtonsoft.com/json) package, classic ASP.NET application can work with with API gateway too. Please check [here](https://github.com/Albert0i/yrunner-on-node/blob/main/oic/WebClient1.aspx.cs) for an example. 


### V. Reference

1. [typicode/json-server](https://github.com/typicode/json-server)
2. [Introduction to the Node-oracledb Driver for Oracle Database](https://node-oracledb.readthedocs.io/en/latest/user_guide/introduction.html#getting-started-with-node-oracledb)
3. [Oracle Instant Client Downloads for Microsoft Windows (x64) 64-bit](https://www.oracle.com/database/technologies/instant-client/winx64-64-downloads.html)
4. [node-oracledb/examples](https://github.com/oracle/node-oracledb/tree/main/examples)
5. [The Mystery of Marie Rogêt](https://poemuseum.org/the-mystery-of-marie-roget/)


### Epilogue 
```
"The code"

From thence and whence, 
unto nowhere.
From look to code, 
from maze to face.
New codes deviate from old,
new looks resemble to those,
Re-write is after-life,
varying is invarient. 
```


### EOF (2023/04/20)
