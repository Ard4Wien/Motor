import { create } from 'zustand';

// Benzersiz ID üretici
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Bileşen tipleri
export const COMPONENT_TYPES = {
    MOTOR: 'motor',
    CONTACTOR_K1: 'contactor_k1',
    CONTACTOR_K2: 'contactor_k2',
    START_BUTTON_S1: 'start_button_s1',  // İleri Start butonu
    START_BUTTON_S2: 'start_button_s2',  // Geri Start butonu
    STOP_BUTTON: 'stop_button',           // Stop butonu (S0)
    FUSE_3P: 'fuse_3p',
    FUSE_1P: 'fuse_1p',
    POWER_SOURCE: 'power_source',
};

// Bileşen terminalleri
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
        // NO (Mühürleme - Holding)
        { id: '13', label: '13 (NO)', position: 'right', type: 'aux_no' },
        { id: '14', label: '14 (NO)', position: 'right', type: 'aux_no' },
        // NC (Kilitleme - Interlock)
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
        // NO (Mühürleme - Holding)
        { id: '13', label: '13 (NO)', position: 'right', type: 'aux_no' },
        { id: '14', label: '14 (NO)', position: 'right', type: 'aux_no' },
        // NC (Kilitleme - Interlock)
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

// Varsayılan güç kaynağı (sanal)
export const POWER_SOURCE = {
    id: 'power-source',
    type: 'power_source',
    terminals: [
        { id: 'L', label: 'L (Faz)', type: 'phase' },
        { id: 'N', label: 'N (Nötr)', type: 'neutral' },
    ],
};

