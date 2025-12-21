import React from 'react';
import { motion } from 'framer-motion';
import useStore, { TERMINALS, COMPONENT_TYPES } from '../../store/store';

const Contactor = ({ node, label = 'K1' }) => {
    const { componentStates, selectedTerminal, selectTerminal, isSimulating } = useStore();
    const state = componentStates[node.id] || { active: false };
    const type = node.type === COMPONENT_TYPES.CONTACTOR_K1 ? COMPONENT_TYPES.CONTACTOR_K1 : COMPONENT_TYPES.CONTACTOR_K2;
    const terminals = TERMINALS[type];

    const getTerminalPosition = (terminal) => {
        const positions = {
            'A1': { top: -7, left: 15 },
            'A2': { bottom: -7, left: 15 },
            'L1': { top: -7, left: 40 },
            'T1': { bottom: -7, left: 40 },
            'L2': { top: -7, left: 65 },
            'T2': { bottom: -7, left: 65 },
            // NO (Mühürleme - Sağ)
            '13': { right: -7, top: 30 },
            '14': { right: -7, top: 55 },
            // NC (Kilitleme - Sol)
            '21': { left: -7, top: 30 },
            '22': { left: -7, top: 55 },
        };
        return positions[terminal.id] || { left: 0, top: 0 };
    };

    const isTerminalSelected = (terminalId) => {
        return selectedTerminal?.nodeId === node.id && selectedTerminal?.terminalId === terminalId;
    };

    const displayLabel = node.type === COMPONENT_TYPES.CONTACTOR_K1 ? 'K1' : 'K2';

    return (
        <div className="circuit-element" style={{ left: node.x, top: node.y }}>
            <motion.div
                className="contactor-body"
                animate={state.active ? { y: -2 } : { y: 0 }}
                transition={{ duration: 0.1 }}
            >
                {/* Kontaktör Etiketi */}
                <div className="contactor-label">{displayLabel}</div>

                {/* LED Göstergesi */}
                <div className={`contactor-led ${state.active ? 'active' : ''}`} />

                {/* Bobin */}
                <motion.div
                    className="contactor-coil"
                    animate={state.active ? {
                        boxShadow: '0 0 15px rgba(0, 255, 136, 0.5)',
                        borderColor: '#00ff88'
                    } : {}}
                />

                {/* Kontaklar animasyonu */}
                {state.active && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            position: 'absolute',
                            top: '55px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '50px',
                            height: '4px',
                            background: 'linear-gradient(90deg, #00ff88, #00d4ff, #00ff88)',
                            borderRadius: '2px',
                            boxShadow: '0 0 10px rgba(0, 255, 136, 0.5)'
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
                                    left: terminal.position === 'right' ? '18px' : 'auto',
                                    right: terminal.position === 'left' ? '18px' : 'auto',
                                    top: terminal.position === 'top' ? '-16px' : 'auto',
                                    bottom: terminal.position === 'bottom' ? '-16px' : 'auto',
                                }}
                            >
                                {terminal.label}
                            </span>
                        </div>
                    );
                })}
            </motion.div>
        </div>
    );
};

export default Contactor;
