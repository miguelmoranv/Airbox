import React, { useState, useEffect } from 'react';
import { IonApp } from '@ionic/react';
import logo from './logo.svg';
import './App.css';
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import { setupIonicReact } from '@ionic/react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './views/login';
import Lotes from './views/lotes';
import Cajas from './views/cajas';
import { UserProvider } from './context/UserContext';
import Auxiliares from './views/auxiliares';
import ViewCajas from './views/viewCajas';
import Usuarios from './views/usuarios';
import Scanner from './components/Scanner';
import NotFound from './protected/NotFound';
import Splash from './views/Splash';
import ProtectedRoute from './protected/ProtectedRoute';

setupIonicReact();
function App() {

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    setDarkMode(prefersDark.matches);

    prefersDark.addEventListener('change', (e) => {
      setDarkMode(e.matches);
    });

    return () => {
      prefersDark.removeEventListener('change', (e) => {
        setDarkMode(e.matches);
      });
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);
  return (
    <>
    <UserProvider>
    <IonApp >
      <Router>
        <Routes>
          <Route path="/" element={  <Splash/>} />
          <Route path="/Login" element={<Login />} />



          {/* Rutas Protegidas */}
          <Route path="/Lotes" element={<ProtectedRoute><Lotes /></ProtectedRoute>} />
          <Route path="/Cajas/:id_lote/:no_serial" element={<ProtectedRoute><Cajas /></ProtectedRoute>} />
          <Route path="/ViewCajas/:id_cajas" element={<ProtectedRoute><ViewCajas /></ProtectedRoute>} />
          <Route path="/Auxiliares" element={<ProtectedRoute><Auxiliares /></ProtectedRoute>} />
          <Route path="/Usuarios" element={<ProtectedRoute><Usuarios /></ProtectedRoute>} />



          {/* Paginas no encontradas */}
          <Route path = "*" element={<NotFound/>} />
        </Routes>
      </Router>
    </IonApp>
    </UserProvider>
    </>
  );
}

export default App;
