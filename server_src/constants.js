module.exports = {
  sessionNameDuplicateError: "session name is duplicated",
  success: "success",
  error: "error",

  postgreInfo: {
    user: process.env.POSTGRE_USER,
    password: process.env.POSTGRE_PASS,
    host: process.env.POSTGRE_HOST,
    port: process.env.POSTGRE_PORT,
    database: process.env.POSTGRE_DB_NAME,
  },
  appURL: "http://localhost:8080",
};
