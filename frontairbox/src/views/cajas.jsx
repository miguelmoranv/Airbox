import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
} from "@ionic/react";
import { add, ellipsisHorizontal, pencil, trash, closeCircle } from "ionicons/icons";
import { fetchCajas, fetchCajaById, createCaja, updateCaja, deleteCaja } from "../api/api"; // API ajustada para cajas
import logo from "../assets/img/logo.png";

function Cajas() {
  const [searchText, setSearchText] = useState("");
  const [cajas, setCajas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const { id_lote, no_serial } = useParams();
  const [newCaja, setNewCaja] = useState({
    no_parte: "",
    no_piezas: "",
    piezas_mal: "",
    piezas_bien: "",
    comentarios: "",
    fg_user: "", 
    fg_auxiliares: "", 
    fg_lote: id_lote, 
  });
  const [editCaja, setEditCaja] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const [actionSheetOpen, setActionSheetOpen] = useState(false);
  const [currentCaja, setCurrentCaja] = useState(null);
  const navigate = useNavigate();

  // Cargar cajas
  useEffect(() => {
    const loadCajas = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCajas(id_lote);
        
        // Verificar si la respuesta es un objeto y convertirlo en un array
        if (data && !Array.isArray(data)) {
          setCajas([data]);  // Convertir el objeto en un array de un solo elemento
        } else if (Array.isArray(data)) {
          setCajas(data);
        } else {
          console.error("La respuesta de la API no es válida:", data);
          setCajas([]); // Asignar un array vacío si la respuesta no es válida
        }
      } catch (error) {
        console.error("Error fetching cajas:", error);
        setShowToast({ show: true, message: "Error al cargar las cajas." });
        setCajas([]); // Asegúrate de asignar un array vacío en caso de error
      } finally {
        setIsLoading(false);
      }
    };
    loadCajas();
  }, [id_lote]); // Dependencia de id_lote para recargar los datos  
  
  // Manejar selección de caja para ver los detalles
  const handleViewCaja = (caja) => {
    setCurrentCaja(caja);
    setShowViewModal(true);
  };

  // Crear caja
  const handleCreateCaja = async () => {
    // Validar que el campo 'no_parte' no esté vacío
    if (!newCaja.no_parte.trim()) {
      setShowToast({ show: true, message: "Número de parte no puede estar vacío." });
      return;
    }
  
    // Verificar que 'id_lote' sea válido
    if (!id_lote) {
      console.error("El ID del lote es nulo o no válido:", id_lote);
      setShowToast({ show: true, message: "No se puede crear una caja sin un lote válido." });
      return;
    }
  
    try {
      // Preparar los datos de la caja
      const cajaToCreate = {
        ...newCaja,
        fg_lote: id_lote, // Asegura que el lote esté asociado correctamente
      };
  
      console.log("Datos que se enviarán para crear la caja:", cajaToCreate);
  
      // Llamar a la función 'createCaja' con los datos preparados
      const newCajaData = await createCaja(cajaToCreate, id_lote);

  
      // Actualizar el estado con la nueva caja creada
      setCajas((prevCajas) => [...prevCajas, newCajaData]);
      setShowToast({ show: true, message: "Caja creada exitosamente." });
  
      // Cerrar el modal y reiniciar el formulario
      setShowCreateModal(false);
      setNewCaja({
        no_parte: "",
        no_piezas: "",
        piezas_mal: "",
        piezas_bien: "",
        comentarios: "",
        fg_user: "",
        fg_auxiliares: "",
      });
    } catch (error) {
      console.error("Error creando la caja:", error);
      setShowToast({ show: true, message: "Error al crear la caja." });
    }
  };
  
  

  // Editar caja
  const handleEditCaja = async () => {
    try {
      await updateCaja(editCaja.id_caja, editCaja);
      setCajas(cajas.map((caja) => (caja.id_caja === editCaja.id_caja ? editCaja : caja)));
      setShowToast({ show: true, message: "Caja actualizada exitosamente." });
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating caja:", error);
      setShowToast({ show: true, message: "Error al actualizar la caja." });
    }
  };

  // Eliminar caja
  const handleDeleteCaja = async (id) => {
    try {
      await deleteCaja(id);
      setCajas(cajas.filter((caja) => caja.id_caja !== id));
      setShowToast({ show: true, message: "Caja eliminada exitosamente." });
    } catch (error) {
      console.error("Error deleting caja:", error);
      setShowToast({ show: true, message: "Error al eliminar la caja." });
    }
  };

  // Manejar selección de caja para editar
  const handleSelectCaja = async (caja) => {
    try {
      const data = await fetchCajaById(caja.id_caja);
      setEditCaja(data);
      setShowEditModal(true);
    } catch (error) {
      console.error("Error fetching caja by ID:", error);
      setShowToast({ show: true, message: "Error al cargar la caja." });
    }
  };

  const filteredCajas = cajas.filter((caja) =>
    caja.no_parte && caja.no_parte.toLowerCase().includes(searchText.toLowerCase())
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
        {!isLoading && (
        <IonHeader>
            <IonToolbar>
                <IonTitle style={{textAlign:'center'}}> {no_serial || "Cargando..."}</IonTitle>
            </IonToolbar>
        </IonHeader>
        )}
        <IonContent>
        {isLoading && (
            <div style={styles.loadingOverlay}>
                <div style={styles.loadingContainer}>
                    <img
                    src={logo} // Cambia la ruta a la imagen deseada
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
              placeholder="Buscar caja por No. Parte"
              style={styles.searchbar}
            />
            <IonGrid>
              <IonRow>
                {filteredCajas.map((caja) => (
                  <IonCol size="12" sizeMd="4" key={caja.id_caja}>
                    <IonCard style={styles.card} className="board-card">
                        <IonCardHeader>
                            <IonCardTitle style={textStyles}>{caja.no_parte}</IonCardTitle>
                            <IonIcon
                            icon={ellipsisHorizontal}
                            size="large"
                            onClick={(e) => {
                                e.stopPropagation();
                                setCurrentCaja(caja);
                                setActionSheetOpen(true);
                            }}
                            className="menu-icon"
                            style={styles.menuIcon}
                            />
                        </IonCardHeader>
                        <IonCardContent>
                          <p>Registrado por: {caja.user_nombre} {caja.user_apellido}</p>
                          <p>Auxiliar: {caja.auxiliar_nombre} {caja.auxiliar_apellido}</p>
                          <p>Piezas: {caja.piezas_bien}/{caja.no_piezas}</p>
                        </IonCardContent>
                        </IonCard>
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          </div>
        )}

        {/* Modal para crear */}
        <IonModal isOpen={showCreateModal} onDidDismiss={() => setShowCreateModal(false)}>
            <IonHeader>
                <IonToolbar>
                <IonTitle>Crear Caja</IonTitle>
                <IonButtons slot="end">
                    <IonButton onClick={() => setShowCreateModal(false)}>Cerrar</IonButton>
                </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>
                <IonItem>
                    <IonLabel position="floating" style={{ marginBottom: '20px' }}>Número de Parte</IonLabel>
                    <IonInput
                    value={newCaja.no_parte}
                    onIonInput={(e) => setNewCaja({ ...newCaja, no_parte: e.target.value })}
                    />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating" style={{ marginBottom: '20px' }}>No. Piezas</IonLabel>
                    <IonInput
                    value={newCaja.no_piezas}
                    onIonInput={(e) => setNewCaja({ ...newCaja, no_piezas: e.target.value })}
                    />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating" style={{ marginBottom: '20px' }}>Piezas Malas</IonLabel>
                    <IonInput
                    value={newCaja.piezas_mal}
                    onIonInput={(e) => setNewCaja({ ...newCaja, piezas_mal: e.target.value })}
                    />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating" style={{ marginBottom: '20px' }}>Piezas Buenas</IonLabel>
                    <IonInput
                    value={newCaja.piezas_bien}
                    onIonInput={(e) => setNewCaja({ ...newCaja, piezas_bien: e.target.value })}
                    />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating" style={{ marginBottom: '20px' }}>Comentarios</IonLabel>
                    <IonInput
                    value={newCaja.comentarios}
                    onIonInput={(e) => setNewCaja({ ...newCaja, comentarios: e.target.value })}
                    />
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Usuario Responsable (ID)</IonLabel>
                  <IonInput
                    value={newCaja.fg_user}
                    onIonInput={(e) => setNewCaja({ ...newCaja, fg_user: e.target.value })}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Auxiliar Responsable (ID)</IonLabel>
                  <IonInput
                    value={newCaja.fg_auxiliares}
                    onIonInput={(e) => setNewCaja({ ...newCaja, fg_auxiliares: e.target.value })}
                  />
                </IonItem>
                </IonList>
                <IonButton color="dark" expand="full" onClick={handleCreateCaja}>
                Crear Caja
                </IonButton>
            </IonContent>
            </IonModal>

        {/* Modal para ver los detalles de la caja */}
        <IonModal isOpen={showViewModal} onDidDismiss={() => setShowViewModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Detalles de Caja</IonTitle>
              <IonButton slot="end" onClick={() => setShowViewModal(false)}>Cerrar</IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            {currentCaja && (
              <IonList>
                <IonItem>
                  <IonLabel position="floating">Número de Parte</IonLabel>
                  <IonInput value={currentCaja.no_parte} readOnly />
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">No. Piezas</IonLabel>
                  <IonInput value={currentCaja.no_piezas} readOnly />
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Piezas Malas</IonLabel>
                  <IonInput value={currentCaja.piezas_mal} readOnly />
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Piezas Buenas</IonLabel>
                  <IonInput value={currentCaja.piezas_bien} readOnly />
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Comentarios</IonLabel>
                  <IonInput value={currentCaja.comentarios} readOnly />
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Usuario Responsable</IonLabel>
                  <IonInput value={currentCaja.fg_user} readOnly />
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Auxiliar Responsable</IonLabel>
                  <IonInput value={currentCaja.fg_auxiliares} readOnly />
                </IonItem>
              </IonList>
            )}
          </IonContent>
        </IonModal>


        {/* Acción rápida */}
        <IonActionSheet
          isOpen={actionSheetOpen}
          onDidDismiss={() => setActionSheetOpen(false)}
          buttons={[
            {
              text: "Editar",
              icon: pencil,
              handler: () => handleSelectCaja(currentCaja),
            },
            {
              text: "Eliminar",
              icon: trash,
              handler: () => handleDeleteCaja(currentCaja.id_caja),
            },
            {
              text: "Cancelar",
              icon: closeCircle,
              role: "cancel",
            },
          ]}
        />

        {!isLoading && (
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setShowCreateModal(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
        )}

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
    container: {
      maxWidth: "100%",
      margin: "0 auto",
      padding: "30px",
    },
    searchbar: {
      marginBottom: "20px",
    },
    card: {
      borderLeft: '10px solid var(--ion-color-dash)',
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

export default Cajas;