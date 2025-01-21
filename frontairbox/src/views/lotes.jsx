import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  IonAlert,
  IonButtons,
} from "@ionic/react";
import { add, ellipsisHorizontal, pencil, trash, closeCircle, logOut } from "ionicons/icons";
import { fetchLotes, createLote, deleteLote, updateLote } from "../api/api";

function Lotes() {
  const [searchText, setSearchText] = useState("");
  const [lotes, setLotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newNoSerial, setNewNoSerial] = useState("");
  const [editLoteId, setEditLoteId] = useState(null);
  const [editNoSerial, setEditNoSerial] = useState("");
  const [showToast, setShowToast] = useState(null);
  const [actionSheetOpen, setActionSheetOpen] = useState(false);
  const [currentLote, setCurrentLote] = useState(null);
  const navigate = useNavigate();

  // Cargar lotes
  useEffect(() => {
    const loadLotes = async () => {
      try {
        const data = await fetchLotes();
        setLotes(data);
      } catch (error) {
        console.error("Error fetching lotes:", error);
        setShowToast({ show: true, message: "Error fetching lotes." });
      }
    };

    loadLotes();
  }, []);

  // Crear un nuevo lote
  const handleCreateLote = async () => {
    if (!newNoSerial.trim()) {
      setShowToast({ show: true, message: "Número de serie no puede estar vacío." });
      return;
    }

    try {
      const newLote = await createLote(newNoSerial);
      setLotes([...lotes, newLote]);
      setNewNoSerial("");
      setShowModal(false);
      setShowToast({ show: true, message: "Lote creado exitosamente!" });
    } catch (error) {
      console.error("Error creating lote:", error);
      setShowToast({ show: true, message: "Error al crear el lote." });
    }
  };

  // Editar lote
  const handleEditLote = async () => {
    if (!editNoSerial.trim()) {
      setShowToast({ show: true, message: "Número de serie no puede estar vacío." });
      return;
    }

    try {
      const updatedLote = await updateLote(editLoteId, editNoSerial);
      setLotes(lotes.map(lote => lote.id_lote === editLoteId ? updatedLote : lote));
      setEditNoSerial("");
      setEditLoteId(null);
      setShowToast({ show: true, message: "Lote actualizado exitosamente!" });
    } catch (error) {
      console.error("Error updating lote:", error);
      setShowToast({ show: true, message: "Error al actualizar el lote." });
    }
  };

  // Eliminar lote
  const handleDeleteLote = async (id) => {
    try {
      await deleteLote(id);
      setLotes(lotes.filter((lote) => lote.id_lote !== id));
      setShowToast({ show: true, message: "Lote eliminado exitosamente!" });
    } catch (error) {
      console.error("Error deleting lote:", error);
      setShowToast({ show: true, message: "Error al eliminar el lote." });
    }
  };

  // Seleccionar lote
  const handleSelectLote = (lote) => {
    setCurrentLote(lote);
    setActionSheetOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const filteredLotes = lotes.filter((lote) => 
    lote.no_serial.toLowerCase().includes(searchText.toLowerCase())
  );

  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const handleThemeChange = (event) => {
      setIsDarkTheme(event.matches);
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkTheme(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleThemeChange);
    };
  }, []);

  const textStyles = {
    color: isDarkTheme ? "#e0e0e0" : "#000000",
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Lotes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div style={styles.container}>
          <IonSearchbar
            value={searchText}
            onIonInput={(e) => setSearchText(e.target.value)}
            placeholder="Buscar lote..."
            style={styles.searchbar}
          />
          <IonGrid>
            <IonRow>
              {filteredLotes.map((lote) => (
                <IonCol size="12" sizeMd="4" key={lote.id_lote}>
                  <IonCard style={styles.card}>
                    <IonCardHeader>
                      <IonCardTitle style={textStyles}>{lote.no_serial}</IonCardTitle>
                      <IonIcon
                        icon={ellipsisHorizontal}
                        size="large"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditLoteId(lote.id_lote);
                          setEditNoSerial(lote.no_serial);
                          setActionSheetOpen(true); // Abre el modal al hacer clic en el ícono
                        }}
                        className="menu-icon"
                        style={styles.menuIcon}
                      />
                    </IonCardHeader>
                    <IonCardContent>Total Cajas: {lote.total_cajas}</IonCardContent>
                  </IonCard>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        </div>

        <IonModal
          isOpen={showModal}
          onDidDismiss={() => setShowModal(false)} // Garantiza que se cierre al hacer clic afuera o programáticamente
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>{editLoteId ? "Editar Lote" : "Crear Lote"}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}>Cerrar</IonButton> {/* Asegura que se cierre al hacer clic */}
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel position="floating">Número de Serie</IonLabel>
                <IonInput
                  value={editLoteId ? editNoSerial : newNoSerial}
                  onIonInput={(e) =>
                    editLoteId
                      ? setEditNoSerial(e.target.value)
                      : setNewNoSerial(e.target.value)
                  }
                />
              </IonItem>
            </IonList>
            <IonButton
              expand="full"
              onClick={editLoteId ? handleEditLote : handleCreateLote}
            >
              {editLoteId ? "Actualizar Lote" : "Crear Lote"}
            </IonButton>
          </IonContent>
        </IonModal>

        <IonToast
          isOpen={!!showToast}
          message={showToast?.message}
          duration={2000}
          onDidDismiss={() => setShowToast(null)}
        />

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color='var(--ion-color-dash)' onClick={() => setShowModal(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
          <IonFabButton color="danger" onClick={handleLogout} style={styles.logoutButton}>
            <IonIcon icon={logOut} />
          </IonFabButton>
        </IonFab>

        <IonActionSheet
          isOpen={actionSheetOpen}
          onDidDismiss={() => setActionSheetOpen(false)}
          buttons={[
            {
              text: "Editar",
              icon: pencil,
              handler: () => {
                setEditLoteId(currentLote.id_lote);
                setEditNoSerial(currentLote.no_serial);
                setShowModal(true);
              },
            },
            {
              text: "Eliminar",
              icon: trash,
              handler: () => handleDeleteLote(currentLote.id_lote),
            },
            {
              text: "Cancelar",
              icon: closeCircle,
              role: "cancel",
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
}

const styles = {
  container: {
    maxWidth: "100%",
    margin: "0 auto",
    padding: "30px",
  },
  searchbar: {
    marginBottom: "20px",
  },
  card: {
    borderLeft: `10px solid var(--ion-color-dash)`,
    marginBottom: "20px",
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
};

export default Lotes;
