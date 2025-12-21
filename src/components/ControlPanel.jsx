import React from 'react';
import { motion } from 'framer-motion';
import useStore from '../store/store';

const ControlPanel = () => {
    const {
        isSimulating,
        startSimulation,
        stopSimulation,
        reset,
        undo,
        redo,
        history,
        future,
        nodes,
        wires
    } = useStore();

    const canUndo = history.length > 0;
    const canRedo = future.length > 0;
    const hasContent = nodes.length > 0 || wires.length > 0;

    return (
        <motion.div
            className="control-panel"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
        >
            <h2>🎮 Kontrol Paneli</h2>

            <div className="control-buttons">
                {/* Başlat / Durdur */}
                {!isSimulating ? (
                    <motion.button
                        className="control-btn start"
                        onClick={startSimulation}
                        disabled={!hasContent}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span>▶</span>
                        Başlat
                    </motion.button>
                ) : (
                    <motion.button
                        className="control-btn stop"
                        onClick={stopSimulation}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span>⏹</span>
                        Durdur
                    </motion.button>
                )}

                {/* Sıfırla */}
                <motion.button
                    className="control-btn reset"
                    onClick={reset}
                    disabled={!hasContent || isSimulating}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <span>🔄</span>
                    Sıfırla
                </motion.button>

                {/* Otomatik Bağla */}
                <motion.button
                    className="control-btn"
                    onClick={useStore.getState().autoWireCircuit}
                    disabled={isSimulating}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ background: 'linear-gradient(135deg, #9333ea, #7c3aed)' }}
                >
                    <span>🪄</span>
                    Otomatik Bağla
                </motion.button>

                <div className="control-divider" />

                {/* Geri Al / İleri Al */}
                <div className="undo-redo-group">
                    <motion.button
                        className="control-btn"
                        onClick={undo}
                        disabled={!canUndo || isSimulating}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        title="Geri Al"
                    >
                        ↩️
                    </motion.button>
                    <motion.button
                        className="control-btn"
                        onClick={redo}
                        disabled={!canRedo || isSimulating}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        title="İleri Al"
                    >
                        ↪️
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default ControlPanel;
