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
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { add, trash, create } from "ionicons/icons";
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from "../api/api";
import { Tab } from "../components/Tab"


const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [noEmpleado, setNoEmpleado] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [rol, setRol] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (error) {
      setToastMessage("Error al cargar los usuarios");
    }
  };

  const handleSave = async () => {
    if (!nombres || !apellidos || !noEmpleado || !contrasena || !rol) {
      setToastMessage("Todos los campos son obligatorios");
      return;
    }

    try {
      if (selectedUsuario) {
        // Editar un usuario
        await updateUsuario(selectedUsuario.id_user, {
          nombres_users: nombres,
          apellidos_users: apellidos,
          no_empleado_users: noEmpleado,
          contrasena: contrasena,
          rol: rol,
        });
        setToastMessage("Usuario actualizado con éxito");
      } else {
        await createUsuario({
          nombres_users: nombres,
          apellidos_users: apellidos,
          no_empleado_users: noEmpleado,
          contrasena: contrasena,
          rol: rol,
        });
        setToastMessage("Usuario creado con éxito");
      }
      fetchUsuarios();
      closeModal();
    } catch (error) {
      setToastMessage("Error al guardar el usuario");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUsuario(id);
      setToastMessage("Usuario eliminado con éxito");
      fetchUsuarios();
    } catch (error) {
      setToastMessage("Error al eliminar el usuario");
    }
  };

  const openModal = (usuario = null) => {
    setSelectedUsuario(usuario);
    setNombres(usuario ? usuario.nombres_users : "");
    setApellidos(usuario ? usuario.apellidos_users : "");
    setNoEmpleado(usuario ? usuario.no_empleado_users : "");
    setContrasena(usuario ? usuario.contrasena : "");
    setRol(usuario ? usuario.rol : "");
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUsuario(null);
    setNombres("");
    setApellidos("");
    setNoEmpleado("");
    setContrasena("");
    setRol("");
    setModalOpen(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Gestión de Usuarios</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList>
          {usuarios.map((usuario) => (
            <IonItem key={usuario.id_user}>
              <IonLabel>
                <h2>{usuario.nombres_users} {usuario.apellidos_users}</h2>
                <p>No. Empleado: {usuario.no_empleado_users}</p>
                <p>Rol: {usuario.rol}</p>
              </IonLabel>
              <IonButton slot="end" color="dark" onClick={() => openModal(usuario)}>
                <IonIcon icon={create} />
              </IonButton>
              <IonButton slot="end" color="danger" onClick={() => handleDelete(usuario.id_user)}>
                <IonIcon icon={trash} />
              </IonButton>
            </IonItem>
          ))}
        </IonList>

        <IonFab vertical="bottom" horizontal="end" slot="fixed" style={{marginBottom:'70px'}}>
          <IonFabButton color='dark' onClick={() => openModal()}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <IonModal isOpen={modalOpen} onDidDismiss={closeModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{selectedUsuario ? "Editar Usuario" : "Agregar Usuario"}</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel position="floating">Nombres</IonLabel>
                <IonInput
                  value={nombres}
                  onIonChange={(e) => setNombres(e.detail.value)}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Apellidos</IonLabel>
                <IonInput
                  value={apellidos}
                  onIonChange={(e) => setApellidos(e.detail.value)}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">No. Empleado</IonLabel>
                <IonInput
                  type="number"
                  value={noEmpleado}
                  onIonChange={(e) => setNoEmpleado(e.detail.value)}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Contraseña</IonLabel>
                <IonInput
                  type="password"
                  value={contrasena}
                  onIonChange={(e) => setContrasena(e.detail.value)}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Rol</IonLabel>
                <IonSelect
                  value={rol}
                  placeholder="Selecciona un rol"
                  onIonChange={(e) => setRol(e.detail.value)}
                >
                  <IonSelectOption value="admin">Admin</IonSelectOption>
                  <IonSelectOption value="user">Usuario</IonSelectOption>
                </IonSelect>
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

        <IonToast
          isOpen={!!toastMessage}
          message={toastMessage}
          duration={2000}
          onDidDismiss={() => setToastMessage("")}
        />
        <Tab />
      </IonContent>
    </IonPage>
  );
};

export default Usuarios;