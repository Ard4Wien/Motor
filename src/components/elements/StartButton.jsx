import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useStore, { TERMINALS, COMPONENT_TYPES } from '../../store/store';

const StartButton = ({ node }) => {
    const {
        selectedTerminal,
        selectTerminal,
        isSimulating,
        circuitActive,
        activateCircuit,
        componentStates
    } = useStore();
    const [isPressed, setIsPressed] = useState(false);
    const terminals = TERMINALS[node.type] || [];

    // Bu butonun kendi durumu
    const buttonState = componentStates[node.id] || { active: false };
    const isThisButtonActive = buttonState.active;

    const getTerminalPosition = (terminal) => {
        const positions = {
            '13': { top: -7, left: '50%', transform: 'translateX(-50%)' },
            '14': { bottom: -7, left: '50%', transform: 'translateX(-50%)' },
        };
        return positions[terminal.id] || { left: 0, top: 0 };
    };

    const isTerminalSelected = (terminalId) => {
        return selectedTerminal?.nodeId === node.id && selectedTerminal?.terminalId === terminalId;
    };

    const handleButtonPress = () => {
        // NO (Normally Open) buton - basınca devre tamamlanır
        // Sadece simülasyon modundayken çalışır
        if (isSimulating && !circuitActive) {
            activateCircuit();
        }
    };

    return (
        <div className="circuit-element" style={{ left: node.x, top: node.y }}>
            <motion.div
                className={`button-body start-button ${isPressed ? 'pressed' : ''} ${isThisButtonActive ? 'active' : ''}`}
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
                    ▶
                </motion.div>

                {/* Aktif göstergesi - sadece bu buton aktifken */}
                {isThisButtonActive && (
                    <motion.div
                        className="button-active-indicator"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{
                            position: 'absolute',
                            top: -5,
                            right: -5,
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            background: '#00ff88',
                            boxShadow: '0 0 10px #00ff88'
                        }}
                    />
                )}

                {/* Simülasyon modu göstergesi - sadece bu butona özel */}
                {isSimulating && !circuitActive && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        style={{
                            position: 'absolute',
                            inset: -2,
                            border: '2px solid #00ff88',
                            borderRadius: 14,
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
                                    top: terminal.id === '13' ? '-16px' : 'auto',
                                    bottom: terminal.id === '14' ? '-16px' : 'auto',
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
            <div className="button-label">START (NO)</div>
        </div>
    );
};

export default StartButton;
