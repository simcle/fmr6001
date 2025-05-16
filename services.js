import ModbusRTU from "modbus-serial";

class ModbusService {
    constructor({transport = 'rtu', port = '/dev/ttyUSB)', baudRate = 9600, ip, tcpPort = 502}) {
        this.client = new ModbusRTU()
        this.transport = transport
        this.port = port
        this.baudRate = baudRate
        this.ip = ip
        this.tcpPort = tcpPort
        
    }

    async connect () {
        if(this.transport === 'rtu') {
            await this.client.connectRTUBuffered(this.port, {baudRate: this.baudRate})
        } else if (this.transport === 'tcp') {
            await this.client.connectTCP(this.ip, {port: this.tcpPort})
        } else {
            console.log('err')
            throw new Error("Unsupported transport type")
        }
    }
    
}

export default ModbusService