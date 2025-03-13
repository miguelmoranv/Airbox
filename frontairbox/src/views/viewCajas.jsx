import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { fetchCajaById } from "../api/api"
import { Tab } from "../components/Tab"
import "../styles/cajas.css"

function ViewCajas() {
  const { id_cajas } = useParams()
  const [caja, setCaja] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCaja = async () => {
      try {
        const data = await fetchCajaById(id_cajas)
        setCaja(data)
        setLoading(false)
      } catch (err) {
        setError("Hubo un error al cargar la caja.")
        setLoading(false)
      }
    }

    fetchCaja()
  }, [id_cajas])

  return (
    <div className="vwc-page-container">
      <header className="vwc-page-header">
        <button className="vwc-back-button" onClick={() => navigate(-1)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="vwc-header-title">Detalles de la Caja</h1>
      </header>

      <main className="vwc-main-content">
        {loading && (
          <div className="vwc-loading-container">
            <div className="vwc-spinner"></div>
          </div>
        )}

        {error && <div className="vwc-error-message">{error}</div>}

        {caja && (
          <div className="vwc-data-card">
            <div className="vwc-card-header">
              <h2 className="vwc-card-title">Caja #{caja.id_caja}</h2>
            </div>

            <div className="vwc-card-content">
              <div className="vwc-data-section">
                <div className="vwc-section-header">Información Básica</div>
                <ul className="vwc-data-list">
                  <li className="vwc-data-item">
                    <div className="vwc-data-label">No. Serie</div>
                    <div className="vwc-data-value">{caja.caja_serie}</div>
                  </li>
                  <li className="vwc-data-item">
                    <div className="vwc-data-label">No. Parte</div>
                    <div className="vwc-data-value">{caja.no_parte}</div>
                  </li>
                </ul>
              </div>

              <div className="vwc-data-section">
                <div className="vwc-section-header">Conteo de Piezas</div>
                <ul className="vwc-data-list">
                  <li className="vwc-data-item">
                    <div className="vwc-data-label">No. Piezas</div>
                    <div className="vwc-data-value">{caja.no_piezas}</div>
                  </li>
                  <li className="vwc-data-item">
                    <div className="vwc-data-label">Piezas Mal</div>
                    <div className="vwc-data-value">{caja.piezas_mal}</div>
                  </li>
                  <li className="vwc-data-item">
                    <div className="vwc-data-label">Piezas Bien</div>
                    <div className="vwc-data-value">{caja.piezas_bien}</div>
                  </li>
                </ul>
              </div>

              <div className="vwc-data-section">
                <div className="vwc-section-header">Detalles Adicionales</div>
                <ul className="vwc-data-list">
                  <li className="vwc-data-item">
                    <div className="vwc-data-label">Comentarios</div>
                    <div className="vwc-data-value">{caja.comentarios || "Sin comentarios"}</div>
                  </li>
                  <li className="vwc-data-item">
                    <div className="vwc-data-label">Fecha y Hora</div>
                    <div className="vwc-data-value">{new Date(caja.fecha_hora).toLocaleString()}</div>
                  </li>
                </ul>
              </div>

              <div className="vwc-data-section">
                <div className="vwc-section-header">Personal</div>
                <ul className="vwc-data-list">
                  <li className="vwc-data-item">
                    <div className="vwc-data-label">Nombre Usuario</div>
                    <div className="vwc-data-value">
                      {caja.user_nombre} {caja.user_apellido}
                    </div>
                  </li>
                  <li className="vwc-data-item">
                    <div className="vwc-data-label">Auxiliar</div>
                    <div className="vwc-data-value">
                      {caja.auxiliar_nombre} {caja.auxiliar_apellido}
                    </div>
                  </li>
                  <li className="vwc-data-item">
                    <div className="vwc-data-label">Lote No. Serial</div>
                    <div className="vwc-data-value">{caja.lote_no_serial}</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <Tab />
      </main>
    </div>
  )
}

export default ViewCajas