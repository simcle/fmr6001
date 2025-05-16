import ModbusRTU from "modbus-serial";
const client = new ModbusRTU()




const readRegister = async () => {
    await client.connectRTUBuffered('/dev/tty.usbserial-A10LKBRF', {baudRate: 9600})
    client.setID(1)
    setInterval(() => {
        client.readHoldingRegisters(1, 2, (err, data) => {
            console.log(err)
            console.log(data)
        })
    }, 1000)

}

readRegister()