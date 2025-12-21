import React from 'react';
import { motion } from 'framer-motion';
import useStore, { TERMINALS, COMPONENT_TYPES } from '../../store/store';

const PowerSource = ({ node }) => {
    const { componentStates, selectedTerminal, selectTerminal, isSimulating } = useStore();
    const state = componentStates[node.id] || { active: false };
    const terminals = TERMINALS[COMPONENT_TYPES.POWER_SOURCE];

    const getTerminalPosition = (terminal) => {
        const positions = {
            'L': { bottom: -7, left: 20 },
            'N': { bottom: -7, left: 60 },
        };
        return positions[terminal.id] || { left: 0, top: 0 };
    };

    const isTerminalSelected = (terminalId) => {
        return selectedTerminal?.nodeId === node.id && selectedTerminal?.terminalId === terminalId;
    };

    return (
        <div className="circuit-element" style={{ left: node.x, top: node.y }}>
            <div className="power-source-body">
                {/* Güç simgesi */}
                <div className="power-icon">
                    <span>⚡</span>
                </div>

                {/* Faz ve Nötr göstergeleri */}
                <div className="power-terminals-visual">
                    <div className="power-terminal-box phase">
                        <span>L</span>
                    </div>
                    <div className="power-terminal-box neutral">
                        <span>N</span>
                    </div>
                </div>

                {/* Etiket */}
                <div className="power-label">230V AC</div>

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
                                    bottom: '-18px',
                                    left: '50%',
                                    transform: 'translateX(-50%)'
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

export default PowerSource;
