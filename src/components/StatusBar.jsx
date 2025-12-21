import React from 'react';
import { motion } from 'framer-motion';
import useStore from '../store/store';

const StatusBar = () => {
    const { isSimulating, circuitActive, motorDirection, nodes, wires, errors } = useStore();

    const getSimulationStatus = () => {
        if (errors.length > 0) return { text: 'Hata', status: 'error' };
        if (!isSimulating) return { text: 'Bekliyor', status: 'idle' };
        if (isSimulating && !circuitActive) return { text: 'Hazır (START\'a basın)', status: 'warning' };
        return { text: 'Çalışıyor', status: 'active' };
    };

    const getCircuitStatus = () => {
        if (!isSimulating) return { text: 'Pasif', status: 'idle' };
        if (circuitActive) return { text: 'Aktif', status: 'active' };
        return { text: 'Devre Açık', status: 'warning' };
    };

    const getMotorStatus = () => {
        if (!circuitActive || !motorDirection) return { text: 'Durgun', status: 'idle' };
        return {
            text: motorDirection === 'cw' ? 'İleri ↻' : 'Geri ↺',
            status: 'active'
        };
    };

    const simStatus = getSimulationStatus();
    const circuitStatus = getCircuitStatus();
    const motorStatus = getMotorStatus();

    return (
        <motion.div
            className="status-bar"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
        >
            <div className="status-item">
                <div className={`status-indicator ${simStatus.status}`} />
                <span>Simülasyon: {simStatus.text}</span>
            </div>

            <div className="status-item">
                <div className={`status-indicator ${circuitStatus.status}`} />
                <span>Devre: {circuitStatus.text}</span>
            </div>

            <div className="status-item">
                <div className={`status-indicator ${motorStatus.status}`} />
                <span>Motor: {motorStatus.text}</span>
            </div>

            <div className="status-item">
                <span>📦 {nodes.length} bileşen</span>
            </div>

            <div className="status-item">
                <span>🔌 {wires.length} bağlantı</span>
            </div>
        </motion.div>
    );
};

export default StatusBar;
