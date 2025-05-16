
// Average flow rate => address 0xAA0F 43535 => funciton 0x04 => length 2
// Rela-time flow rate => address 0xAA11 43537 => function 0x04 => length 2


// Rata-rata flowrate 43535 m/s
// Flowrate real-time 43537 m/s
// Debit instan 43541 m³/s
// Debit akumulatif 43557 m³
// Tinggi permukaan air 43555
// Suhu 43521 °C
// Kemiringan (angle) 43554

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
        { name: 'avgFlow', addr: 43535, count: 2, type: 'float', unit: 'm/s' },
        { name: 'realtimeFlow', addr: 43537, count: 2, type: 'float', unit: 'm/s' },
        { name: 'instantTraffic', addr: 43541, count: 2, type: 'float', unit: 'm³/s' },
        { name: 'totalTraffic', addr: 43557, count: 2, type: 'float', unit: 'm³' },
        { name: 'level', addr: 43555, count: 2, type: 'float', unit: 'm' },
        { name: 'temperature', addr: 43521, count: 1, type: 'int16/100', unit: '°C' },
        { name: 'angle', addr: 43554, count: 1, type: 'int16/100', unit: '°' },
    ]
    const result = []
    for(const reg of register) {
        const res = await modbus.client.readInputRegisters(reg.addr, reg.count)
        let value;
        if(reg.type == 'float') {
            value = res.buffer.readFloatBE(0).toFixed(2)
        } else {
            value = res.data[0] / 100
        }
        result.push({name: reg.name, value: value, unit: reg.unit})
    }
    return result
}

export const disconnected = async () => {
    try {
        await modbus.client.close()
        return 'diconnected'
    } catch (error) {
        console.log(error)
    }
}