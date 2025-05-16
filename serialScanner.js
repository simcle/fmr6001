import { SerialPort } from "serialport";

export const listAvailableSerialPorts = async () => {
    try {
        const ports = await SerialPort.list();

        // Filter hanya port yang kemungkinan RS485
        return ports.map(port => ({
            path: port.path,
            manufacturer: port.manufacturer || 'Unknown',
            serialNumber: port.serialNumber || '',
            vendorId: port.vendorId || '',
            productId: port.productId || ''
        }));
    } catch (err) {
        console.error("Gagal scan serial port:", err.message);
        return [];
    }
}
