import React, { useState, useEffect } from 'react';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { IonFabButton, IonIcon, IonAlert } from '@ionic/react';
import { scan, close } from 'ionicons/icons'; // Importa el ícono de cierre
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para la redirección

function Scanner() {
  const [scanning, setScanning] = useState(false); // Estado para verificar si está escaneando
  const [qrResult, setQrResult] = useState(''); // Contenido del QR
  const [error, setError] = useState(null); // Estado para capturar cualquier error
  const [showAlert, setShowAlert] = useState(false);
  const isNative = window.capacitor; // Verifica si la aplicación se está ejecutando en un entorno nativo
  const navigate = useNavigate(); // Hook para redirección

  // Función para solicitar permiso para usar la cámara
  const requestCameraPermission = async () => {
    try {
      if (isNative) {
        // En entorno nativo (móvil)
        const status = await BarcodeScanner.checkPermission({ force: true });
        if (status.granted) {
          leerQR(); // Inicia el escaneo si los permisos son concedidos
        } else {
          setError('Permiso de cámara denegado. Habilítalo en la configuración.');
          setShowAlert(true);
          if (window.confirm('No es posible activar la cámara. ¿Deseas habilitar el permiso de cámara en la configuración?')) {
            await BarcodeScanner.openAppSettings(); // Abre la configuración de la aplicación
          }
        }
      } else {
        // En la web
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (stream) {
          leerQR(); // Inicia el escaneo si los permisos son concedidos
        } else {
          setError('Permiso de cámara denegado. Habilítalo en la configuración del navegador.');
          setShowAlert(true);
        }
      }
    } catch (err) {
      console.error('Error al solicitar permisos:', err);
      setError('Error al solicitar acceso a la cámara.');
      setShowAlert(true);
    }
  };

  // Función para iniciar el escaneo
  const leerQR = async () => {
    try {
      setScanning(true);
      if (isNative) {
        await BarcodeScanner.prepare(); // Prepara la cámara para escanear (solo en móvil)
      }
      const result = await BarcodeScanner.startScan(); // Empieza a escanear

      if (result?.hasContent) {
        setQrResult(result.content); // Guarda el resultado del QR
        navigateToResult(result.content); // Redirige a la URL escaneada
      } else {
        setError('No se detectó contenido en el código QR.');
        setShowAlert(true);
      }
    } catch (err) {
      console.error('Error al escanear:', err);
      setError(`Error al escanear: ${err.message}`);
      setShowAlert(true);
    } finally {
      // Apagar la cámara en todos los casos
      await stopCamera();
    }
  };

  // Función para redirigir a la URL escaneada
  const navigateToResult = async (url) => {
    try {
      // Verifica si la URL es válida
      const isValidUrl = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(url);
      if (isValidUrl) {
        window.location.href = url; // Redirige a la URL externa
      } else {
        // Si no es una URL válida, redirige a una ruta interna
        navigate(url); // Usa navigate para redirigir a una ruta interna
      }
    } catch (err) {
      console.error('Error al redirigir:', err);
      setError('Error al redirigir a la URL escaneada.');
      setShowAlert(true);
    } finally {
      // Apagar la cámara en todos los casos
      await stopCamera();
    }
  };

  // Función para detener la cámara
  const stopCamera = async () => {
    try {
      await BarcodeScanner.stopScan(); // Detiene el escaneo
      setScanning(false); // Cambia el estado de escaneo a falso
      setError(null); // Limpia cualquier error previo
    } catch (err) {
      console.error('Error al detener la cámara:', err);
      setError('Error al detener la cámara.');
      setShowAlert(true);
    }
  };

  // Limpiar recursos al desmontar el componente
  useEffect(() => {
    return () => {
      if (scanning) {
        stopCamera(); // Detenemos el escaneo si el componente se desmonta
      }
    };
  }, [scanning]);

  return (
    <div style={{ position: 'relative', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {/* Mostrar el botón para empezar a escanear si no estamos escaneando */}
      {!scanning && (
        <IonFabButton color="dark" onClick={requestCameraPermission}>
          <IonIcon icon={scan} />
        </IonFabButton>
      )}

      {/* Mostrar mensaje de error si ocurrió un problema */}
      {error && (
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={'Error'}
          message={error}
          buttons={['OK']}
        />
      )}

      {/* Si estamos escaneando, mostrar la cámara con el botón de cancelar */}
      {scanning && (
        <div>
          {/* La cámara se abrirá en pantalla completa */}
          <div
            style={{
              position: 'fixed', // Usamos fixed para cubrir toda la pantalla
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 10,
              backgroundColor: 'transparent',
            }}
          ></div>

          {/* Botón de cancelación en la parte inferior izquierda */}
          <button
            onClick={stopCamera}
            style={{
              position: 'fixed', // Usamos fixed para posicionar el botón
              bottom: '20px', // Posición en la parte inferior
              left: '20px', // Posición a la izquierda
              padding: '10px',
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              borderRadius: '50%', // Botón circular
              cursor: 'pointer',
              zIndex: 100, // Aseguramos que el botón esté por encima de la cámara
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '50px', // Tamaño del botón
              height: '50px', // Tamaño del botón
            }}
          >
            <IonIcon icon={close} style={{ fontSize: '24px' }} /> {/* Ícono de cierre */}
          </button>
        </div>
      )}

      {/* Mostrar el resultado del QR escaneado */}
      {qrResult && (
        <p>
          Resultado: <a href={qrResult} target="_blank" rel="noopener noreferrer">{qrResult}</a>
        </p>
      )}
    </div>
  );
}

export default Scanner;