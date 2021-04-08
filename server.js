const { Server } = require("net")
const server = new Server();
const connections = new Map()
const host = 'localhost'
const sendMessage = (message, origin) => {
    for (const socket of connections.keys()) {
        if (socket !== origin) {
            socket.write(message)
        }
    }
}

const listen = (port) => {
    server.on('connection', (socket) => {
        const clientSocket = `${socket.remoteAddress}:${socket.remotePort}`
        console.log("New connection from", clientSocket);
        socket.setEncoding('utf-8')//Para decodificar de binario
        socket.on('data', (data) => {
            if (!connections.has(socket)) {
                console.log(`Registered client: ${clientSocket}`);
                connections.set(socket, data)
            }
            if (data == 'END') {
                socket.end()
            } else {
                const fullMessage = `[${connections.get(socket)}]: ${data}`
                console.log(`${clientSocket}-> ${fullMessage}`);
                sendMessage(fullMessage, socket)
            }
        })
        socket.on('close', () => {
            console.log(`Connection with ${clientSocket} is closed`);
            connections.delete(socket)
        })
    })
    server.listen({ port, host }, () => {
        console.log('Listening on port 7777');
    })
}

const main = () => {
    if (process.argv.length !== 3) {
        error(`Usage: node ${__filename} port`)
    }
    let port = process.argv[2]
    if (isNaN(port)) {
        error(`Invalid port ${port}`)
    }
    listen(port)
}

if (require.main === module) {
    main()
}