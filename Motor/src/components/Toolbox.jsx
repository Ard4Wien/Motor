import React from 'react';
import { motion } from 'framer-motion';
import useStore, { COMPONENT_TYPES } from '../store/store';

const toolItems = [
    { type: COMPONENT_TYPES.POWER_SOURCE, icon: '🔌', label: 'Güç Kaynağı' },
    { type: COMPONENT_TYPES.FUSE_3P, icon: '⚡', label: '3P Sigorta' },
    { type: COMPONENT_TYPES.FUSE_1P, icon: '🔒', label: '1P Sigorta' },
    { type: COMPONENT_TYPES.MOTOR, icon: '⚙️', label: '1F Motor' },
    { type: COMPONENT_TYPES.CONTACTOR_K1, icon: '🔲', label: 'Kontaktör K1' },
    { type: COMPONENT_TYPES.CONTACTOR_K2, icon: '🔲', label: 'Kontaktör K2' },
    { type: COMPONENT_TYPES.STOP_BUTTON, icon: '🔴', label: 'S0 Stop (NC)' },
    { type: COMPONENT_TYPES.START_BUTTON_S1, icon: '🟢', label: 'S1 İleri (NO)' },
    { type: COMPONENT_TYPES.START_BUTTON_S2, icon: '🟡', label: 'S2 Geri (NO)' },
];

const Toolbox = () => {
    const { isSimulating, setDragging, addNode } = useStore();

    const handleDragStart = (e, item) => {
        if (isSimulating) return;

        setDragging(true, item);
        e.dataTransfer.setData('componentType', item.type);
        e.dataTransfer.effectAllowed = 'copy';
    };

    const handleDragEnd = () => {
        setDragging(false, null);
    };

    return (
        <motion.div
            className="toolbox"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: 0.1 }}
        >
            <h2>🧰 Araç Kutusu</h2>

            <div className="tool-items">
                {toolItems.map((item, index) => (
                    <motion.div
                        key={item.type}
                        className="tool-item"
                        draggable={!isSimulating}
                        onDragStart={(e) => handleDragStart(e, item)}
                        onDragEnd={handleDragEnd}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        style={{ opacity: isSimulating ? 0.5 : 1, cursor: isSimulating ? 'not-allowed' : 'grab' }}
                    >
                        <div className="icon">{item.icon}</div>
                        <div className="label">{item.label}</div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default Toolbox;
