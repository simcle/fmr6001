import ModbusService from "./services.js"
let modbus 

export const connect = async (payload) => {
    const { trasport, port, baudarate, ip, tcpPort, } = payload
    modbus = new ModbusService({transport: trasport, port: port, baudRate: baudarate, ip: ip, tcpPort: tcpPort})
    try {
        await modbus.connect()
        modbus.client.setID(1)
        return 'OK'
    } catch (error) {
        throw error
    }
}

export const getValue = async () => {
    const register = [
        { title: 'Average Flow Rate', name: 'avgFlow', fc: '04', addr: 43535, count: 2, type: 'float', unit: 'm/s' },
        { title: 'Real-time Flow Rate', name: 'realtimeFlow', fc: '04', addr: 43537, count: 2, type: 'float', unit: 'm/s' },
        { title: 'Instantaneous Traffic', name: 'instantTraffic', fc: '04', addr: 43541, count: 2, type: 'float', unit: 'm³/s' },
        { title: 'Cumulative Traffic', name: 'totalTraffic',fc: '04', addr: 43557, count: 2, type: 'float', unit: 'm³' },
        { title: 'Water Level', name: 'level', fc: '04', addr: 43555, count: 2, type: 'float', unit: 'm' },
        { title: 'Angle', name: 'angle', fc: '04', addr: 43554, count: 1, type: 'int16/100', unit: '°' },
        { title: 'Temperature', name: 'temperature', fc: '04', addr: 43521, count: 1, type: 'int16/100', unit: '°C' },
        { title: 'Echo Amplitude', name: 'echoApmlitude', fc: '04', addr: 43531, count: 1, type: 'int16', unit: 'dB'},
        { title: 'Alarm Information', name: 'alarmRes', fc: '04', addr: 43528, count: 1, type: 'int16', unit: ''},
        { title: 'Record High Temperature', name: 'highTemp', fc: '04', addr: 51716, count: 1, type: 'int16/100', unit: '°C'},
        { title: 'Record Low Temperature', name: 'lowTemp', fc: '04', addr: 51717, count: 1, type: 'int16/100', unit: '°C'},
        { title: 'Highest Historical Measurement', name: 'highHis', fc: '04', addr: 51718, count: 2, type: 'float', unit: 'm/s'},
        { title: 'Lowest Historical Measurement', name: 'lowHis', fc: '04', addr: 51720, count: 2, type: 'float', unit: 'm/s'},
    ]
    const result = []
    for(const reg of register) {
        const res = await modbus.client.readInputRegisters(reg.addr, reg.count)
        let value;
        if(reg.type == 'float') {
            const buf = Buffer.alloc(4)
            buf.writeUint16BE(res.data[1], 0)
            buf.writeUint16BE(res.data[0], 2)
            value = buf.readFloatBE(0).toFixed(2)
        } else if (reg.type == 'int16/100') {
            value = res.data[0] / 100 
        } else {
            value = res.data[0]
        }
        result.push({name: reg.name, value: value, unit: reg.unit})
    }
    return result
}

