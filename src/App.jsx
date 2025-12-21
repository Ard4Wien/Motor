import React from 'react';
import ControlPanel from './components/ControlPanel';
import Toolbox from './components/Toolbox';
import WorkCanvas from './components/WorkCanvas';
import ErrorToast from './components/ErrorToast';
import StatusBar from './components/StatusBar';

function App() {
    // Disable right click context menu
    React.useEffect(() => {
        const handleContextMenu = (e) => {
            e.preventDefault();
        };
        document.addEventListener('contextmenu', handleContextMenu);
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
        };
    }, []);

    return (
        <div className="app-container">
            {/* Watermark */}
            <div className="watermark-overlay">
                © 2024 - Motor Simülasyonu - By Arda
            </div>

            {/* Çalışma Alanı */}
            <WorkCanvas />

            {/* Kontrol Paneli - Sol Üst */}
            <ControlPanel />

            {/* Araç Kutusu - Sağ */}
            <Toolbox />

            {/* Durum Çubuğu - Alt Orta */}
            <StatusBar />

            {/* Hata Mesajları */}
            <ErrorToast />
        </div>
    );
}

export default App;
