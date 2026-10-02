import * as mariadb from "mariadb";

const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "travelplannerai",
  connectionLimit: 10,
  idleTimeout: 60,
});

export const db = {
  query: async (text, params) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const res = await conn.query(text, params);
      return res;
    } finally {
      if (conn) conn.release();
    }
  }
};
