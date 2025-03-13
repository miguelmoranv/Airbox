import React, {useEffect} from "react";
import { IonContent, IonPage, IonImg, IonText, IonSpinner } from '@ionic/react';
import { useNavigate } from 'react-router-dom';

import logo from '../assets/img/logo.png';

function Splash () {

    const navigate = useNavigate();

    useEffect(() => {
      const user = localStorage.getItem('user');
  
      setTimeout(() => {
        if (user) {
          //Movil
          //verifyIdentity();
  
          //web
          navigate('/Lotes');
        } else {
          navigate('/Login');
        }
      }, 3000); // 3000 ms = 3 segundos
    }, [navigate]);
  return (
    <>
     <div style={styles.loadingOverlay}>
              <div style={styles.loadingContainer}>
                <img
                  src={logo} 
                  alt="Cargando"
                  style={styles.loadingImage}
                />
                <p style={styles.loadingText}><IonSpinner /></p>
                
              </div>
            </div>
    </>
  );
}

const styles = {
    container: {
      maxWidth: "100%",
      margin: "0 auto",
      padding: "30px",
    },
    card: {
      borderLeft: `10px solid var(--ion-color-dash)`,
      marginBottom: "20px",
    },
    pagination: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: "20px",
    },
    cardTitle: {
      fontSize: "20px",
      fontWeight: "bold",
    },
    menuIcon: {
      cursor: "pointer",
      float: "right",
    },
    logoutButton: {
      marginTop: "10px",
    },
    loadingOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      alignItems: "center", // Centrado vertical
      justifyContent: "center", // Centrado horizontal
      zIndex: 1000,
    },
    loadingContainer: {
      textAlign: "center", // Centra el contenido dentro del contenedor
    },
    loadingImage: {
      width: "150px", // Ajusta el tamaño de la imagen
      height: "150px",
      marginBottom: "20px", // Espacio entre la imagen y el texto
    },
    loadingText: {
      fontSize: "18px",
      marginBottom: "10px",
    },
  };

export default Splash;