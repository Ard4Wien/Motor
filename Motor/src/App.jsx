import React from 'react';
import ControlPanel from './components/ControlPanel';
import Toolbox from './components/Toolbox';
import WorkCanvas from './components/WorkCanvas';
import ErrorToast from './components/ErrorToast';
import StatusBar from './components/StatusBar';

function App() {
    return (
        <div className="app-container">
            <WorkCanvas />
            <ControlPanel />
            <Toolbox />
            <StatusBar />
            <ErrorToast />
        </div>
    );
}

export default App;
