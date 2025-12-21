import { create } from 'zustand';

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Bileşen tipleri
export const COMPONENT_TYPES = {
    MOTOR: 'motor',
    CONTACTOR_K1: 'contactor_k1',
    CONTACTOR_K2: 'contactor_k2',
    START_BUTTON_S1: 'start_button_s1',
    START_BUTTON_S2: 'start_button_s2',
    STOP_BUTTON: 'stop_button',
    FUSE_3P: 'fuse_3p',
    FUSE_1P: 'fuse_1p',
    POWER_SOURCE: 'power_source',
};

export const TERMINALS = {
    [COMPONENT_TYPES.MOTOR]: [
        { id: 'L1', label: 'L1', position: 'left', type: 'power' },
        { id: 'N', label: 'N', position: 'left', type: 'power' },
        { id: 'U1', label: 'U1', position: 'top', type: 'winding' },
        { id: 'U2', label: 'U2', position: 'top', type: 'winding' },
        { id: 'Z1', label: 'Z1', position: 'bottom', type: 'winding' },
        { id: 'Z2', label: 'Z2', position: 'bottom', type: 'winding' },
    ],
    [COMPONENT_TYPES.CONTACTOR_K1]: [
        { id: 'A1', label: 'A1', position: 'top', type: 'coil' },
        { id: 'A2', label: 'A2', position: 'bottom', type: 'coil' },
        { id: 'L1', label: '1/L1', position: 'top', type: 'power_in' },
        { id: 'T1', label: '2/T1', position: 'bottom', type: 'power_out' },
        { id: 'L2', label: '3/L2', position: 'top', type: 'power_in' },
        { id: 'T2', label: '4/T2', position: 'bottom', type: 'power_out' },
        { id: '13', label: '13 (NO)', position: 'right', type: 'aux_no' },
        { id: '14', label: '14 (NO)', position: 'right', type: 'aux_no' },
        { id: '21', label: '21 (NC)', position: 'left', type: 'aux_nc' },
        { id: '22', label: '22 (NC)', position: 'left', type: 'aux_nc' },
    ],
    [COMPONENT_TYPES.CONTACTOR_K2]: [
        { id: 'A1', label: 'A1', position: 'top', type: 'coil' },
        { id: 'A2', label: 'A2', position: 'bottom', type: 'coil' },
        { id: 'L1', label: '1/L1', position: 'top', type: 'power_in' },
        { id: 'T1', label: '2/T1', position: 'bottom', type: 'power_out' },
        { id: 'L2', label: '3/L2', position: 'top', type: 'power_in' },
        { id: 'T2', label: '4/T2', position: 'bottom', type: 'power_out' },
        { id: '13', label: '13 (NO)', position: 'right', type: 'aux_no' },
        { id: '14', label: '14 (NO)', position: 'right', type: 'aux_no' },
        { id: '21', label: '21 (NC)', position: 'left', type: 'aux_nc' },
        { id: '22', label: '22 (NC)', position: 'left', type: 'aux_nc' },
    ],
    [COMPONENT_TYPES.START_BUTTON_S1]: [
        { id: '13', label: '13', position: 'top', type: 'no_in' },
        { id: '14', label: '14', position: 'bottom', type: 'no_out' },
    ],
    [COMPONENT_TYPES.START_BUTTON_S2]: [
        { id: '13', label: '13', position: 'top', type: 'no_in' },
        { id: '14', label: '14', position: 'bottom', type: 'no_out' },
    ],
    [COMPONENT_TYPES.STOP_BUTTON]: [
        { id: '11', label: '11', position: 'top', type: 'nc_in' },
        { id: '12', label: '12', position: 'bottom', type: 'nc_out' },
    ],
    [COMPONENT_TYPES.FUSE_3P]: [
        { id: 'L1_IN', label: 'L1', position: 'top', type: 'power_in' },
        { id: 'L2_IN', label: 'L2', position: 'top', type: 'power_in' },
        { id: 'L3_IN', label: 'L3', position: 'top', type: 'power_in' },
        { id: 'L1_OUT', label: 'T1', position: 'bottom', type: 'power_out' },
        { id: 'L2_OUT', label: 'T2', position: 'bottom', type: 'power_out' },
        { id: 'L3_OUT', label: 'T3', position: 'bottom', type: 'power_out' },
    ],
    [COMPONENT_TYPES.FUSE_1P]: [
        { id: 'IN', label: 'L', position: 'top', type: 'power_in' },
        { id: 'OUT', label: 'T', position: 'bottom', type: 'power_out' },
    ],
    [COMPONENT_TYPES.POWER_SOURCE]: [
        { id: 'L', label: 'L (Faz)', position: 'bottom', type: 'phase' },
        { id: 'N', label: 'N (Nötr)', position: 'bottom', type: 'neutral' },
    ],
};

