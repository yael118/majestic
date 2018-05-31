const WS = require('ws');

let connection: Promise<Connection>;

interface Connection {
  on: (event: string, cb: (message: any) => void) => void;
  send: (event: string, payload: any) => void;
}

export function getConnection() {
  if (connection) {
    return connection;
  }
  connection = initializeConnection();
  return connection;
}

function initializeConnection() {
  return new Promise<Connection>((resolve, reject) => {
    const wss = new WS.Server({ port: 7777 });
    wss.on('connection', (ws: any) => {
      ws.on('message', (message: any) => {
        wss.clients.forEach((client: any) => {
          if (client !== ws && client.readyState === WS.OPEN) {
            client.send(message);
          }
        });
      });

      resolve(ws);
    });
  });
}