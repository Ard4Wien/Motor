import React from 'react';
import ControlPanel from './components/ControlPanel';
import Toolbox from './components/Toolbox';
import WorkCanvas from './components/WorkCanvas';
import ErrorToast from './components/ErrorToast';
import StatusBar from './components/StatusBar';

function App() {
    // Disable right click and DevTools shortcuts
    React.useEffect(() => {
        // Console Warning
        console.log(
            '%c DUR! 🛑',
            'color: red; font-size: 50px; font-weight: bold; text-shadow: 2px 2px black;'
        );
        console.log(
            '%c Bu tarayıcı özelliği, geliştiriciler içindir. Bu projeyi kopyalamaya çalışmak yasal suç teşkil edebilir.',
            'font-size: 16px; color: #333;'
        );

        // Right Click Disable
        const handleContextMenu = (e) => {
            e.preventDefault();
        };

        // Keyboard Shortcuts Disable
        const handleKeyDown = (e) => {
            // F12
            if (e.key === 'F12') {
                e.preventDefault();
            }
            // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (Chrome DevTools)
            if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
                e.preventDefault();
            }
            // Ctrl+U (View Source)
            if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
                e.preventDefault();
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
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