const useStore = create((set, get) => ({
    // Yerleştirilmiş bileşenler
    nodes: [],

    // Kablo bağlantıları
    wires: [],

    // Simülasyon durumu (Kontrol Paneli tarafından kontrol edilir)
    isSimulating: false,

    // Devre aktif mi? (Start/Stop butonları tarafından kontrol edilir)
    // Simülasyon modundayken Start'a basınca true, Stop'a basınca false
    circuitActive: false,

    // Seçili terminal (kablo bağlantısı için)
    selectedTerminal: null,

    // Hatalar
    errors: [],

    // Bileşen durumları
    componentStates: {},

    // Motor yönü: 'cw' (saat yönü), 'ccw' (ters), null (durgun)
    motorDirection: null,

    // Undo/Redo için geçmiş
    history: [],
    future: [],

    // Sürükleme durumu
    isDragging: false,
    draggedItem: null,

    // === ACTIONS ===

    // Geçmişe kaydet
    saveToHistory: () => {
        const { nodes, wires, history } = get();
        set({
            history: [...history.slice(-20), { nodes: [...nodes], wires: [...wires] }],
            future: [],
        });
    },

    // Bileşen ekle
    addNode: (type, x, y) => {
        get().saveToHistory();
        const newNode = {
            id: generateId(),
            type,
            x,
            y,
            state: 'idle', // idle, active, error
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

    // Bileşen taşı
    moveNode: (id, x, y) => {
        set((state) => ({
            nodes: state.nodes.map((node) =>
                node.id === id ? { ...node, x, y } : node
            ),
        }));
    },

    // Bileşen sil
    removeNode: (id) => {
        get().saveToHistory();
        set((state) => ({
            nodes: state.nodes.filter((node) => node.id !== id),
            wires: state.wires.filter(
                (wire) => wire.from.nodeId !== id && wire.to.nodeId !== id
            ),
        }));
    },

    // Terminal seç
    selectTerminal: (nodeId, terminalId) => {
        const { selectedTerminal, wires } = get();

        if (selectedTerminal === null) {
            // İlk terminal seçimi
            set({ selectedTerminal: { nodeId, terminalId } });
        } else if (selectedTerminal.nodeId === nodeId && selectedTerminal.terminalId === terminalId) {
            // Aynı terminale tıklandı, seçimi iptal et
            set({ selectedTerminal: null });
        } else {
            // İkinci terminal - kablo çiz
            const newWire = {
                id: generateId(),
                from: selectedTerminal,
                to: { nodeId, terminalId },
                type: 'control', // phase, neutral, control, ground
                energized: false,
            };

            // Aynı bağlantı var mı kontrol et
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

    // Kablo sil
    removeWire: (id) => {
        get().saveToHistory();
        set((state) => ({
            wires: state.wires.filter((wire) => wire.id !== id),
        }));
    },

    // ============================================
    // SİMÜLASYON KONTROL (Kontrol Paneli)
    // ============================================

    // Simülasyonu başlat (Kontrol Paneli - Başlat butonu)
    startSimulation: () => {
        const { nodes, wires } = get();

        // KURAL: Kablo olmadan simülasyon başlamaz!
        if (wires.length === 0) {
            set({ errors: [{ type: 'no_wires', message: 'HATA: Kablo bağlantısı yapılmadan simülasyon başlatılamaz!' }] });
            return false;
        }

        // Motor kontrolü
        const motors = nodes.filter((n) => n.type === COMPONENT_TYPES.MOTOR);
        if (motors.length === 0) {
            set({ errors: [{ type: 'missing', message: 'Motor eklenmedi!' }] });
            return false;
        }

        // Simülasyon modunu başlat, ama devre henüz aktif değil (Start butonuna basmak gerek)
        set({
            isSimulating: true,
            circuitActive: false,
            errors: [],
            motorDirection: null,
            componentStates: {},
        });
        return true;
    },

    // Simülasyonu durdur (Kontrol Paneli - Durdur butonu)
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

    // ============================================
    // DEVRE KONTROL (Start/Stop Butonları)
    // ============================================

    // Devreyi aktif et (Start butonu - NO)
    activateCircuit: () => {
        const { isSimulating, nodes, wires, analyzeCircuit } = get();

        // Sadece simülasyon modundayken çalışır
        if (!isSimulating) return false;

        // Devre analizi yap
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

    // Devreyi durdur (Stop butonu - NC)
    deactivateCircuit: () => {
        const { isSimulating, nodes } = get();

        // Sadece simülasyon modundayken çalışır
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

    // ============================================
    // GELİŞMİŞ SİMÜLASYON MOTORU (Gerçekçi Akım Takibi)
    // ============================================

    // Devre Analizi ve Simülasyon Adımı
    evaluateCircuit: () => {
        const { nodes, wires, componentStates } = get();

        // 1. Durumu Sıfırla
        let newEnergizedWires = new Set();
        let activeTerminals = new Set(); // Voltaj olan terminaller (NodeId-TerminalId)
        let newComponentStates = { ...componentStates };
        let nextMotorDirection = null;

        // Yardımcı: Terminal ID oluştur
        const tId = (nId, termId) => `${nId}-${termId}`;

        // 2. Güç Kaynağını Başlat
        const sources = nodes.filter(n => n.type === COMPONENT_TYPES.POWER_SOURCE);
        sources.forEach(src => {
            activeTerminals.add(tId(src.id, 'L')); // Faz daima aktif
        });

        // 3. Simülasyon Döngüsü (Akım Yayılımı)
        let changed = true;
        let loops = 0;

        // Kontaktör durumlarını başlangıçta SABİT tut (mühürleme için kritik!)
        // Bu sayede voltaj tüm yollardan yayılabilir
        const stableContactorStates = {};
        nodes.forEach(node => {
            if (node.type === COMPONENT_TYPES.CONTACTOR_K1 || node.type === COMPONENT_TYPES.CONTACTOR_K2) {
                stableContactorStates[node.id] = newComponentStates[node.id]?.active || false;
            }
        });

        while (changed && loops < 20) {
            changed = false;
            loops++;

            // A. Kablolar üzerinden Voltaj Taşıma
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

            // B. Bileşen İçinden Geçiş Mantığı (Transfer Function)
            nodes.forEach(node => {
                // >>>> STOP BUTONU (NC) <<<<
                if (node.type === COMPONENT_TYPES.STOP_BUTTON) {
                    const isPressed = newComponentStates[node.id]?.pressed;
                    if (!isPressed) {
                        // NC: Basılı değilse geçiş izni
                        if (activeTerminals.has(tId(node.id, '11')) && !activeTerminals.has(tId(node.id, '12'))) {
                            activeTerminals.add(tId(node.id, '12')); changed = true;
                        }
                        if (activeTerminals.has(tId(node.id, '12')) && !activeTerminals.has(tId(node.id, '11'))) {
                            activeTerminals.add(tId(node.id, '11')); changed = true;
                        }
                    }
                    // Basılıysa akım geçmez (NC açılır)
                }

                // >>>> START BUTONU (NO) <<<<
                if (node.type === COMPONENT_TYPES.START_BUTTON_S1 || node.type === COMPONENT_TYPES.START_BUTTON_S2) {
                    const isPressed = newComponentStates[node.id]?.pressed;
                    if (isPressed) {
                        // NO: Basılıysa geçiş izni
                        if (activeTerminals.has(tId(node.id, '13')) && !activeTerminals.has(tId(node.id, '14'))) {
                            activeTerminals.add(tId(node.id, '14')); changed = true;
                        }
                    }
                    // Basılı değilse akım geçmez (NO açık)
                }

                // >>>> KONTAKTÖRLER (K1 & K2) - SADECE KONTAK YAYILIMI <<<<
                if (node.type === COMPONENT_TYPES.CONTACTOR_K1 || node.type === COMPONENT_TYPES.CONTACTOR_K2) {
                    // SABİT duruma göre kontakları işle (loop boyunca değişmez!)
                    const isCurrentlyActive = stableContactorStates[node.id];

                    if (isCurrentlyActive) {
                        // AKTİF: NO Kontaklar (13-14) KAPALI
                        if (activeTerminals.has(tId(node.id, '13')) && !activeTerminals.has(tId(node.id, '14'))) {
                            activeTerminals.add(tId(node.id, '14')); changed = true;
                        }
                        if (activeTerminals.has(tId(node.id, '14')) && !activeTerminals.has(tId(node.id, '13'))) {
                            activeTerminals.add(tId(node.id, '13')); changed = true;
                        }
                        // NC Kontaklar (21-22) AÇIK - akım geçmez

                        // Güç Kontakları (L-T) KAPALI
                        if (activeTerminals.has(tId(node.id, 'L1')) && !activeTerminals.has(tId(node.id, 'T1'))) {
                            activeTerminals.add(tId(node.id, 'T1')); changed = true;
                        }
                        if (activeTerminals.has(tId(node.id, 'L2')) && !activeTerminals.has(tId(node.id, 'T2'))) {
                            activeTerminals.add(tId(node.id, 'T2')); changed = true;
                        }
                    } else {
                        // PASİF: NC Kontaklar (21-22) KAPALI -> Akım geçer
                        if (activeTerminals.has(tId(node.id, '21')) && !activeTerminals.has(tId(node.id, '22'))) {
                            activeTerminals.add(tId(node.id, '22')); changed = true;
                        }
                        if (activeTerminals.has(tId(node.id, '22')) && !activeTerminals.has(tId(node.id, '21'))) {
                            activeTerminals.add(tId(node.id, '21')); changed = true;
                        }
                        // NO Kontaklar (13-14) AÇIK - akım geçmez
                    }
                }
            });
        }

        // 4. DÖNGÜ BİTTİKTEN SONRA: Kontaktör durumlarını A1 voltajına göre güncelle
        nodes.forEach(node => {
            if (node.type === COMPONENT_TYPES.CONTACTOR_K1 || node.type === COMPONENT_TYPES.CONTACTOR_K2) {
                if (activeTerminals.has(tId(node.id, 'A1'))) {
                    newComponentStates[node.id] = { ...newComponentStates[node.id], active: true };
                } else {
                    newComponentStates[node.id] = { ...newComponentStates[node.id], active: false };
                }
            }
        });

        // 4. Motor Yön Kontrolü
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

    // Butona Basma İşlemi (Mouse Down)
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

    // Butonu Bırakma İşlemi (Mouse Up)
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

    // ============================================
    // OTOMATİK KABLOLAMA (Auto-Wiring)
    // ============================================
    autoWireCircuit: () => {
        get().reset();

        const newNodes = [];
        const newWires = [];
        const nid = () => generateId();
        const wid = () => generateId();

        // Ekranın ortasına göre konumlandırma (Canvas ~1200x700 varsayımı)
        const centerX = 600;
        const centerY = 320;

        // 1. Bileşenleri Oluştur - Merkezi Düzen
        const pwr = { id: nid(), type: COMPONENT_TYPES.POWER_SOURCE, x: centerX - 300, y: centerY + 50, state: 'idle' };
        const stop = { id: nid(), type: COMPONENT_TYPES.STOP_BUTTON, x: centerX - 120, y: centerY - 130, state: 'idle' };
        const startFwd = { id: nid(), type: COMPONENT_TYPES.START_BUTTON_S1, x: centerX, y: centerY - 130, state: 'idle' };
        const startRev = { id: nid(), type: COMPONENT_TYPES.START_BUTTON_S2, x: centerX + 120, y: centerY - 130, state: 'idle' };
        const k1 = { id: nid(), type: COMPONENT_TYPES.CONTACTOR_K1, x: centerX - 60, y: centerY + 20, state: 'idle' };
        const k2 = { id: nid(), type: COMPONENT_TYPES.CONTACTOR_K2, x: centerX + 100, y: centerY + 20, state: 'idle' };
        const motor = { id: nid(), type: COMPONENT_TYPES.MOTOR, x: centerX, y: centerY + 200, state: 'idle' };

        newNodes.push(pwr, stop, startFwd, startRev, k1, k2, motor);

        // 2. Kumanda Devresi Kabloları
        // Faz -> Stop(11)
        newWires.push({ id: wid(), from: { nodeId: pwr.id, terminalId: 'L' }, to: { nodeId: stop.id, terminalId: '11' }, type: 'phase', energized: false });

        // Stop(12) -> StartFwd(13) & StartRev(13) (Köprü)
        newWires.push({ id: wid(), from: { nodeId: stop.id, terminalId: '12' }, to: { nodeId: startFwd.id, terminalId: '13' }, type: 'control', energized: false });
        newWires.push({ id: wid(), from: { nodeId: stop.id, terminalId: '12' }, to: { nodeId: startRev.id, terminalId: '13' }, type: 'control', energized: false });

        // StartFwd(14) -> K2(21 NC) -> K2(22) -> K1(A1) (Kilitleme)
        newWires.push({ id: wid(), from: { nodeId: startFwd.id, terminalId: '14' }, to: { nodeId: k2.id, terminalId: '21' }, type: 'control', energized: false });
        newWires.push({ id: wid(), from: { nodeId: k2.id, terminalId: '22' }, to: { nodeId: k1.id, terminalId: 'A1' }, type: 'control', energized: false });

        // StartRev(14) -> K1(21 NC) -> K1(22) -> K2(A1) (Kilitleme)
        newWires.push({ id: wid(), from: { nodeId: startRev.id, terminalId: '14' }, to: { nodeId: k1.id, terminalId: '21' }, type: 'control', energized: false });
        newWires.push({ id: wid(), from: { nodeId: k1.id, terminalId: '22' }, to: { nodeId: k2.id, terminalId: 'A1' }, type: 'control', energized: false });

        // Nötr -> A2'ler
        newWires.push({ id: wid(), from: { nodeId: pwr.id, terminalId: 'N' }, to: { nodeId: k1.id, terminalId: 'A2' }, type: 'neutral', energized: false });
        newWires.push({ id: wid(), from: { nodeId: pwr.id, terminalId: 'N' }, to: { nodeId: k2.id, terminalId: 'A2' }, type: 'neutral', energized: false });

        // Mühürleme (K1 NO // StartFwd)
        newWires.push({ id: wid(), from: { nodeId: startFwd.id, terminalId: '13' }, to: { nodeId: k1.id, terminalId: '13' }, type: 'control', energized: false });
        newWires.push({ id: wid(), from: { nodeId: startFwd.id, terminalId: '14' }, to: { nodeId: k1.id, terminalId: '14' }, type: 'control', energized: false });

        // Mühürleme (K2 NO // StartRev)
        newWires.push({ id: wid(), from: { nodeId: startRev.id, terminalId: '13' }, to: { nodeId: k2.id, terminalId: '13' }, type: 'control', energized: false });
        newWires.push({ id: wid(), from: { nodeId: startRev.id, terminalId: '14' }, to: { nodeId: k2.id, terminalId: '14' }, type: 'control', energized: false });

        // ============================================
        // 3. GÜÇ DEVRESİ KABLOLARI
        // 1 Fazlı Motor Yön Değiştirme:
        // İleri (K1): Faz→U1 & Z1, Nötr→U2 & Z2
        // Geri (K2): Faz→U1 & Z2, Nötr→U2 & Z1 (Yardımcı sargı ters)
        // ============================================

        // Güç Kaynağı → Kontaktörler
        newWires.push({ id: wid(), from: { nodeId: pwr.id, terminalId: 'L' }, to: { nodeId: k1.id, terminalId: 'L1' }, type: 'phase', energized: false });
        newWires.push({ id: wid(), from: { nodeId: pwr.id, terminalId: 'N' }, to: { nodeId: k1.id, terminalId: 'L2' }, type: 'neutral', energized: false });
        newWires.push({ id: wid(), from: { nodeId: pwr.id, terminalId: 'L' }, to: { nodeId: k2.id, terminalId: 'L1' }, type: 'phase', energized: false });
        newWires.push({ id: wid(), from: { nodeId: pwr.id, terminalId: 'N' }, to: { nodeId: k2.id, terminalId: 'L2' }, type: 'neutral', energized: false });

        // K1 → Motor (İLERİ YÖN)
        // Ana sargı: U1=Faz, U2=Nötr
        newWires.push({ id: wid(), from: { nodeId: k1.id, terminalId: 'T1' }, to: { nodeId: motor.id, terminalId: 'U1' }, type: 'phase', energized: false });
        newWires.push({ id: wid(), from: { nodeId: k1.id, terminalId: 'T2' }, to: { nodeId: motor.id, terminalId: 'U2' }, type: 'neutral', energized: false });
        // Yardımcı sargı: Z1=Faz, Z2=Nötr (Ana ile aynı yön)
        newWires.push({ id: wid(), from: { nodeId: k1.id, terminalId: 'T1' }, to: { nodeId: motor.id, terminalId: 'Z1' }, type: 'phase', energized: false });
        newWires.push({ id: wid(), from: { nodeId: k1.id, terminalId: 'T2' }, to: { nodeId: motor.id, terminalId: 'Z2' }, type: 'neutral', energized: false });

        // K2 → Motor (GERİ YÖN)
        // Ana sargı: U1=Faz, U2=Nötr (Aynı kalır)
        newWires.push({ id: wid(), from: { nodeId: k2.id, terminalId: 'T1' }, to: { nodeId: motor.id, terminalId: 'U1' }, type: 'phase', energized: false });
        newWires.push({ id: wid(), from: { nodeId: k2.id, terminalId: 'T2' }, to: { nodeId: motor.id, terminalId: 'U2' }, type: 'neutral', energized: false });
        // Yardımcı sargı: Z1=Nötr, Z2=Faz (TERSİNE çevrildi!)
        newWires.push({ id: wid(), from: { nodeId: k2.id, terminalId: 'T1' }, to: { nodeId: motor.id, terminalId: 'Z2' }, type: 'phase', energized: false });
        newWires.push({ id: wid(), from: { nodeId: k2.id, terminalId: 'T2' }, to: { nodeId: motor.id, terminalId: 'Z1' }, type: 'neutral', energized: false });

        // Motor L1/N terminalleri (Güç göstergesi için)
        newWires.push({ id: wid(), from: { nodeId: pwr.id, terminalId: 'L' }, to: { nodeId: motor.id, terminalId: 'L1' }, type: 'phase', energized: false });
        newWires.push({ id: wid(), from: { nodeId: pwr.id, terminalId: 'N' }, to: { nodeId: motor.id, terminalId: 'N' }, type: 'neutral', energized: false });

        set({
            nodes: newNodes,
            wires: newWires,
            componentStates: {},
            isSimulating: false
        });
    },

    // Tümünü sıfırla
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

    // Geri al
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

    // İleri al
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

    // Hata temizle
    clearErrors: () => set({ errors: [] }),

    // Sürükleme durumu
    setDragging: (isDragging, item = null) => set({ isDragging, draggedItem: item }),
}));

export default useStore;
