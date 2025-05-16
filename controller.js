
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
let client 

export const connect = async (payload) => {
    const { trasport, port, baudarate, ip, tcpPort, } = payload
    client = new ModbusService({transport: trasport, port: port, baudRate: baudarate, ip: ip, tcpPort: tcpPort})
    try {
        await client.connect()
        await client.setID(1)
        const modbusAddrRes = await client.readHoldingRegisters(1, 5);
        console.log(payload, modbusAddrRes)
        const modbusAddress = modbusAddrRes.data[0] & 0x00FF;
        const snRes = await client.readHoldingRegisters(45065, 8);
        const sn = Buffer.from(snRes.buffer).toString('ascii').replace(/\0/g, '');

        const labelRes = await client.readHoldingRegisters(45125, 8);
        const label = Buffer.from(labelRes.buffer).toString('ascii').replace(/\0/g, '');

        return {
            modbusAddress,
            serialNumber: sn,
            sensorLabel: label
        };
    } catch (error) {
        throw error
    }
}

const register = [
    { name: 'avgFlow', addr: 43535, count: 2, type: 'float', unit: 'm/s' },
    { name: 'realtimeFlow', addr: 43537, count: 2, type: 'float', unit: 'm/s' },
    { name: 'instantTraffic', addr: 43541, count: 2, type: 'float', unit: 'm³/s' },
    { name: 'totalTraffic', addr: 43557, count: 2, type: 'float', unit: 'm³' },
    { name: 'level', addr: 43555, count: 2, type: 'float', unit: 'm' },
    { name: 'temperature', addr: 43521, count: 1, type: 'int16/100', unit: '°C' },
    { name: 'angle', addr: 43554, count: 1, type: 'int16/100', unit: '°' },
]

async function readAll () {
    try {
        await client.connectRTUBuffered()
    } catch (error) {
        
    }
}