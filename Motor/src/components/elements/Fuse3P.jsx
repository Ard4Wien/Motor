import React from 'react';
import { motion } from 'framer-motion';
import useStore, { TERMINALS, COMPONENT_TYPES } from '../../store/store';

const Fuse3P = ({ node }) => {
    const { componentStates, selectedTerminal, selectTerminal, isSimulating } = useStore();
    const state = componentStates[node.id] || { active: false };
    const terminals = TERMINALS[COMPONENT_TYPES.FUSE_3P];

    const getTerminalPosition = (terminal) => {
        const positions = {
            'L1_IN': { top: -7, left: 15 },
            'L2_IN': { top: -7, left: 50 },
            'L3_IN': { top: -7, left: 85 },
            'L1_OUT': { bottom: -7, left: 15 },
            'L2_OUT': { bottom: -7, left: 50 },
            'L3_OUT': { bottom: -7, left: 85 },
        };
        return positions[terminal.id] || { left: 0, top: 0 };
    };

    const isTerminalSelected = (terminalId) => {
        return selectedTerminal?.nodeId === node.id && selectedTerminal?.terminalId === terminalId;
    };

    const fuseColors = ['#ff4444', '#ffcc00', '#4488ff']; // L1=Kırmızı, L2=Sarı, L3=Mavi

    return (
        <div className="circuit-element" style={{ left: node.x, top: node.y }}>
            <div style={{
                width: 110,
                height: 90,
                background: 'linear-gradient(135deg, #4a4a5a 0%, #2a2a3a 100%)',
                border: '2px solid #5a5a6a',
                borderRadius: 8,
                position: 'relative',
                boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.1), 0 4px 12px rgba(0, 0, 0, 0.4)',
                padding: 8
            }}>
                {/* Üst Etiket */}
                <div style={{
                    position: 'absolute',
                    top: 5,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: 10,
                    fontWeight: 600,
                    color: '#8a8a9a',
                    letterSpacing: 1
                }}>3P FUSE</div>

                {/* 3 Adet Sigorta Kartuşu */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    marginTop: 20,
                    gap: 6
                }}>
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            style={{
                                width: 26,
                                height: 50,
                                background: 'linear-gradient(180deg, #3a3a4a 0%, #2a2a3a 50%, #3a3a4a 100%)',
                                borderRadius: 4,
                                border: '1px solid #5a5a6a',
                                position: 'relative',
                                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)'
                            }}
                            whileHover={{ scale: 1.05 }}
                        >
                            {/* Üst Kapak */}
                            <div style={{
                                width: '100%',
                                height: 10,
                                background: `linear-gradient(180deg, ${fuseColors[i]}, ${fuseColors[i]}88)`,
                                borderRadius: '4px 4px 0 0',
                                boxShadow: state.active ? `0 0 8px ${fuseColors[i]}` : 'none'
                            }} />

                            {/* Cam Gösterge */}
                            <div style={{
                                position: 'absolute',
                                top: 15,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: 14,
                                height: 20,
                                background: state.active
                                    ? 'linear-gradient(180deg, rgba(0,255,136,0.3), rgba(0,255,136,0.1))'
                                    : 'linear-gradient(180deg, rgba(50,50,60,0.8), rgba(30,30,40,0.8))',
                                borderRadius: 3,
                                border: '1px solid #4a4a5a',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {/* Tel Göstergesi */}
                                <div style={{
                                    width: 2,
                                    height: 14,
                                    background: state.active ? '#00ff88' : '#666',
                                    borderRadius: 1,
                                    boxShadow: state.active ? '0 0 5px #00ff88' : 'none'
                                }} />
                            </div>

                            {/* Alt Kapak */}
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                width: '100%',
                                height: 10,
                                background: `linear-gradient(180deg, ${fuseColors[i]}88, ${fuseColors[i]})`,
                                borderRadius: '0 0 4px 4px'
                            }} />

                            {/* Faz Etiketi */}
                            <div style={{
                                position: 'absolute',
                                bottom: -18,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                fontSize: 9,
                                color: fuseColors[i],
                                fontWeight: 600
                            }}>L{i + 1}</div>
                        </motion.div>
                    ))}
                </div>

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
                                    top: terminal.position === 'top' ? '-16px' : 'auto',
                                    bottom: terminal.position === 'bottom' ? '-16px' : 'auto',
                                }}
                            >
                                {terminal.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Fuse3P;
