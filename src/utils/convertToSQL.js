const { runSelectSQL } = require('../yrunner')

const convertToSQL = (table, schema) => {
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

module.exports = { convertToSQL } 