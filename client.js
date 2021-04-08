const { Socket } = require('net')

const readLine = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})
const END = 'END'
const error = (err) => {
    console.error(err);
    process.exit(1)
}

const connect = (host, port) => {
    const socket = new Socket();
    console.log(`Connecting to ${host}:${port}`);
    socket.connect({ host, port })
    socket.on('connect', () => {
        console.log('Connected');
        readLine.question('Choose your username: ', (username) => {
            socket.write(username);
            console.log(`Type any message to send it, type ${END} to finish`);
        })
    })
    socket.setEncoding('utf-8')
    readLine.on('line', (line) => {
        socket.write(line)
        if (line == END) {
            socket.write(line)
            socket.end()
            console.log('Disconnected');
        }

    })

    socket.on('data', (data) => {
        console.log(data);
    })
    socket.on('close', () => {
        process.exit(0)
    })
    socket.on('error', (err) => error(err.message))
}
const main = () => {
    if (process.argv.length !== 4) {
        error()
    }
    let [, , host, port] = process.argv
    if (isNaN(port)) {
        error(`Invalid port ${port}`)
    }
    port = Number(port)
    console.log(`${host}:${port}`);
    connect(host, port)
}
if (require.main === module) {
    main()
}