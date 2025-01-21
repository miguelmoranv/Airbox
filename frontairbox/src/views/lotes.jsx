import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonModal,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonToast,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import { logOut, add } from "ionicons/icons";

function Lotes() {
  const [showModal, setShowModal] = useState(false);
  const [newLoteName, setNewLoteName] = useState("");
  const [lotes, setLotes] = useState([]);
  const [showToast, setShowToast] = useState(null);

  const handleExit = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const handleCreateLote = () => {
    if (!newLoteName.trim()) {
      setShowToast({ show: true, message: "El nombre del lote no puede estar vacío." });
      return;
    }

    const newLote = { id: Date.now(), name: newLoteName };
    setLotes([...lotes, newLote]);
    setNewLoteName("");
    setShowModal(false);
    setShowToast({ show: true, message: "¡Lote creado exitosamente!" });
  };

  return (
    <IonPage>
      <IonHeader>
        <nav style={styles.navbar}>
          <h1 style={styles.navbarTitle}>Lotes</h1>
        </nav>
      </IonHeader>
      <IonContent>
        <div style={styles.container}>
          <IonGrid>
            <IonRow>
              {lotes.map((lote) => (
                <IonCol size="12" sizeMd="4" key={lote.id}>
                  <IonCard
                    button
                    style={{
                      borderLeft: `5px solid #3b82f6`,
                      marginBottom: "20px",
                    }}
                    onClick={() => console.log(`Lote: ${lote.name} clicked`)}
                  >
                    <IonCardHeader>
                      <IonCardTitle style={styles.cardTitle}>
                        {lote.name}
                      </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      {/* Agrega aquí contenido adicional para el lote */}
                      Detalles del lote
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        </div>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color="primary" onClick={() => setShowModal(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
          <IonFabButton color="danger" onClick={handleExit} style={{ marginTop: "10px" }}>
            <IonIcon icon={logOut} />
          </IonFabButton>
        </IonFab>

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>Crear Lote</h2>
            <IonList>
              <IonItem>
                <IonLabel position="floating">Nombre del Lote</IonLabel>
                <IonInput
                  value={newLoteName}
                  onIonInput={(e) => setNewLoteName(e.target.value)}
                />
              </IonItem>
            </IonList>
            <IonButton expand="full" onClick={handleCreateLote}>
              Crear
            </IonButton>
            <IonButton expand="full" color="light" onClick={() => setShowModal(false)}>
              Cancelar
            </IonButton>
          </div>
        </IonModal>

        <IonToast
          isOpen={!!showToast}
          message={showToast?.message}
          duration={2000}
          onDidDismiss={() => setShowToast(null)}
        />
      </IonContent>
    </IonPage>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px 20px",
    background: "#333",
    color: "#ffffff",
  },
  navbarTitle: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "bold",
  },
  container: {
    maxWidth: "100%",
    margin: "0 auto",
    padding: "30px",
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#333",
  },
  modalContent: {
    padding: "20px",
    textAlign: "center",
  },
  modalTitle: {
    fontSize: "22px",
    marginBottom: "20px",
  },
};

export default Lotes;
