import sql from 'mssql'
import dotenv from 'dotenv'

dotenv.config()

const user = process.env.DB_USER!;
const password = process.env.DB_PASS!;
const server = process.env.DB_SERVER!;
const database = process.env.DB_DATABASE!;

const config: sql.config = {
    user,
    password,
    server,
    database,
    port: 26335,
    options: {
      encrypt: false,
      trustServerCertificate: true,       
    },
  };

export const poolPromise: Promise<sql.ConnectionPool> = new sql.ConnectionPool(config)
    .connect()
    .then((pool) => {
        console.log('Connected to DB');
        return pool;
    })
    .catch((err) => {
        console.error("Database connection failed: ", err);
        process.exit(1);
    });

export const select = async <T>(queryText: string, params?: Record<string, any>): Promise<T[]> => {
    try{
        const pool: sql.ConnectionPool = await poolPromise;
        const request: sql.Request = pool.request();

        if(params) {
            for (const key in params) {
                request.input(key, params[key]);
            }
        }

        const result: sql.IResult<any> = await request.query(queryText);
        return result.recordset;
    } catch (err) {
        console.error("Query failed: ", err);
        throw err;
    }
};

export const create = async (queryText: string, params?: Record<string, any>): Promise<number> => {
    try {
        const pool: sql.ConnectionPool = await poolPromise;
        const request: sql.Request = pool.request();

        if (params) {
            for (const key in params) {
              request.input(key, params[key]);
            }
        }
      
        const result: sql.IResult<any> = await request.query(queryText);
        return result.rowsAffected[0]; 
    } catch (err) {
        console.error('Query failed:', err);
        throw err;
    }  
};

export const createAndReturn = async <T>(queryText: string, params?: Record<string, any>): Promise<T[]> => {
    try{
        const pool: sql.ConnectionPool = await poolPromise;
        const request: sql.Request = pool.request();

        if (params) {
            for (const key in params) {
                request.input(key, params[key]);
            }
        }
        const result: sql.IResult<any> = await request.query(queryText);
        return result.recordset;
    } catch(err){
        console.error('Query failed:', err);
        throw err;
    }
};

export const update = async (queryText: string, params?: Record<string, any>): Promise<number> => {
    try {
      const pool: sql.ConnectionPool = await poolPromise;
      const request: sql.Request = pool.request();
  
      if (params) {
        for (const key in params) {
          request.input(key, params[key]);
        }
      }
  
      const result: sql.IResult<any> = await request.query(queryText);
      return result.rowsAffected[0];
    } catch (err) {
      console.error('Query failed:', err);
      throw err;
    }
  };
  
export const remove = async (queryText: string, params?: Record<string, any>): Promise<number> => {
    try {
        const pool: sql.ConnectionPool = await poolPromise;
        const request: sql.Request = pool.request();

        if (params) {
            for (const key in params) {
                request.input(key, params[key]);
            }
        }

        const result: sql.IResult<any> = await request.query(queryText);
        return result.rowsAffected[0];
    } catch (err) {
        console.error('Query failed:', err);
        throw err;
    }
};