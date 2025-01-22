import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonInput,
  IonModal,
  IonToast,
  IonFab,
  IonFabButton,
  IonIcon,
} from "@ionic/react";
import { add, trash, create } from "ionicons/icons";
import {
  getAuxiliares,
  createAuxiliar,
  updateAuxiliar,
  deleteAuxiliar,
} from "../api/api";
import { useUser } from "../context/UserContext";

const Auxiliares = () => {
  const [auxiliares, setAuxiliares] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAuxiliar, setSelectedAuxiliar] = useState(null);
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [noEmpleado, setNoEmpleado] = useState("");
  const [fgUsers, setFgUsers] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // Cargar los auxiliares al montar el componente
  useEffect(() => {
    fetchAuxiliares();
  }, []);

  const fetchAuxiliares = async () => {
    try {
      const data = await getAuxiliares();
      setAuxiliares(data);
    } catch (error) {
      setToastMessage("Error al cargar los auxiliares");
    }
  };

  const handleSave = async () => {
    if (!nombre || !apellidos || !noEmpleado || !fgUsers) {
      setToastMessage("Todos los campos son obligatorios");
      return;
    }

    try {
      if (selectedAuxiliar) {
        // Editar un auxiliar
        await updateAuxiliar(selectedAuxiliar.id_auxiliar, {
          nombre_auxiliar: nombre,
          apellidos_auxiliar: apellidos,
          no_empleado_auxiliar: noEmpleado,
          fg_users: fgUsers,
        });
        setToastMessage("Auxiliar actualizado con éxito");
      } else {
        // Crear un nuevo auxiliar
        await createAuxiliar({
          nombre_auxiliar: nombre,
          apellidos_auxiliar: apellidos,
          no_empleado_auxiliar: noEmpleado,
          fg_users: fgUsers,
        });
        setToastMessage("Auxiliar creado con éxito");
      }
      fetchAuxiliares();
      closeModal();
    } catch (error) {
      setToastMessage("Error al guardar el auxiliar");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAuxiliar(id);
      setToastMessage("Auxiliar eliminado con éxito");
      fetchAuxiliares();
    } catch (error) {
      setToastMessage("Error al eliminar el auxiliar");
    }
  };

  const openModal = (auxiliar = null) => {
    setSelectedAuxiliar(auxiliar);
    setNombre(auxiliar ? auxiliar.nombre_auxiliar : "");
    setApellidos(auxiliar ? auxiliar.apellidos_auxiliar : "");
    setNoEmpleado(auxiliar ? auxiliar.no_empleado_auxiliar : "");
    setFgUsers(auxiliar ? auxiliar.fg_users : "");
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedAuxiliar(null);
    setNombre("");
    setApellidos("");
    setNoEmpleado("");
    setFgUsers("");
    setModalOpen(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Gestión de Auxiliares</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList>
          {auxiliares.map((auxiliar) => (
            <IonItem key={auxiliar.id_auxiliar}>
              <IonLabel>
                <h2>{auxiliar.nombre_auxiliar} {auxiliar.apellidos_auxiliar}</h2>
                <p>No. Empleado: {auxiliar.no_empleado_auxiliar}</p>
                <p>Fg Users: {auxiliar.fg_users}</p>
              </IonLabel>
              <IonButton slot="end" color="dark" onClick={() => openModal(auxiliar)}>
                <IonIcon icon={create} />
              </IonButton>
              <IonButton slot="end" color="danger" onClick={() => handleDelete(auxiliar.id_auxiliar)}>
                <IonIcon icon={trash} />
              </IonButton>
            </IonItem>
          ))}
        </IonList>

        {/* Botón flotante para agregar */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color='dark' onClick={() => openModal()}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        {/* Modal para agregar/editar */}
        <IonModal isOpen={modalOpen} onDidDismiss={closeModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{selectedAuxiliar ? "Editar Auxiliar" : "Agregar Auxiliar"}</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel position="floating" style={{marginBottom:'20px'}}>Nombre</IonLabel>
                <IonInput
                  value={nombre}
                  onIonChange={(e) => setNombre(e.detail.value)}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="floating" style={{marginBottom:'20px'}}>Apellidos</IonLabel>
                <IonInput
                  value={apellidos}
                  onIonChange={(e) => setApellidos(e.detail.value)}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="floating" style={{marginBottom:'20px'}}>No. Empleado</IonLabel>
                <IonInput
                  value={noEmpleado}
                  onIonChange={(e) => setNoEmpleado(e.detail.value)}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="floating" style={{marginBottom:'20px'}}>Fg Users</IonLabel>
                <IonInput
                  value={fgUsers}
                  onIonChange={(e) => setFgUsers(e.detail.value)}
                />
              </IonItem>
            </IonList>
            <IonButton expand="full" color='dark' onClick={handleSave}>
              Guardar
            </IonButton>
            <IonButton expand="full" color="light" onClick={closeModal}>
              Cancelar
            </IonButton>
          </IonContent>
        </IonModal>

        {/* Toast para notificaciones */}
        <IonToast
          isOpen={!!toastMessage}
          message={toastMessage}
          duration={2000}
          onDidDismiss={() => setToastMessage("")}
        />
      </IonContent>
    </IonPage>
  );
};

export default Auxiliares;
