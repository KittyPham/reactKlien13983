const jsonServer = require("json-server");
const path = require("path");
const fs = require("fs");

const createDbObject = () => {
  const dbDir = path.resolve(__dirname, "..", "db");
  const outputDb = {};
  try {
    const files = fs.readdirSync(dbDir);
    files.forEach((file) => {
      if (file.endsWith(".json")) {
        const filePath = path.join(dbDir, file);
        const key = path.basename(file, ".json"); // Ini sudah benar
        const content = fs.readFileSync(filePath, "utf-8");
        outputDb[key] = JSON.parse(content);
      }
    });
  } catch (error) {
    console.error("Gagal membaca direktori 'db':", error);
  }
  return outputDb;
};

const server = jsonServer.create();
const router = jsonServer.router(createDbObject());
const middlewares = jsonServer.defaults();
server.use(middlewares);
server.use(router);
module.exports = server;
