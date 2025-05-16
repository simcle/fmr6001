
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
        
        const modbusAddrRes = await modbus.client.readHoldingRegisters(49153, 1);
        const modbusAddress = modbusAddrRes.data[0] & 0x00FF;

        const snRes = await modbus.client.readHoldingRegisters(45065, 8);
        const snBuffer = Buffer.alloc(snRes.data.length * 2);
        snRes.data.forEach((val, i) => snBuffer.writeUInt16BE(val, i * 2));
        const sn = snBuffer.toString('ascii').replace(/\0/g, '');

        const labelRes = await modbus.client.readHoldingRegisters(45125, 8);
        const labelBuffer = Buffer.alloc(labelRes.data.length * 2);
        labelRes.data.forEach((val, i) => labelBuffer.writeUInt16BE(val, i * 2));
        const label = labelBuffer.toString('ascii').replace(/\0/g, '');

        return {
            modbusAddress,
            serialNumber: sn,
            sensorLabel: label
        };
    } catch (error) {
        throw error
    }
}

export const dataQureCommand = async () => {
    const register = [
        { name: 'avgFlow', addr: 43535, count: 2, type: 'float', unit: 'm/s' },
        { name: 'realtimeFlow', addr: 43537, count: 2, type: 'float', unit: 'm/s' },
        { name: 'instantTraffic', addr: 43541, count: 2, type: 'float', unit: 'm³/s' },
        { name: 'totalTraffic', addr: 43557, count: 2, type: 'float', unit: 'm³' },
        { name: 'level', addr: 43555, count: 2, type: 'float', unit: 'm' },
        { name: 'temperature', addr: 43521, count: 1, type: 'int16/100', unit: '°C' },
        { name: 'angle', addr: 43554, count: 1, type: 'int16/100', unit: '°' },
    ]

    for(const reg of register) {

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