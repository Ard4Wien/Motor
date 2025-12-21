import React from 'react';
import { motion } from 'framer-motion';
import useStore, { TERMINALS, COMPONENT_TYPES } from '../../store/store';

const Fuse1P = ({ node }) => {
    const { componentStates, selectedTerminal, selectTerminal, isSimulating } = useStore();
    const state = componentStates[node.id] || { active: false };
    const terminals = TERMINALS[COMPONENT_TYPES.FUSE_1P];

    const getTerminalPosition = (terminal) => {
        const positions = {
            'IN': { top: -7, left: '50%', transform: 'translateX(-50%)' },
            'OUT': { bottom: -7, left: '50%', transform: 'translateX(-50%)' },
        };
        return positions[terminal.id] || { left: 0, top: 0 };
    };

    const isTerminalSelected = (terminalId) => {
        return selectedTerminal?.nodeId === node.id && selectedTerminal?.terminalId === terminalId;
    };

    return (
        <div className="circuit-element" style={{ left: node.x, top: node.y }}>
            <div className="fuse-1p-body">
                {/* Sigorta Göstergesi */}
                <div className={`fuse-indicator-single ${state.active ? 'on' : ''}`} />

                {/* Etiket */}
                <div className="fuse-label-single">1P</div>

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

export default Fuse1P;
