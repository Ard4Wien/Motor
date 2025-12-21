import React from 'react';
import { motion } from 'framer-motion';
import useStore, { TERMINALS, COMPONENT_TYPES } from '../../store/store';

const Motor = ({ node }) => {
    const { componentStates, selectedTerminal, selectTerminal, isSimulating } = useStore();
    const state = componentStates[node.id] || { active: false };
    const terminals = TERMINALS[COMPONENT_TYPES.MOTOR];

    const getTerminalPosition = (terminal) => {
        switch (terminal.position) {
            case 'left':
                return terminal.id === 'L1'
                    ? { left: -7, top: 20 }
                    : { left: -7, top: 50 };
            case 'top':
                return terminal.id === 'U1'
                    ? { top: -7, left: 30 }
                    : { top: -7, left: 60 };
            case 'bottom':
                return terminal.id === 'Z1'
                    ? { bottom: -7, left: 30 }
                    : { bottom: -7, left: 60 };
            default:
                return { left: 0, top: 0 };
        }
    };

    const isTerminalSelected = (terminalId) => {
        return selectedTerminal?.nodeId === node.id && selectedTerminal?.terminalId === terminalId;
    };

    const getDirectionText = () => {
        if (!state.active) return '';
        return state.direction === 'cw' ? '↻ İLERİ' : '↺ GERİ';
    };

    return (
        <div className="circuit-element" style={{ left: node.x, top: node.y }}>
            <motion.div
                className="motor-body"
                animate={state.active ? {
                    boxShadow: [
                        '0 4px 12px rgba(0, 0, 0, 0.4)',
                        '0 4px 20px rgba(0, 255, 136, 0.3)',
                        '0 4px 12px rgba(0, 0, 0, 0.4)'
                    ]
                } : {}}
                transition={state.active ? { duration: 1, repeat: Infinity } : {}}
            >
                {/* LED Göstergesi */}
                <motion.div
                    className={`motor-led ${state.active ? 'running' : ''}`}
                    animate={state.active ? {
                        scale: [1, 1.2, 1],
                        boxShadow: [
                            '0 0 5px rgba(0, 255, 136, 0.5)',
                            '0 0 20px rgba(0, 255, 136, 0.8)',
                            '0 0 5px rgba(0, 255, 136, 0.5)'
                        ]
                    } : {}}
                    transition={state.active ? { duration: 0.8, repeat: Infinity } : {}}
                />

                {/* Motor Etiketi */}
                <div className="motor-label">
                    <div>M</div>
                    <div className="type">1~</div>
                </div>

                {/* Motor Mili - Geliştirilmiş */}
                <motion.div
                    className="motor-shaft"
                    style={{
                        background: state.active
                            ? 'linear-gradient(to bottom, #8a8a9a, #5a5a6a, #8a8a9a)'
                            : 'linear-gradient(to bottom, #6a6a7a, #4a4a5a, #6a6a7a)',
                        boxShadow: state.active
                            ? '0 0 10px rgba(0, 255, 136, 0.3)'
                            : '0 2px 4px rgba(0, 0, 0, 0.3)'
                    }}
                />

                {/* Rotor - Dönen Kısım */}
                <motion.div
                    className="motor-rotor"
                    animate={state.active ? {
                        rotate: state.direction === 'cw' ? 360 : -360
                    } : { rotate: 0 }}
                    transition={state.active ? {
                        duration: 0.6,
                        repeat: Infinity,
                        ease: 'linear'
                    } : { duration: 0.5 }}
                    style={{
                        position: 'absolute',
                        right: -42,
                        top: '25%',
                        transform: 'translateY(-50%)',
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: state.active
                            ? 'conic-gradient(from 0deg, #00ff88, #00aa55, #00ff88, #00aa55, #00ff88, #00aa55, #00ff88)'
                            : 'conic-gradient(from 0deg, #5a5a6a, #3a3a4a, #5a5a6a, #3a3a4a, #5a5a6a)',
                        boxShadow: state.active
                            ? '0 0 15px rgba(0, 255, 136, 0.5), inset 0 0 10px rgba(0, 0, 0, 0.3)'
                            : 'inset 0 0 10px rgba(0, 0, 0, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {/* Merkez Nokta */}
                    <div style={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: state.active
                            ? 'radial-gradient(circle, #fff, #00ff88)'
                            : 'radial-gradient(circle, #7a7a8a, #4a4a5a)',
                        boxShadow: state.active ? '0 0 8px rgba(0, 255, 136, 0.8)' : 'none'
                    }} />
                </motion.div>

                {/* Speed Lines - Aktifken */}
                {state.active && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 0.3, repeat: Infinity }}
                        style={{
                            position: 'absolute',
                            right: -55,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 4
                        }}
                    >
                        {[0, 1, 2].map(i => (
                            <motion.div
                                key={i}
                                animate={{
                                    x: state.direction === 'cw' ? [0, 8, 0] : [0, -8, 0],
                                    opacity: [0.3, 1, 0.3]
                                }}
                                transition={{ duration: 0.4, delay: i * 0.1, repeat: Infinity }}
                                style={{
                                    width: 12,
                                    height: 2,
                                    background: 'linear-gradient(to right, #00ff88, transparent)',
                                    borderRadius: 2,
                                    transform: state.direction === 'ccw' ? 'scaleX(-1)' : 'none'
                                }}
                            />
                        ))}
                    </motion.div>
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
                                    [terminal.position === 'left' ? 'right' : terminal.position === 'right' ? 'left' : 'bottom']: '18px',
                                    [terminal.position === 'top' ? 'top' : terminal.position === 'bottom' ? 'bottom' : '']: terminal.position === 'top' || terminal.position === 'bottom' ? '-18px' : 'auto'
                                }}
                            >
                                {terminal.label}
                            </span>
                        </div>
                    );
                })}
            </motion.div>

            {/* Yön Göstergesi - Çarkın Altında */}
            {state.active && (
                <motion.div
                    className="motor-direction"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        position: 'absolute',
                        right: -42,
                        top: 50,
                        transform: 'translateX(50%)',
                        color: state.direction === 'cw' ? '#00ff88' : '#ff8800',
                        fontWeight: 600,
                        fontSize: 10,
                        textAlign: 'center',
                        textShadow: state.direction === 'cw'
                            ? '0 0 10px rgba(0, 255, 136, 0.5)'
                            : '0 0 10px rgba(255, 136, 0, 0.5)',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {getDirectionText()}
                </motion.div>
            )}
        </div>
    );
};

export default Motor;
