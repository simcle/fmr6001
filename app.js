import express, { json } from 'express';
import cors from 'cors'
import { listAvailableSerialPorts } from './serialScanner.js';
import { connect } from './controller.js';
const app = express()
app.use(cors())
app.use(express.json())

// list port
app.get('/available-ports', async (req, res) => {
    try {
        const ports = await listAvailableSerialPorts()
        res.status(200).json(ports)
    } catch (error) {
        res.status(400).send(error)
    }
})

app.post('/connect', async (req, res) => {
    const payload = req.body
    try {
        const info = await connect(payload)
    
        res.status(200).json(info)
    } catch (error) {
        res.status(400).send(error)
    }
})

const PORT = 3000;
app.listen(PORT, () => console.log('Aplikasi sedang berjalan pada PORT:' +PORT))