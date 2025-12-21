import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useStore, { TERMINALS, COMPONENT_TYPES } from '../../store/store';

const StopButton = ({ node }) => {
    const {
        selectedTerminal,
        selectTerminal,
        isSimulating,
        circuitActive,
        deactivateCircuit,
        componentStates
    } = useStore();
    const [isPressed, setIsPressed] = useState(false);
    const terminals = TERMINALS[COMPONENT_TYPES.STOP_BUTTON];

    // Bu butonun kendi durumu - NC buton normalde kapalı
    const buttonState = componentStates[node.id] || { active: false };
    const isThisButtonActive = buttonState.active;

    const getTerminalPosition = (terminal) => {
        const positions = {
            '11': { top: -7, left: '50%', transform: 'translateX(-50%)' },
            '12': { bottom: -7, left: '50%', transform: 'translateX(-50%)' },
        };
        return positions[terminal.id] || { left: 0, top: 0 };
    };

    const isTerminalSelected = (terminalId) => {
        return selectedTerminal?.nodeId === node.id && selectedTerminal?.terminalId === terminalId;
    };

    const handleButtonPress = () => {
        // NC (Normally Closed) buton - basınca devre kesilir
        // Sadece simülasyon modunda ve devre aktifken çalışır
        if (isSimulating && circuitActive) {
            deactivateCircuit();
        }
    };

    return (
        <div className="circuit-element" style={{ left: node.x, top: node.y }}>
            <motion.div
                className={`button-body stop-button ${isPressed ? 'pressed' : ''}`}
                onMouseDown={() => setIsPressed(true)}
                onMouseUp={() => {
                    setIsPressed(false);
                    handleButtonPress();
                }}
                onMouseLeave={() => setIsPressed(false)}
                whileTap={{ scale: 0.95 }}
                style={{
                    cursor: isSimulating ? 'pointer' : 'move',
                    opacity: isSimulating ? 1 : 0.7
                }}
            >
                <motion.div
                    className="button-cap"
                    animate={isPressed ? { scale: 0.85, y: 3 } : { scale: 1, y: 0 }}
                >
                    ■
                </motion.div>

                {/* NC durumu göstergesi - devre aktifken (normalde kapalı, iletim var) */}
                {circuitActive && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 50,
                            height: 3,
                            background: '#00ff88',
                            borderRadius: 2,
                            boxShadow: '0 0 8px #00ff88',
                            pointerEvents: 'none'
                        }}
                    />
                )}

                {/* Simülasyon modunda ama devre kapalıyken */}
                {isSimulating && !circuitActive && (
                    <motion.div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 50,
                            height: 3,
                            background: '#ff4444',
                            borderRadius: 2,
                            opacity: 0.5,
                            pointerEvents: 'none'
                        }}
                    />
                )}

                {/* Terminaller */}
                {terminals.map((terminal) => {
                    const pos = getTerminalPosition(terminal);
                    const isSelected = isTerminalSelected(terminal.id);
                    return (
                        <div
                            key={terminal.id}
                            className={`terminal ${isSelected ? 'selected' : ''}`}
                            style={pos}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!isSimulating) {
                                    selectTerminal(node.id, terminal.id);
                                }
                            }}
                        >
                            <span
                                className="terminal-label"
                                style={{
                                    top: terminal.id === '11' ? '-16px' : 'auto',
                                    bottom: terminal.id === '12' ? '-16px' : 'auto',
                                    left: '50%',
                                    transform: 'translateX(-50%)'
                                }}
                            >
                                {terminal.label}
                            </span>
                        </div>
                    );
                })}
            </motion.div>
            <div className="button-label">STOP (NC)</div>
        </div>
    );
};

export default StopButton;
