import http from 'http'
import { URL } from 'url'
import * as fixtures from './fixtures'

const host = 'localhost'
const port = 8000



// const requestListener = function (req: http.IncomingMessage, res: http.ServerResponse) {
//   res.setHeader('Content-Type', 'application/json')
//   const url = new URL(req.url)


//   switch (url.pathname) {
//     case '/api/v1/users':
//       switch (req.method) {
//         case 'GET':
//           res.writeHead(200)
//           res.end(JSON.stringify())

//           break;
//         default:
//           break;
//       }

//       break
//     case '/authors':
//       res.writeHead(200)
//       res.end('')
//       break
//     default:
//       res.writeHead(404);
//       console.log(req.url)
//       res.end(JSON.stringify({ error: "Resource not found" }));
//   }
// }

// const server = http.createServer(requestListener)


// server.listen(port, host, () => {
//   console.log(`Server is running on http://${host}:${port}`)
// })