export const getDeviceInfo = async () => {
    const register = [
        {name: 'slaveID', fc: '03', addr: 49153, count: 1, type: 'Int16', unit: ''},
        {name: 'serialNumber', fc: '03', addr: 45065, count: 8, type: 'ASCII', unit: 'Char'},
        {name: 'sensorLabel', fc: '03', addr: 45093, count: 8, type: 'ASCII', unit: 'Char'},
        {name: 'meaMode', fc: '03', addr: 49160, count: 1, type: 'Int16', unit: ''},
        {name: 'minFlowThreshold', fc: '03', addr: 49220, count: 2, type: 'float', unit: 'm/s'},
        {name: 'maxFlowThreshold', fc: '03', addr: 49222, count: 2, type: 'float', unit: 'm/s'},
        {name: 'resSpeed', fc: '03', addr: 49299, count: 2, type: 'float', unit: 'm/s'},
        {name: 'clrTime', fc: '03', addr: 49169, count: 1, type: 'Int16', unit: 's'},
        {name: 'rstTimer', fc: '03', addr: 49163, count: 1, type: 'Int16', unit: 's'},
        {name: 'rstMargin', fc: '03', addr: 49297, count: 2, type: 'float', unit: 'dB'},
        {name: 'threSeeting', fc: '03', addr: 49184, count: 1, type: 'Int16', unit: ''},
        {name: 'smoothVal', fc: '03', addr: 49296, count: 1, type: 'Int16', unit: ''},
        {name: 'instOffset', fc: '03', addr: 49310, count: 2, type: 'float', unit: 'm'},
        {name: 'leftSlope', fc: '03', addr: 49312, count: 2, type: 'float', unit: '°'},
        {name: 'rightSlope', fc: '03', addr: 49325, count: 2, type: 'float', unit: '°'},
        {name: 'rivBottWidth', fc: '03', addr: 49314, count: 2, type: 'float', unit: 'm'},
        {name: 'flowOffset', fc: '03', addr: 49329, count: 2, type: 'float', unit: 'm'},
        {name: 'veLearning', fc: '03', addr: 49214, count: 1, type: 'Int16', unit: ''},
        {name: 'cmdLearing', fc: '03', addr: 49219, count: 1, type: 'Int16', unit: ''},
        {name: 'strVirtualEcho', fc: '03', addr: 49215, count: 2, type: 'float', unit: 'm'},
        {name: 'endVirtualEcho', fc: '03', addr: 49217, count: 2, type: 'float', unit: 'm'},
        {name: 'fltTimerSetting', fc: '03', addr: 49169, count: 1, type: 'Int16', unit: 's'},
    ]
    const result = []
    for(const reg of register) {
        const res = await modbus.client.readHoldingRegisters(reg.addr, reg.count)
        let value;
        if(reg.type == 'ASCII') {
            value = res.buffer.toString('ascii')
        } else if(reg.type == 'Int16') {
            value = res.data[0]
        } else if(reg.type == 'Int32') {
            value = res.buffer.readInt32LE(0)
        } else if(reg.type == 'float') {
            const buf = Buffer.alloc(4)
            buf.writeUint16BE(res.data[1], 0)
            buf.writeUint16BE(res.data[0], 2)
            value = buf.readFloatBE(0).toFixed(2)
        }

        result.push({name: reg.name, value: value, unit: reg.unit})
    }
    return result
}

export const settingDevice = async (payload) => {
    try {
        const reg = payload
        let res 
        if(reg.type == 'Int16') {
            const value = parseInt(reg.value)
            await modbus.client.writeRegisters(reg.addr, [value])
            res = await modbus.client.readHoldingRegisters(reg.addr, 1)
            return res.data[0]
        }
        if(reg.type == 'float') {
            const value = parseFloat(reg.value)
            const buf = Buffer.alloc(4)
            buf.writeFloatBE(value)
            const reg1 = buf.readUInt16BE(2)
            const reg2 = buf.readUInt16BE(0)
            await modbus.client.writeRegisters(reg.addr, [reg1, reg2])
            res = await modbus.client.readHoldingRegisters(reg.addr, 2)
            buf.writeUint16BE(res.data[1], 0)
            buf.writeUint16BE(res.data[0], 2)
            return buf.readFloatBE(0).toFixed(2)
        }
    } catch (error) {
        console.log(error)
    }
}


export const commandLerning = async (payload) => {
    try {
        const val = parseInt(payload)
        console.log(val)
        await modbus.client.writeRegisters(49219, [val])
        return 'OK'
    } catch (error) {
        
    }
}

export const factoryReset = async () => {
    try {
        const data  = [0x0000]
        await modbus.client.writeRegisters(45056, data)
        await modbus.client.close()
        return 'OK'
    } catch (error) {
        console.log(error)
    }
}

export const disconnected = async () => {
    try {
        await modbus.client.close()
        return 'diconnected'
    } catch (error) {
        console.log(error)
    }
}