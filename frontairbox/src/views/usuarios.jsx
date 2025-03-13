import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario } from "../api/api"
import { Tab } from "../components/Tab"
import "../styles/usuarios.css"

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedUsuario, setSelectedUsuario] = useState(null)
  const [nombres, setNombres] = useState("")
  const [apellidos, setApellidos] = useState("")
  const [noEmpleado, setNoEmpleado] = useState("")
  const [contrasena, setContrasena] = useState("")
  const [rol, setRol] = useState("")
  const [toastMessage, setToastMessage] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    fetchUsuarios()
  }, [])

  const fetchUsuarios = async () => {
    try {
      const data = await getUsuarios()
      setUsuarios(data)
    } catch (error) {
      showToast("Error al cargar los usuarios")
    }
  }

  const handleSave = async () => {
    if (!nombres || !apellidos || !noEmpleado || !contrasena || !rol) {
      showToast("Todos los campos son obligatorios")
      return
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
        })
        showToast("Usuario actualizado con éxito")
      } else {
        await createUsuario({
          nombres_users: nombres,
          apellidos_users: apellidos,
          no_empleado_users: noEmpleado,
          contrasena: contrasena,
          rol: rol,
        })
        showToast("Usuario creado con éxito")
      }
      fetchUsuarios()
      closeModal()
    } catch (error) {
      showToast("Error al guardar el usuario")
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteUsuario(id)
      showToast("Usuario eliminado con éxito")
      fetchUsuarios()
    } catch (error) {
      showToast("Error al eliminar el usuario")
    }
  }

  const openModal = (usuario = null) => {
    setSelectedUsuario(usuario)
    setNombres(usuario ? usuario.nombres_users : "")
    setApellidos(usuario ? usuario.apellidos_users : "")
    setNoEmpleado(usuario ? usuario.no_empleado_users : "")
    setContrasena(usuario ? usuario.contrasena : "")
    setRol(usuario ? usuario.rol : "")
    setModalOpen(true)
  }

  const closeModal = () => {
    setSelectedUsuario(null)
    setNombres("")
    setApellidos("")
    setNoEmpleado("")
    setContrasena("")
    setRol("")
    setModalOpen(false)
  }

  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage("")
    }, 2000)
  }

  return (
    <div className="vu-page-container">
      <header className="vu-page-header">
        <h1 className="vu-header-title">Gestión de Usuarios</h1>
      </header>

      <main className="vu-main-content">
        <ul className="vu-user-list">
          {usuarios.map((usuario) => (
            <li key={usuario.id_user} className="vu-user-item">
              <div className="vu-user-info">
                <h2 className="vu-user-name">
                  {usuario.nombres_users} {usuario.apellidos_users}
                </h2>
                <p className="vu-user-detail">No. Empleado: {usuario.no_empleado_users}</p>
                <p className="vu-user-detail">Rol: {usuario.rol}</p>
              </div>
              <div className="vu-user-actions">
                <button
                  className="vu-btn vu-btn-icon vu-btn-dark"
                  onClick={() => openModal(usuario)}
                  aria-label="Editar usuario"
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
                  onClick={() => handleDelete(usuario.id_user)}
                  aria-label="Eliminar usuario"
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
          <button className="vu-fab-button" onClick={() => openModal()} aria-label="Agregar usuario">
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
                <h2 className="vu-modal-title">{selectedUsuario ? "Editar Usuario" : "Agregar Usuario"}</h2>
              </div>
              <div className="vu-modal-content">
                <div className="vu-form-list">
                  <div className="vu-form-item">
                    <label className="vu-form-label" htmlFor="nombres">
                      Nombres
                    </label>
                    <input
                      id="nombres"
                      className="vu-form-input"
                      type="text"
                      value={nombres}
                      onChange={(e) => setNombres(e.target.value)}
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
                    <label className="vu-form-label" htmlFor="contrasena">
                      Contraseña
                    </label>
                    <input
                      id="contrasena"
                      className="vu-form-input"
                      type="password"
                      value={contrasena}
                      onChange={(e) => setContrasena(e.target.value)}
                    />
                  </div>
                  <div className="vu-form-item">
                    <label className="vu-form-label" htmlFor="rol">
                      Rol
                    </label>
                    <select id="rol" className="vu-form-select" value={rol} onChange={(e) => setRol(e.target.value)}>
                      <option value="" disabled>
                        Selecciona un rol
                      </option>
                      <option value="admin">Admin</option>
                      <option value="user">Usuario</option>
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
  )
}

export default Usuarios