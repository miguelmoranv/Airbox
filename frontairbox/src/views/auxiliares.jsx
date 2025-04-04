import { useState, useEffect } from "react";
import { getAuxiliares, createAuxiliar, updateAuxiliar, deleteAuxiliar, getUsuarios } from "../api/api";
import { Tab } from "../components/Tab";
import "../styles/usuarios.css";

const Auxiliares = () => {
  const [auxiliares, setAuxiliares] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAuxiliar, setSelectedAuxiliar] = useState(null);
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [noEmpleado, setNoEmpleado] = useState("");
  const [fgUsers, setFgUsers] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    fetchAuxiliares();
    fetchUsuarios(); 
  }, []);

  const fetchAuxiliares = async () => {
    try {
      const data = await getAuxiliares();
      setAuxiliares(data);
    } catch (error) {
      showToast("Error al cargar los auxiliares");
    }
  };

  const fetchUsuarios = async () => {
    try {
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (error) {
      showToast("Error al cargar los usuarios");
    }
  };

  const handleSave = async () => {
    if (!nombre || !apellidos || !noEmpleado || !fgUsers) {
      showToast("Todos los campos son obligatorios");
      return;
    }

    try {
      if (selectedAuxiliar) {
        await updateAuxiliar(selectedAuxiliar.id_auxiliar, {
          nombre_auxiliar: nombre,
          apellidos_auxiliar: apellidos,
          no_empleado_auxiliar: noEmpleado,
          fg_users: fgUsers,
        });
        showToast("Auxiliar actualizado con éxito");
      } else {
        await createAuxiliar({
          nombre_auxiliar: nombre,
          apellidos_auxiliar: apellidos,
          no_empleado_auxiliar: noEmpleado,
          fg_users: fgUsers,
        });
        showToast("Auxiliar creado con éxito");
      }
      fetchAuxiliares();
      closeModal();
    } catch (error) {
      showToast("Error al guardar el auxiliar");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAuxiliar(id);
      showToast("Auxiliar eliminado con éxito");
      fetchAuxiliares();
    } catch (error) {
      showToast("Error al eliminar el auxiliar");
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

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage("");
    }, 2000);
  };

  return (
    <div className="vu-page-container">
      <header className="vu-page-header">
        <h1 className="vu-header-title">Gestión de Auxiliares</h1>
      </header>

      <main className="vu-main-content">
        <ul className="vu-user-list">
          {auxiliares.map((auxiliar) => (
            <li key={auxiliar.id_auxiliar} className="vu-user-item">
              <div className="vu-user-info">
                <h2 className="vu-user-name">
                  {auxiliar.nombre_auxiliar} {auxiliar.apellidos_auxiliar}
                </h2>
                <p className="vu-user-detail">No. Empleado: {auxiliar.no_empleado_auxiliar}</p>
                <p className="vu-user-detail">Fg Users: {auxiliar.fg_users}</p>
              </div>
              <div className="vu-user-actions">
                <button
                  className="vu-btn vu-btn-icon vu-btn-dark"
                  onClick={() => openModal(auxiliar)}
                  aria-label="Editar auxiliar"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button
                  className="vu-btn vu-btn-icon vu-btn-danger"
                  onClick={() => handleDelete(auxiliar.id_auxiliar)}
                  aria-label="Eliminar auxiliar"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="vu-fab">
          <button className="vu-fab-button" onClick={() => openModal()} aria-label="Agregar auxiliar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="vu-fab-icon"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>

        {modalOpen && (
        <div className="vu-modal-backdrop" onClick={closeModal}>
          <div className="vu-modal" onClick={(e) => e.stopPropagation()}>
            <div className="vu-modal-header">
              <h2 className="vu-modal-title">{selectedAuxiliar ? "Editar Auxiliar" : "Agregar Auxiliar"}</h2>
            </div>
            <div className="vu-modal-content">
              <div className="vu-form-list">
                <div className="vu-form-item">
                  <label className="vu-form-label" htmlFor="nombre">
                    Nombre
                  </label>
                  <input
                    id="nombre"
                    className="vu-form-input"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>
                <div className="vu-form-item">
                  <label className="vu-form-label" htmlFor="apellidos">
                    Apellidos
                  </label>
                  <input
                    id="apellidos"
                    className="vu-form-input"
                    type="text"
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                  />
                </div>
                <div className="vu-form-item">
                  <label className="vu-form-label" htmlFor="noEmpleado">
                    No. Empleado
                  </label>
                  <input
                    id="noEmpleado"
                    className="vu-form-input"
                    type="number"
                    value={noEmpleado}
                    onChange={(e) => setNoEmpleado(e.target.value)}
                  />
                </div>
                <div className="vu-form-item">
                  <label className="vu-form-label" htmlFor="fgUsers">
                    Usuario
                  </label>
                  <select
                    id="fgUsers"
                    className="vu-form-input"
                    value={fgUsers}
                    onChange={(e) => setFgUsers(e.target.value)}
                  >
                    <option value="">Seleccione un usuario</option>
                    {usuarios.map((usuario) => (
                      <option key={usuario.id_users} value={usuario.id_users}>
                        {usuario.nombre_users} {usuario.apellidos_users}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button className="vu-btn vu-btn-dark vu-btn-full" onClick={handleSave}>
                Guardar
              </button>
              <button className="vu-btn vu-btn-light vu-btn-full" onClick={closeModal}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

        {toastMessage && <div className="vu-toast">{toastMessage}</div>}
        <Tab />
      </main>
    </div>
  );
};

export default Auxiliares;