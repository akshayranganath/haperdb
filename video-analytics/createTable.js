require('dotenv').config();
const axios = require('axios');

const harperDBConfig = {
    url: process.env.HARPERDB_URL,
    username: process.env.HARPERDB_USERNAME,
    password: process.env.HARPERDB_PASSWORD,
    schema: process.env.HARPERDB_SCHEMA || 'analytics',
    table: process.env.HARPERDB_TABLE || 'events'
  };

const harperdb = axios.create({
    baseURL: harperDBConfig.url,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + Buffer.from( harperDBConfig.username+ ':' + harperDBConfig.password).toString('base64')
    }
  });

// Function to create a schema and table
async function createSchemaAndTable() {
    try {
      // Create a schema
      const schemaResponse = await harperdb.post('', {
        operation: 'create_schema',
        schema: harperDBConfig.schema
      });
      console.log('Schema created:', schemaResponse.data);
      
      // Create a table
      const tableResponse = await harperdb.post('', {
        operation: 'create_table',
        schema: harperDBConfig.schema,
        table: harperDBConfig.table,
        hash_attribute: 'id'
      });
      console.log('Table created:', tableResponse.data);
      
      return true;
    } catch (error) {
      //console.error('Error creating schema or table:', error.response?.data || error.message);
      console.error(JSON.stringify(error, null, null, 2));
      // If the error is because the schema/table already exists, we'll continue
      return true;
    }
  }

createSchemaAndTable().then(() => {
    console.log('Schema and table creation process completed.');
  }
).catch((error) => {
    //
  });