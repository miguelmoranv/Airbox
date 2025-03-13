import React, { useEffect } from 'react';
import { IonContent, IonPage, IonSpinner } from '@ionic/react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Después de 2 segundos, redirigimos al usuario al inicio
    const timer = setTimeout(() => {
      navigate('/'); // Redirige a la página de inicio
    }, 2000); // 2 segundos de espera antes de redirigir

    // Limpiar el temporizador si el componente se desmonta antes de que se complete
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <IonPage>
      <IonContent>
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h2>Página no encontrada</h2>
          <p>Redirigiendo al inicio...</p>
          {/* Spinner de carga mientras redirige */}
          <IonSpinner name="crescent" />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default NotFound;