import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonModal,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonFab,
  IonFabButton,
  IonIcon,
  IonToast,
  IonActionSheet,
  IonSearchbar,
  IonSpinner,
  IonButtons,
  IonAlert
} from "@ionic/react";
import { fetchCajaById } from '../api/api';
import { add, ellipsisHorizontal, pencil, trash, closeCircle, arrowBack } from "ionicons/icons";
import { IonLoading } from '@ionic/react';

function ViewCajas() {
  const { id_cajas } = useParams();  // Obtener el id de las cajas desde los parámetros de la ruta
  const [caja, setCaja] = useState(null);  // Estado para almacenar la caja
  const [loading, setLoading] = useState(true);  // Estado para manejar la carga
  const [error, setError] = useState(null);  // Estado para manejar errores
  const navigate = useNavigate();


  // Fetch de los datos de la caja desde la API
  useEffect(() => {
    const fetchCaja = async () => {
      try {
        const data = await fetchCajaById(id_cajas);  // Llamada a la API para obtener la caja
        setCaja(data);  // Almacenar la respuesta
        setLoading(false);  // Finalizar la carga
      } catch (err) {
        setError('Hubo un error al cargar la caja.');
        setLoading(false);  // Finalizar la carga en caso de error
      }
    };

    fetchCaja();
  }, [id_cajas]);  // Ejecutar cada vez que cambie el id_cajas

  return (
    <IonPage>
      <IonHeader>
            <IonToolbar>
                  <IonFab slot="start">
                    <IonFabButton color='dark' onClick={() => navigate(-1)}>
                      <IonIcon icon={arrowBack} />
                    </IonFabButton>
                  </IonFab>
                <IonTitle style={{textAlign:'center'}}>Datos</IonTitle>
            </IonToolbar>
        </IonHeader>
      <IonContent>
        {loading && <IonLoading isOpen={loading} message={"Cargando..."} />}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* Si los datos están disponibles, mostrar la información de la caja */}
        {caja && (
          <IonList>
            <IonItem>
              <IonLabel>
                <h2>ID Caja</h2>
                <p>{caja.id_caja}</p>
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonLabel>
                <h2>No. Parte</h2>
                <p>{caja.no_parte}</p>
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonLabel>
                <h2>No. Piezas</h2>
                <p>{caja.no_piezas}</p>
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonLabel>
                <h2>Piezas Mal</h2>
                <p>{caja.piezas_mal}</p>
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonLabel>
                <h2>Piezas Bien</h2>
                <p>{caja.piezas_bien}</p>
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonLabel>
                <h2>Comentarios</h2>
                <p>{caja.comentarios}</p>
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonLabel>
                <h2>Fecha y Hora</h2>
                <p>{new Date(caja.fecha_hora).toLocaleString()}</p>
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonLabel>
                <h2>Nombre Usuario</h2>
                <p>{caja.user_nombre} {caja.user_apellido}</p>
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonLabel>
                <h2>Auxiliar</h2>
                <p>{caja.auxiliar_nombre} {caja.auxiliar_apellido}</p>
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonLabel>
                <h2>Lote No. Serial</h2>
                <p>{caja.lote_no_serial}</p>
              </IonLabel>
            </IonItem>
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
}

export default ViewCajas;
