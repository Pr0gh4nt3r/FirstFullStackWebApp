export const getMongoDBURL = (): string => {
  // Überprüfen, ob MONGO_DB_URL gesetzt ist
  const url = process.env.MONGO_DB_URL;
  if (!url) {
    throw new Error("MONGO_DB_URL is not defined in environment variables");
  }
  return url;
};

export const getMongoDBPort = (): string => {
  // Überprüfen, ob MONGO_DB_PORT gesetzt ist
  const port = process.env.MONGO_DB_PORT;
  if (!port) {
    throw new Error("MONGO_DB_PORT is not defined in environment variables");
  }
  return port;
};
