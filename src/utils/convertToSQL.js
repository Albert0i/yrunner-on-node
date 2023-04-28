const convertToCreateSQL = (table, schema) => {
    let sql = ''
    let line = ''
    let primaryKeys = ''

    if (schema.length===0)
        return '';
    else {        
        for (i=0; i< schema.length; i++)
        {
            if (sql !=='') sql += ', '
            switch(schema[i].data_type) {
                case 'CHAR':
                case 'VARCHAR':
                case 'VARCHAR2':                  
                    line = `${schema[i].column_name} CHAR(${schema[i].data_length})`
                    break;
                case 'NUMBER':  
                    line = `${schema[i].column_name} DECIMAL(${schema[i].data_precision}, ${schema[i].data_scale})` 
                    break;
                default:
                  // code block
            }
            if (schema[i].position) 
            {
                if (primaryKeys !== '')
                    primaryKeys += ', ';
                primaryKeys += schema[i].column_name
            }
            sql += line 
        }
        if (primaryKeys !== '')
            line = `, PRIMARY KEY(${primaryKeys})`;
        sql = `CREATE TABLE ${table.toUpperCase()} ( ${sql}${line} ); `
        
        return sql 
    }
}

const convertToInsertSQL = (table, rows) => {
    let sql = ''
    let fields = ''
    let values = ''
    let quote =''

    if (rows.length===0)
        return '';
    else {        
        for (i=0; i< rows.length; i++)
        {
            if (sql !=='') sql += '; '            
            fields = ''
            values = '';
            for (const [key, value] of Object.entries(rows[i])) {
                //console.log(`${key}: ${typeof value} ${value} `);
                quote = (typeof value)==='string' ? "'" : "" 
                if (fields !== '') fields += ', '
                fields += key 
                if (values !== '') values += ', '
                values += quote + value + quote 
            }            
            sql += `insert into ${table} (${fields}) values(${values})`
        }

        return sql 
    }
}

module.exports = { convertToCreateSQL, convertToInsertSQL } 

/*
   Object.entries()
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
*/