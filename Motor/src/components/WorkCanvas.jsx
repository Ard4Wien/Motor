import React, { useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore, { COMPONENT_TYPES, TERMINALS } from '../store/store';
import Motor from './elements/Motor';
import Contactor from './elements/Contactor';
import StartButton from './elements/StartButton';
import StopButton from './elements/StopButton';
import Fuse3P from './elements/Fuse3P';
import Fuse1P from './elements/Fuse1P';
import PowerSource from './elements/PowerSource';

const WorkCanvas = () => {
    const canvasRef = useRef(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [draggingNode, setDraggingNode] = useState(null);

    const {
        nodes,
        wires,
        addNode,
        moveNode,
        removeNode,
        selectedTerminal,
        isSimulating,
        setDragging,
        isDragging
    } = useStore();

    // Drop handler
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        const componentType = e.dataTransfer.getData('componentType');
        if (!componentType || isSimulating) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - 40;
        const y = e.clientY - rect.top - 40;

        addNode(componentType, x, y);
        setDragging(false, null);
    }, [addNode, isSimulating, setDragging]);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    // Node sürükleme
    const handleNodeMouseDown = (e, node) => {
        if (isSimulating) return;
        e.stopPropagation();

        const rect = canvasRef.current.getBoundingClientRect();
        setDragOffset({
            x: e.clientX - rect.left - node.x,
            y: e.clientY - rect.top - node.y,
        });
        setDraggingNode(node.id);
    };

    const handleMouseMove = useCallback((e) => {
        if (!draggingNode) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - dragOffset.x;
        const y = e.clientY - rect.top - dragOffset.y;

        moveNode(draggingNode, Math.max(0, x), Math.max(0, y));
    }, [draggingNode, dragOffset, moveNode]);

    const handleMouseUp = () => {
        setDraggingNode(null);
    };

    // Terminal pozisyonu hesapla
    const getTerminalPosition = (nodeId, terminalId) => {
        const node = nodes.find((n) => n.id === nodeId);
        if (!node) return null;

        const terminals = TERMINALS[node.type];
        const terminal = terminals?.find((t) => t.id === terminalId);
        if (!terminal) return null;

        // Her bileşen için farklı offset'ler
        let offsetX = 0, offsetY = 0;
        const baseX = node.x;
        const baseY = node.y;

        if (node.type === COMPONENT_TYPES.MOTOR) {
            const positions = {
                'L1': { x: 0, y: 27 },
                'N': { x: 0, y: 57 },
                'U1': { x: 37, y: 0 },
                'U2': { x: 67, y: 0 },
                'Z1': { x: 37, y: 80 },
                'Z2': { x: 67, y: 80 },
            };
            offsetX = positions[terminalId]?.x || 0;
            offsetY = positions[terminalId]?.y || 0;
        } else if (node.type.startsWith('contactor')) {
            const positions = {
                'A1': { x: 22, y: 0 },
                'A2': { x: 22, y: 100 },
                'L1': { x: 47, y: 0 },
                'T1': { x: 47, y: 100 },
                'L2': { x: 72, y: 0 },
                'T2': { x: 72, y: 100 },
                // NO (Mühürleme - Sağ)
                '13': { x: 95, y: 35 },
                '14': { x: 95, y: 65 },
                // NC (Kilitleme - Sol)
                '21': { x: 0, y: 35 },
                '22': { x: 0, y: 65 },
            };
            offsetX = positions[terminalId]?.x || 0;
            offsetY = positions[terminalId]?.y || 0;
        } else if (node.type === COMPONENT_TYPES.START_BUTTON || node.type === COMPONENT_TYPES.STOP_BUTTON || node.type.startsWith('start_button')) {
            const positions = {
                '13': { x: 30, y: 0 },
                '14': { x: 30, y: 60 },
                '11': { x: 30, y: 0 },
                '12': { x: 30, y: 60 },
            };
            offsetX = positions[terminalId]?.x || 0;
            offsetY = positions[terminalId]?.y || 0;
        } else if (node.type === COMPONENT_TYPES.FUSE_3P) {
            const positions = {
                'L1_IN': { x: 19, y: 0 },
                'L2_IN': { x: 47, y: 0 },
                'L3_IN': { x: 75, y: 0 },
                'L1_OUT': { x: 19, y: 60 },
                'L2_OUT': { x: 47, y: 60 },
                'L3_OUT': { x: 75, y: 60 },
            };
            offsetX = positions[terminalId]?.x || 0;
            offsetY = positions[terminalId]?.y || 0;
        } else if (node.type === COMPONENT_TYPES.FUSE_1P) {
            const positions = {
                'IN': { x: 25, y: 0 },
                'OUT': { x: 25, y: 60 },
            };
            offsetX = positions[terminalId]?.x || 0;
            offsetY = positions[terminalId]?.y || 0;
        } else if (node.type === COMPONENT_TYPES.POWER_SOURCE) {
            const positions = {
                'L': { x: 27, y: 70 },
                'N': { x: 67, y: 70 },
            };
            offsetX = positions[terminalId]?.x || 0;
            offsetY = positions[terminalId]?.y || 0;
        }

        return { x: baseX + offsetX, y: baseY + offsetY };
    };

    // Bezier eğrisi hesapla
    const getWirePath = (from, to) => {
        const dx = Math.abs(to.x - from.x);
        const dy = Math.abs(to.y - from.y);
        const curve = Math.min(dx, dy) * 0.5 + 30;

        // Dikey veya yatay eğililime göre kontrol noktaları
        if (dy > dx) {
            // Dikey bağlantı
            const cp1y = from.y + (to.y > from.y ? curve : -curve);
            const cp2y = to.y + (to.y > from.y ? -curve : curve);
            return `M ${from.x} ${from.y} C ${from.x} ${cp1y}, ${to.x} ${cp2y}, ${to.x} ${to.y}`;
        } else {
            // Yatay bağlantı
            const cp1x = from.x + (to.x > from.x ? curve : -curve);
            const cp2x = to.x + (to.x > from.x ? -curve : curve);
            return `M ${from.x} ${from.y} C ${cp1x} ${from.y}, ${cp2x} ${to.y}, ${to.x} ${to.y}`;
        }
    };

    // Bileşen render
    const renderNode = (node) => {
        const componentMap = {
            [COMPONENT_TYPES.MOTOR]: Motor,
            [COMPONENT_TYPES.CONTACTOR_K1]: Contactor,
            [COMPONENT_TYPES.CONTACTOR_K2]: Contactor,
            [COMPONENT_TYPES.START_BUTTON]: StartButton,
            [COMPONENT_TYPES.START_BUTTON_S1]: StartButton,
            [COMPONENT_TYPES.START_BUTTON_S2]: StartButton,
            [COMPONENT_TYPES.STOP_BUTTON]: StopButton,
            [COMPONENT_TYPES.FUSE_3P]: Fuse3P,
            [COMPONENT_TYPES.FUSE_1P]: Fuse1P,
            [COMPONENT_TYPES.POWER_SOURCE]: PowerSource,
        };

        const Component = componentMap[node.type];
        if (!Component) return null;

        // Button interaction during simulation
        const isButton = node.type.includes('button');
        const handleButtonPress = () => {
            if (isButton && isSimulating) {
                useStore.getState().pressButton(node.id);
            }
        };
        const handleButtonRelease = () => {
            if (isButton && isSimulating) {
                useStore.getState().releaseButton(node.id);
            }
        };

        return (
            <motion.div
                key={node.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                onMouseDown={(e) => {
                    handleNodeMouseDown(e, node);
                    handleButtonPress();
                }}
                onMouseUp={handleButtonRelease}
                onMouseLeave={handleButtonRelease}
                onDoubleClick={() => !isSimulating && removeNode(node.id)}
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    cursor: isSimulating ? (isButton ? 'pointer' : 'default') : 'move'
                }}
            >
                <Component node={node} />
            </motion.div>
        );
    };

    return (
        <div
            ref={canvasRef}
            className="work-canvas"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {/* Kablolar - SVG Layer */}
            <svg className="wires-layer">
                <defs>
                    {/* Akım akış animasyonu gradient */}
                    <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00ff88" />
                        <stop offset="50%" stopColor="#00d4ff" />
                        <stop offset="100%" stopColor="#00ff88" />
                    </linearGradient>
                </defs>

                {wires.map((wire) => {
                    const from = getTerminalPosition(wire.from.nodeId, wire.from.terminalId);
                    const to = getTerminalPosition(wire.to.nodeId, wire.to.terminalId);

                    if (!from || !to) return null;

                    const path = getWirePath(from, to);

                    return (
                        <g key={wire.id}>
                            <motion.path
                                d={path}
                                className={`wire ${wire.type} ${wire.energized ? 'energized' : ''}`}
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.3 }}
                                strokeDasharray={wire.energized ? '10 5' : 'none'}
                                stroke={wire.energized ? 'url(#energyGradient)' : undefined}
                                onClick={() => !isSimulating && useStore.getState().removeWire(wire.id)}
                                style={{
                                    cursor: isSimulating ? 'default' : 'pointer',
                                    pointerEvents: 'stroke'
                                }}
                            />
                            {/* Akış animasyonu için ek path */}
                            {wire.energized && (
                                <motion.path
                                    d={path}
                                    fill="none"
                                    stroke="rgba(0, 255, 136, 0.8)"
                                    strokeWidth="5"
                                    strokeLinecap="round"
                                    strokeDasharray="5 15"
                                    initial={{ strokeDashoffset: 0 }}
                                    animate={{ strokeDashoffset: -20 }}
                                    transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
                                    style={{ pointerEvents: 'none' }}
                                />
                            )}
                        </g>
                    );
                })}

                {/* Seçili terminalden mouse'a çizgi */}
                {selectedTerminal && (
                    <TemporaryWire
                        startNodeId={selectedTerminal.nodeId}
                        startTerminalId={selectedTerminal.terminalId}
                        getTerminalPosition={getTerminalPosition}
                    />
                )}
            </svg>

            {/* Bileşenler */}
            <AnimatePresence>
                {nodes.map(renderNode)}
            </AnimatePresence>

            {/* Drop zone göstergesi */}
            {isDragging && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: 'absolute',
                        inset: 20,
                        border: '2px dashed rgba(0, 212, 255, 0.3)',
                        borderRadius: 16,
                        pointerEvents: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 16,
                        color: 'rgba(0, 212, 255, 0.5)'
                    }}
                >
                    Bileşeni buraya bırakın
                </motion.div>
            )}
        </div>
    );
};

// Geçici kablo çizgisi (bağlantı yaparken)
const TemporaryWire = ({ startNodeId, startTerminalId, getTerminalPosition }) => {
    const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

    React.useEffect(() => {
        const handleMouseMove = (e) => {
            const canvas = document.querySelector('.work-canvas');
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const start = getTerminalPosition(startNodeId, startTerminalId);
    if (!start) return null;

    return (
        <motion.line
            x1={start.x}
            y1={start.y}
            x2={mousePos.x}
            y2={mousePos.y}
            stroke="rgba(255, 204, 0, 0.6)"
            strokeWidth="2"
            strokeDasharray="5 5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ pointerEvents: 'none' }}
        />
    );
};

export default WorkCanvas;
