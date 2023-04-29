const { openDb, runSelectSQL, runValueSQL, runSQL } = require("./srunner");

const db = openDb("./db.sqlite");
console.log(db);

const result1 = runSelectSQL("select * from cache");
console.log(result1);

const result2 = runValueSQL("select * from cache where tabname='table'");
console.log(result2);

const result3 = runSQL(
  "update cache set crtdate=crtdate+1 where tabname='table1';update cache set crtdate=crtdate+1 where tabname='table2';update cache set crtdate=crtdate+1 where tabname='table3';"
);
console.log(result3);

/*
   better-sqlite3
   https://www.npmjs.com/package/better-sqlite3

   create table cache (
        tabname char(40),
        crtdate numeric(8, 0),
        crttime numeric(6,0),
        primary key (tabname)
   );
   insert into cache values('table1', 1, 2);
   insert into cache values('table2', 3, 4);
   insert into cache values('table3', 5, 6);
   insert into cache values('table4', 7, 8);
   insert into cache values('table5', 9, 10);
*/