export const POWER_SOURCE = {
    id: 'power-source',
    type: 'power_source',
    terminals: [
        { id: 'L', label: 'L (Faz)', type: 'phase' },
        { id: 'N', label: 'N (Nötr)', type: 'neutral' },
    ],
};

const useStore = create((set, get) => ({
    nodes: [],
    wires: [],
    isSimulating: false,
    circuitActive: false,
    selectedTerminal: null,
    errors: [],
    componentStates: {},
    motorDirection: null,
    history: [],
    future: [],
    isDragging: false,
    draggedItem: null,
    saveToHistory: () => {
        const { nodes, wires, history } = get();
        set({
            history: [...history.slice(-20), { nodes: [...nodes], wires: [...wires] }],
            future: [],
        });
    },

    addNode: (type, x, y) => {
        get().saveToHistory();
        const newNode = {
            id: generateId(),
            type,
            x,
            y,
            state: 'idle',
        };
        set((state) => ({
            nodes: [...state.nodes, newNode],
            componentStates: {
                ...state.componentStates,
                [newNode.id]: { active: false },
            },
        }));
        return newNode.id;
    },

    moveNode: (id, x, y) => {
        set((state) => ({
            nodes: state.nodes.map((node) =>
                node.id === id ? { ...node, x, y } : node
            ),
        }));
    },

    removeNode: (id) => {
        get().saveToHistory();
        set((state) => ({
            nodes: state.nodes.filter((node) => node.id !== id),
            wires: state.wires.filter(
                (wire) => wire.from.nodeId !== id && wire.to.nodeId !== id
            ),
        }));
    },

    selectTerminal: (nodeId, terminalId) => {
        const { selectedTerminal, wires } = get();

        if (selectedTerminal === null) {
            set({ selectedTerminal: { nodeId, terminalId } });
        } else if (selectedTerminal.nodeId === nodeId && selectedTerminal.terminalId === terminalId) {
            set({ selectedTerminal: null });
        } else {
            const newWire = {
                id: generateId(),
                from: selectedTerminal,
                to: { nodeId, terminalId },
                type: 'control',
                energized: false,
            };

            const exists = wires.some(
                (w) =>
                    (w.from.nodeId === newWire.from.nodeId &&
                        w.from.terminalId === newWire.from.terminalId &&
                        w.to.nodeId === newWire.to.nodeId &&
                        w.to.terminalId === newWire.to.terminalId) ||
                    (w.from.nodeId === newWire.to.nodeId &&
                        w.from.terminalId === newWire.to.terminalId &&
                        w.to.nodeId === newWire.from.nodeId &&
                        w.to.terminalId === newWire.from.terminalId)
            );

            if (!exists) {
                get().saveToHistory();
                set((state) => ({
                    wires: [...state.wires, newWire],
                    selectedTerminal: null,
                }));
            } else {
                set({ selectedTerminal: null });
            }
        }
    },

    removeWire: (id) => {
        get().saveToHistory();
        set((state) => ({
            wires: state.wires.filter((wire) => wire.id !== id),
        }));
    },
    startSimulation: () => {
        const { nodes, wires } = get();
        if (wires.length === 0) {
            set({ errors: [{ type: 'no_wires', message: 'HATA: Kablo bağlantısı yapılmadan simülasyon başlatılamaz!' }] });
            return false;
        }
        const motors = nodes.filter((n) => n.type === COMPONENT_TYPES.MOTOR);
        if (motors.length === 0) {
            set({ errors: [{ type: 'missing', message: 'Motor eklenmedi!' }] });
            return false;
        }
        set({
            isSimulating: true,
            circuitActive: false,
            errors: [],
            motorDirection: null,
            componentStates: {},
        });
        return true;
    },
    stopSimulation: () => {
        set((state) => ({
            isSimulating: false,
            circuitActive: false,
            motorDirection: null,
            componentStates: Object.fromEntries(
                Object.keys(state.componentStates).map((id) => [id, { active: false }])
            ),
            wires: state.wires.map((wire) => ({ ...wire, energized: false })),
        }));
    },
    activateCircuit: () => {
        const { isSimulating, nodes, wires, analyzeCircuit } = get();
        if (!isSimulating) return false;
        const result = analyzeCircuit();

        if (result.errors.length > 0) {
            set({ errors: result.errors });
            return false;
        }

        set({
            circuitActive: true,
            errors: [],
            motorDirection: result.motorDirection,
            componentStates: result.componentStates,
            wires: wires.map((wire) => ({
                ...wire,
                energized: result.energizedWires.includes(wire.id),
            })),
        });
        return true;
    },
    deactivateCircuit: () => {
        const { isSimulating, nodes } = get();
        if (!isSimulating) return;

        set((state) => ({
            circuitActive: false,
            motorDirection: null,
            componentStates: Object.fromEntries(
                Object.keys(state.componentStates).map((id) => [id, { active: false }])
            ),
            wires: state.wires.map((wire) => ({ ...wire, energized: false })),
        }));
    },
    evaluateCircuit: () => {
        const { nodes, wires, componentStates } = get();

        let newEnergizedWires = new Set();
        let activeTerminals = new Set();
        let newComponentStates = { ...componentStates };
        let nextMotorDirection = null;
        const tId = (nId, termId) => `${nId}-${termId}`;
        const sources = nodes.filter(n => n.type === COMPONENT_TYPES.POWER_SOURCE);
        sources.forEach(src => {
            activeTerminals.add(tId(src.id, 'L'));
        });

        let changed = true;
        let loops = 0;
        const stableContactorStates = {};
        nodes.forEach(node => {
            if (node.type === COMPONENT_TYPES.CONTACTOR_K1 || node.type === COMPONENT_TYPES.CONTACTOR_K2) {
                stableContactorStates[node.id] = newComponentStates[node.id]?.active || false;
            }
        });

        while (changed && loops < 20) {
            changed = false;
            loops++;
            wires.forEach(wire => {
                const fromKey = tId(wire.from.nodeId, wire.from.terminalId);
                const toKey = tId(wire.to.nodeId, wire.to.terminalId);

                const isEnergized = activeTerminals.has(fromKey) || activeTerminals.has(toKey);

                if (isEnergized) {
                    if (!newEnergizedWires.has(wire.id)) {
                        newEnergizedWires.add(wire.id);
                        changed = true;
                    }
                    if (!activeTerminals.has(fromKey)) { activeTerminals.add(fromKey); changed = true; }
                    if (!activeTerminals.has(toKey)) { activeTerminals.add(toKey); changed = true; }
                }
            });
            nodes.forEach(node => {
                if (node.type === COMPONENT_TYPES.STOP_BUTTON) {
                    const isPressed = newComponentStates[node.id]?.pressed;
                    if (!isPressed) {
                        if (activeTerminals.has(tId(node.id, '11')) && !activeTerminals.has(tId(node.id, '12'))) {
                            activeTerminals.add(tId(node.id, '12')); changed = true;
                        }
                        if (activeTerminals.has(tId(node.id, '12')) && !activeTerminals.has(tId(node.id, '11'))) {
                            activeTerminals.add(tId(node.id, '11')); changed = true;
                        }
                    }
                }
                if (node.type === COMPONENT_TYPES.START_BUTTON_S1 || node.type === COMPONENT_TYPES.START_BUTTON_S2) {
                    const isPressed = newComponentStates[node.id]?.pressed;
                    if (isPressed) {
                        if (activeTerminals.has(tId(node.id, '13')) && !activeTerminals.has(tId(node.id, '14'))) {
                            activeTerminals.add(tId(node.id, '14')); changed = true;
                        }
                    }
                }
                if (node.type === COMPONENT_TYPES.CONTACTOR_K1 || node.type === COMPONENT_TYPES.CONTACTOR_K2) {
                    const isCurrentlyActive = stableContactorStates[node.id];

                    if (isCurrentlyActive) {
                        if (activeTerminals.has(tId(node.id, '13')) && !activeTerminals.has(tId(node.id, '14'))) {
                            activeTerminals.add(tId(node.id, '14')); changed = true;
                        }
                        if (activeTerminals.has(tId(node.id, '14')) && !activeTerminals.has(tId(node.id, '13'))) {
                            activeTerminals.add(tId(node.id, '13')); changed = true;
                        }
                        if (activeTerminals.has(tId(node.id, 'L1')) && !activeTerminals.has(tId(node.id, 'T1'))) {
                            activeTerminals.add(tId(node.id, 'T1')); changed = true;
                        }
                        if (activeTerminals.has(tId(node.id, 'L2')) && !activeTerminals.has(tId(node.id, 'T2'))) {
                            activeTerminals.add(tId(node.id, 'T2')); changed = true;
                        }
                    } else {
                        if (activeTerminals.has(tId(node.id, '21')) && !activeTerminals.has(tId(node.id, '22'))) {
                            activeTerminals.add(tId(node.id, '22')); changed = true;
                        }
                        if (activeTerminals.has(tId(node.id, '22')) && !activeTerminals.has(tId(node.id, '21'))) {
                            activeTerminals.add(tId(node.id, '21')); changed = true;
                        }
                    }
                }
            });
        }
        nodes.forEach(node => {
            if (node.type === COMPONENT_TYPES.CONTACTOR_K1 || node.type === COMPONENT_TYPES.CONTACTOR_K2) {
                if (activeTerminals.has(tId(node.id, 'A1'))) {
                    newComponentStates[node.id] = { ...newComponentStates[node.id], active: true };
                } else {
                    newComponentStates[node.id] = { ...newComponentStates[node.id], active: false };
                }
            }
        });
        const motor = nodes.find(n => n.type === COMPONENT_TYPES.MOTOR);
        if (motor) {
            const k1 = nodes.find(n => n.type === COMPONENT_TYPES.CONTACTOR_K1);
            const k2 = nodes.find(n => n.type === COMPONENT_TYPES.CONTACTOR_K2);

            if (newComponentStates[k1?.id]?.active) nextMotorDirection = 'cw';
            else if (newComponentStates[k2?.id]?.active) nextMotorDirection = 'ccw';
            else nextMotorDirection = null;

            if (nextMotorDirection) {
                newComponentStates[motor.id] = { active: true, direction: nextMotorDirection };
            } else {
                newComponentStates[motor.id] = { active: false };
            }
        }

        set({
            wires: wires.map(w => ({ ...w, energized: newEnergizedWires.has(w.id) })),
            componentStates: newComponentStates,
            motorDirection: nextMotorDirection
        });
    },
    pressButton: (nodeId) => {
        const { componentStates } = get();
        set({
            componentStates: {
                ...componentStates,
                [nodeId]: { ...componentStates[nodeId], pressed: true }
            }
        });
        get().evaluateCircuit();
    },
    releaseButton: (nodeId) => {
        const { componentStates } = get();
        set({
            componentStates: {
                ...componentStates,
                [nodeId]: { ...componentStates[nodeId], pressed: false }
            }
        });
        get().evaluateCircuit();
    },
    autoWireCircuit: () => {
        get().reset();

        const newNodes = [];
        const newWires = [];
        const nid = () => generateId();
        const wid = () => generateId();
        const centerX = 600;
        const centerY = 320;
        const pwr = { id: nid(), type: COMPONENT_TYPES.POWER_SOURCE, x: centerX - 300, y: centerY + 50, state: 'idle' };
        const stop = { id: nid(), type: COMPONENT_TYPES.STOP_BUTTON, x: centerX - 120, y: centerY - 130, state: 'idle' };
        const startFwd = { id: nid(), type: COMPONENT_TYPES.START_BUTTON_S1, x: centerX, y: centerY - 130, state: 'idle' };
        const startRev = { id: nid(), type: COMPONENT_TYPES.START_BUTTON_S2, x: centerX + 120, y: centerY - 130, state: 'idle' };
        const k1 = { id: nid(), type: COMPONENT_TYPES.CONTACTOR_K1, x: centerX - 60, y: centerY + 20, state: 'idle' };
        const k2 = { id: nid(), type: COMPONENT_TYPES.CONTACTOR_K2, x: centerX + 100, y: centerY + 20, state: 'idle' };
        const motor = { id: nid(), type: COMPONENT_TYPES.MOTOR, x: centerX, y: centerY + 200, state: 'idle' };
        newNodes.push(pwr, stop, startFwd, startRev, k1, k2, motor);
        newWires.push({ id: wid(), from: { nodeId: pwr.id, terminalId: 'L' }, to: { nodeId: stop.id, terminalId: '11' }, type: 'phase', energized: false });
        newWires.push({ id: wid(), from: { nodeId: stop.id, terminalId: '12' }, to: { nodeId: startFwd.id, terminalId: '13' }, type: 'control', energized: false });
        newWires.push({ id: wid(), from: { nodeId: stop.id, terminalId: '12' }, to: { nodeId: startRev.id, terminalId: '13' }, type: 'control', energized: false });
        newWires.push({ id: wid(), from: { nodeId: startFwd.id, terminalId: '14' }, to: { nodeId: k2.id, terminalId: '21' }, type: 'control', energized: false });
        newWires.push({ id: wid(), from: { nodeId: k2.id, terminalId: '22' }, to: { nodeId: k1.id, terminalId: 'A1' }, type: 'control', energized: false });
        newWires.push({ id: wid(), from: { nodeId: startRev.id, terminalId: '14' }, to: { nodeId: k1.id, terminalId: '21' }, type: 'control', energized: false });
        newWires.push({ id: wid(), from: { nodeId: k1.id, terminalId: '22' }, to: { nodeId: k2.id, terminalId: 'A1' }, type: 'control', energized: false });
        newWires.push({ id: wid(), from: { nodeId: pwr.id, terminalId: 'N' }, to: { nodeId: k1.id, terminalId: 'A2' }, type: 'neutral', energized: false });
        newWires.push({ id: wid(), from: { nodeId: pwr.id, terminalId: 'N' }, to: { nodeId: k2.id, terminalId: 'A2' }, type: 'neutral', energized: false });
        newWires.push({ id: wid(), from: { nodeId: startFwd.id, terminalId: '13' }, to: { nodeId: k1.id, terminalId: '13' }, type: 'control', energized: false });
        newWires.push({ id: wid(), from: { nodeId: startFwd.id, terminalId: '14' }, to: { nodeId: k1.id, terminalId: '14' }, type: 'control', energized: false });
        newWires.push({ id: wid(), from: { nodeId: startRev.id, terminalId: '13' }, to: { nodeId: k2.id, terminalId: '13' }, type: 'control', energized: false });
        newWires.push({ id: wid(), from: { nodeId: startRev.id, terminalId: '14' }, to: { nodeId: k2.id, terminalId: '14' }, type: 'control', energized: false });
        newWires.push({ id: wid(), from: { nodeId: pwr.id, terminalId: 'L' }, to: { nodeId: k1.id, terminalId: 'L1' }, type: 'phase', energized: false });
        newWires.push({ id: wid(), from: { nodeId: pwr.id, terminalId: 'N' }, to: { nodeId: k1.id, terminalId: 'L2' }, type: 'neutral', energized: false });
        newWires.push({ id: wid(), from: { nodeId: pwr.id, terminalId: 'L' }, to: { nodeId: k2.id, terminalId: 'L1' }, type: 'phase', energized: false });
        newWires.push({ id: wid(), from: { nodeId: pwr.id, terminalId: 'N' }, to: { nodeId: k2.id, terminalId: 'L2' }, type: 'neutral', energized: false });
        newWires.push({ id: wid(), from: { nodeId: k1.id, terminalId: 'T1' }, to: { nodeId: motor.id, terminalId: 'U1' }, type: 'phase', energized: false });
        newWires.push({ id: wid(), from: { nodeId: k1.id, terminalId: 'T2' }, to: { nodeId: motor.id, terminalId: 'U2' }, type: 'neutral', energized: false });
        newWires.push({ id: wid(), from: { nodeId: k1.id, terminalId: 'T1' }, to: { nodeId: motor.id, terminalId: 'Z1' }, type: 'phase', energized: false });
        newWires.push({ id: wid(), from: { nodeId: k1.id, terminalId: 'T2' }, to: { nodeId: motor.id, terminalId: 'Z2' }, type: 'neutral', energized: false });
        newWires.push({ id: wid(), from: { nodeId: k2.id, terminalId: 'T1' }, to: { nodeId: motor.id, terminalId: 'U1' }, type: 'phase', energized: false });
        newWires.push({ id: wid(), from: { nodeId: k2.id, terminalId: 'T2' }, to: { nodeId: motor.id, terminalId: 'U2' }, type: 'neutral', energized: false });
        newWires.push({ id: wid(), from: { nodeId: k2.id, terminalId: 'T1' }, to: { nodeId: motor.id, terminalId: 'Z2' }, type: 'phase', energized: false });
        newWires.push({ id: wid(), from: { nodeId: k2.id, terminalId: 'T2' }, to: { nodeId: motor.id, terminalId: 'Z1' }, type: 'neutral', energized: false });
        newWires.push({ id: wid(), from: { nodeId: pwr.id, terminalId: 'L' }, to: { nodeId: motor.id, terminalId: 'L1' }, type: 'phase', energized: false });
        newWires.push({ id: wid(), from: { nodeId: pwr.id, terminalId: 'N' }, to: { nodeId: motor.id, terminalId: 'N' }, type: 'neutral', energized: false });

        set({
            nodes: newNodes,
            wires: newWires,
            componentStates: {},
            isSimulating: false
        });
    },
    reset: () => {
        get().saveToHistory();
        set({
            nodes: [],
            wires: [],
            isSimulating: false,
            selectedTerminal: null,
            errors: [],
            componentStates: {},
            motorDirection: null,
        });
    },
    undo: () => {
        const { history, nodes, wires, future } = get();
        if (history.length === 0) return;

        const previous = history[history.length - 1];
        set({
            nodes: previous.nodes,
            wires: previous.wires,
            history: history.slice(0, -1),
            future: [{ nodes, wires }, ...future],
        });
    },
    redo: () => {
        const { future, nodes, wires, history } = get();
        if (future.length === 0) return;

        const next = future[0];
        set({
            nodes: next.nodes,
            wires: next.wires,
            future: future.slice(1),
            history: [...history, { nodes, wires }],
        });
    },
    clearErrors: () => set({ errors: [] }),
    setDragging: (isDragging, item = null) => set({ isDragging, draggedItem: item }),
}));

export default useStore;
