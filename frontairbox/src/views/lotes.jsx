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
import { logOut, add, trash } from "ionicons/icons";
import { fetchLotes, createLote, deleteLote } from "../api/api";

function Lotes() {
  const [lotes, setLotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newNoSerial, setNewNoSerial] = useState("");
  const [showToast, setShowToast] = useState(null);

  useEffect(() => {
    fetchLotesData();
  }, []);

  const fetchLotesData = async () => {
    try {
      const data = await fetchLotes();
      setLotes(data);
    } catch (error) {
      console.error(error);
      setShowToast({ show: true, message: "Error al cargar los lotes." });
    }
  };

  const handleCreateLote = async () => {
    if (!newNoSerial.trim()) {
      setShowToast({ show: true, message: "El número de serie no puede estar vacío." });
      return;
    }

    try {
      const newLote = await createLote(newNoSerial);
      setLotes([...lotes, newLote]);
      setNewNoSerial("");
      setShowModal(false);
      setShowToast({ show: true, message: "¡Lote creado exitosamente!" });
    } catch (error) {
      console.error(error);
      setShowToast({ show: true, message: "Error al crear el lote." });
    }
  };

  const handleDeleteLote = async (id) => {
    try {
      await deleteLote(id);
      setLotes(lotes.filter((lote) => lote._id !== id));
      setShowToast({ show: true, message: "Lote eliminado correctamente." });
    } catch (error) {
      console.error(error);
      setShowToast({ show: true, message: "Error al eliminar el lote." });
    }
  };

  const handleExit = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
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
                <IonCol size="12" sizeMd="4" key={lote._id}>
                  <IonCard
                    style={{
                      borderLeft: `5px solid #3b82f6`,
                      marginBottom: "20px",
                    }}
                  >
                    <IonCardHeader>
                      <IonCardTitle style={styles.cardTitle}>
                        {lote.no_serial}
                      </IonCardTitle>
                      <IonIcon
                        icon={trash}
                        color="danger"
                        style={{ cursor: "pointer", float: "right" }}
                        onClick={() => handleDeleteLote(lote._id)}
                      />
                    </IonCardHeader>
                    <IonCardContent>
                      {/* Aquí puedes agregar más información del lote */}
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
                <IonLabel position="floating" style={{marginBottom:'10px'}}>Número de Serie</IonLabel>
                <IonInput
                  value={newNoSerial}
                  onIonInput={(e) => setNewNoSerial(e.target.value)}
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
