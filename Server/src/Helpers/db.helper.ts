export const getMongoDbIP = (): string => {
  // Überprüfen, ob MONGO_DB_URL gesetzt ist
  const ip = process.env.MONGO_DB_IP;
  if (!ip) {
    throw new Error("MONGO_DB_IP is not defined in environment variables");
  }
  return ip;
};

export const getMongoDbPort = (): string => {
  // Überprüfen, ob MONGO_DB_PORT gesetzt ist
  const port = process.env.MONGO_DB_PORT;
  if (!port) {
    throw new Error("MONGO_DB_PORT is not defined in environment variables");
  }
  return port;
};
