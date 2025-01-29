import React, { useState, useEffect } from 'react';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { useNavigate } from 'react-router-dom';
import { IonFabButton, IonIcon, IonAlert } from '@ionic/react';
import { scan } from 'ionicons/icons';

function Scanner() {
  const [scanning, setScanning] = useState(false); // Estado para verificar si está escaneando
  const [error, setError] = useState(null); // Estado para capturar cualquier error
  const [isCameraActive, setIsCameraActive] = useState(false); // Estado para verificar si la cámara está activa
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate(); // Hook para redirección

  // Función para solicitar permiso para usar la cámara
  const requestCameraPermission = async () => {
    try {
      const status = await BarcodeScanner.checkPermission({ force: true }); // Solicitar permisos explícitamente
      if (status.granted) {
        leerQR(); // Inicia el escaneo si los permisos son concedidos
      } else {
        setError('Permiso de cámara denegado. Habilítalo en la configuración.');
        setShowAlert(true);
        if (window.confirm('No es posible activar la cámara. ¿Deseas habilitar el permiso de cámara en la configuración?')) {
          // Lógica adicional si el usuario desea habilitar los permisos
          await BarcodeScanner.openAppSettings(); // Abre la configuración de la aplicación para habilitar permisos
        }
      }
    } catch (err) {
      console.error('Error al solicitar permisos:', err);
      setError('No es posible activar la cámara debido a un error.');
      setShowAlert(true);
    }
  };

  // Función para iniciar el escaneo
  const leerQR = async () => {
    try {
      setScanning(true);
      setIsCameraActive(true);
      await BarcodeScanner.prepare(); // Prepara la cámara para escanear
      const result = await BarcodeScanner.startScan(); // Empieza a escanear y obtiene el resultado

      if (result?.hasContent) {
        navigate(result.content); // Redirige a la URL obtenida del código QR
      } else {
        setError('No se detectó contenido en el código QR.');
        setShowAlert(true);
      }
    } catch (err) {
      console.error('Error al escanear:', err);
      setError('Error al escanear el código QR.');
      setShowAlert(true);
    } finally {
      setScanning(false);
      setIsCameraActive(false);
    }
  };

  // Función para detener el escaneo y apagar la cámara
  const cancelarEscaneo = async () => {
    try {
      await BarcodeScanner.stopScan(); // Detiene el escaneo
      setScanning(false); // Cambia el estado de escaneo a falso
      setIsCameraActive(false);
      setError(null); // Limpia cualquier error previo
    } catch (err) {
      console.error('Error al detener el escaneo:', err);
      setError('Error al detener el escaneo.');
      setShowAlert(true);
    }
  };

  // Limpiar recursos al desmontar el componente
  useEffect(() => {
    return () => {
      if (scanning) {
        BarcodeScanner.stopScan(); // Detenemos el escaneo si el componente se desmonta
      }
    };
  }, [scanning]);

  return (
    <div>

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
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 10,
              backgroundColor: 'transparent',
            }}
          ></div>

          {/* Botón de cancelación */}
          <button
            onClick={cancelarEscaneo}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              padding: '10px',
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              zIndex: 100,
            }}
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}

export default Scanner;
