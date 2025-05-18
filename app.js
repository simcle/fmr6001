import express, { json } from 'express';
import cors from 'cors'
import PQueue from 'p-queue';
import { listAvailableSerialPorts } from './serialScanner.js';
import { connect, getValue, getDeviceInfo, disconnected, settingDevice, factoryReset, commandLerning } from './controller.js';

const queue = new PQueue({concurrency: 1})
const app = express()
app.use(cors())
app.use(express.json())

// list port
app.get('/available-ports', async (req, res) => {
    try {
        await queue.add(async() => {
            const ports = await listAvailableSerialPorts()
            res.status(200).json(ports)
        })
    } catch (error) {
        res.status(400).send(error)
    }
})

app.post('/connect', async (req, res) => {
    const payload = req.body
    try {
        await queue.add(async () => {
            const info = await connect(payload)
            res.status(200).json(info)
        })
    } catch (error) {
        res.status(400).send(error)
    }
})

app.get('/get-value', async (req, res) => {
    try {
        await queue.add(async () => {
            const data = await getValue()
            res.status(200).json(data)
        })
    } catch (error) {
        res.status(400).send(error)
    }
})
app.get('/get-info', async (req, res) => {
    try {
        await queue.add(async () => {
            const data = await getDeviceInfo()
            res.status(200).json(data)
        })
    } catch (error) {
        res.status(400).send(error)
    }
})
app.post('/settings', async (req, res) => {
    try {
        await queue.add(async () => {
            const payload = req.body
            const data = await settingDevice(payload)
            res.status(200).json(data)
        })
    } catch (error) {
        res.status(400).send(error)
    }
})

app.post('/command-learning', async (req, res) => {
    try {
        await queue.add(async () => {
            const payload = req.body.data
            const data = await commandLerning(payload)
            res.status(200).json(data)
        })

    } catch (error) {
        res.status(400).send(error)
    }
})

app.post('/factory-reset', async (req, res) => {
    try {
        await queue.add(async() => {
            const data = await factoryReset()
            res.status(200).json(data)
        })
    } catch (error) {
        res.status(400).send(error)
    }
})

app.post('/disconnect', async (req, res) => {
    try {
        await queue.add(async() => {
            const data = await disconnected()
            res.status(200).json(data)
        })
    } catch (error) {
        console.log(error)
    }
})
const PORT = 3000;
app.listen(PORT, () => console.log('Aplikasi sedang berjalan pada PORT:' +PORT))