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
  IonButtons,
  IonSpinner,
} from "@ionic/react";
import { add, ellipsisHorizontal, pencil, trash, closeCircle, logOut, chevronForwardOutline, chevronBackOutline } from "ionicons/icons";
import { fetchLotes, createLote, deleteLote, updateLote } from "../api/api";
import logo from '../assets/img/logo.png';
import Scanner from "../components/Scanner";

function Lotes() {
  const [searchText, setSearchText] = useState("");
  const [lotes, setLotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newNoSerial, setNewNoSerial] = useState("");
  const [editLoteId, setEditLoteId] = useState(null);
  const [editNoSerial, setEditNoSerial] = useState("");
  const [showToast, setShowToast] = useState(null);
  const [actionSheetOpen, setActionSheetOpen] = useState(false);
  const [currentLote, setCurrentLote] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lotesPerPage, setLotesPerPage] = useState(9);
  const navigate = useNavigate();
  

  // Cargar lotes
  useEffect(() => {
    const loadLotes = async () => {
      setIsLoading(true);
      try {
        const data = await fetchLotes();
        setLotes(data);
      } catch (error) {
        console.error("Error fetching lotes:", error);
        setShowToast({ show: true, message: "Error fetching lotes." });
      } finally {
        setIsLoading(false);
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
      setNewNoSerial("");
      setShowCreateModal(false);
      setShowToast({ show: true, message: "Lote creado exitosamente!" });
      window.location.reload(); // Reinicia la página
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
      setLotes(lotes.map((lote) => (lote.id_lote === editLoteId ? updatedLote : lote)));
      setEditNoSerial("");
      setEditLoteId(null);
      setShowEditModal(false);
      navigate('/Lotes');
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
      navigate('/Lotes');
    } catch (error) {
      console.error("Error deleting lote:", error);
      setShowToast({ show: true, message: "Error al eliminar el lote." });
    }
  };

  // Seleccionar lote
  const handleSelectLote = (lote) => {
    if (!lote) return; // Asegúrate de que el lote no sea null
    setCurrentLote(lote);
    setEditLoteId(lote.id_lote); // Establece el ID del lote para editar
    setEditNoSerial(lote.no_serial); // Establece el número de serie para editar
    setShowEditModal(true); // Abre la modal de edición
  };
  

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const filteredLotes = lotes.filter((lote) =>
    lote.no_serial && lote.no_serial.toLowerCase().includes(searchText.toLowerCase())
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

  useEffect(() => {
    const updateLotesPerPage = () => {
      if (window.innerWidth <= 768) { // En dispositivos móviles
        setLotesPerPage(4);
      } else { // En PC
        setLotesPerPage(9);
      }
    };

    updateLotesPerPage();
    window.addEventListener("resize", updateLotesPerPage);

    return () => {
      window.removeEventListener("resize", updateLotesPerPage);
    };
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastLote = currentPage * lotesPerPage;
  const indexOfFirstLote = indexOfLastLote - lotesPerPage;
  const currentLotes = filteredLotes.slice(indexOfFirstLote, indexOfLastLote);

  const totalPages = Math.ceil(filteredLotes.length / lotesPerPage);

  return (
    <IonPage>
      {!isLoading && (
    <IonHeader>
    <IonToolbar>
      <IonTitle style={{ textAlign: 'center' }}>Lotes</IonTitle>
  <IonFabButton slot="end" >
        <Scanner />
        </IonFabButton>
    </IonToolbar>
  </IonHeader>
      )}
      <IonContent>
      {isLoading && (
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
      )}

          {!isLoading && (
          <div style={styles.container}>
            <IonSearchbar
              value={searchText}
              onIonInput={(e) => setSearchText(e.target.value)}
              placeholder="Buscar por Lote"
              style={textStyles}
            />
            <IonGrid>
              <IonRow>
                {currentLotes.map((lote) => (
                  <IonCol size="12" sizeMd="4" key={lote.id_lote}>
                    <IonCard style={styles.card} className="board-card" onClick={() => navigate(`/Cajas/${lote.id_lote}/${lote.no_serial}`)}>
                      <IonCardHeader>
                        <IonCardTitle style={textStyles}>{lote.no_serial}</IonCardTitle>
                        <IonIcon
                          icon={ellipsisHorizontal}
                          size="large"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentLote(lote);
                            setActionSheetOpen(true);
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

            {/* Paginación */}
            <div style={styles.pagination}>
              <IonButton
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <IonIcon icon={chevronBackOutline} />
              </IonButton>
              <span style={{padding:'10px'}}> {currentPage} de {totalPages}  </span>
              <IonButton
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <IonIcon icon={chevronForwardOutline} />
              </IonButton>
            </div>
          </div>
        )}

        {/* Modal para crear */}
        <IonModal isOpen={showCreateModal} onDidDismiss={() => setShowCreateModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Crear Lote</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowCreateModal(false)}>Cerrar</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel position="floating" style={{marginBottom:'20px'}}>Número de Serie</IonLabel>
                <IonInput
                  value={newNoSerial}
                  onIonInput={(e) => setNewNoSerial(e.target.value)}
                />
              </IonItem>
            </IonList>
            <IonButton color='dark' expand="full" onClick={handleCreateLote}>
              Crear Lote
            </IonButton>
          </IonContent>
        </IonModal>

        {/* Modal para editar */}
        <IonModal isOpen={showEditModal} onDidDismiss={() => setShowEditModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Editar Lote</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowEditModal(false)}>Cerrar</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel position="floating" style={{marginBottom:'20px'}}>Número de Serie</IonLabel>
                <IonInput
                  value={editNoSerial}
                  onIonInput={(e) => setEditNoSerial(e.target.value)}
                />
              </IonItem>
            </IonList>
            <IonButton color='dark' expand="full" onClick={handleEditLote}>
              Actualizar Lote
            </IonButton>
          </IonContent>
        </IonModal>

        <IonToast
          isOpen={!!showToast}
          message={showToast?.message}
          duration={2000}
          onDidDismiss={() => setShowToast(null)}
        />
        {!isLoading && (
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color='dark' onClick={() => setShowCreateModal(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
          <IonFabButton color="danger" onClick={handleLogout} style={styles.logoutButton}>
            <IonIcon icon={logOut} />
          </IonFabButton>
        </IonFab>
        )}

        <IonActionSheet
          isOpen={actionSheetOpen}
          onDidDismiss={() => setActionSheetOpen(false)}
          buttons={[
            {
              text: "Editar",
              icon: pencil,
              handler: () => {
                if (currentLote) {
                  handleSelectLote(currentLote); // Configura el lote actual
                }
              },
            },
            {
              text: "Eliminar",
              icon: trash,
              handler: () => {
                if (currentLote) {
                  handleDeleteLote(currentLote.id_lote);
                }
              },
            },
            {
              text: "Cancelar",
              icon: closeCircle,
              role: "cancel",
            },
          ]}
          cssClass={isDarkTheme ? "action-sheet-dark" : "action-sheet-light"}
        />
        <div className="espacio"></div>
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

export default Lotes;
