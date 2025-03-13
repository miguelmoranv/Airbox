import React, { useState } from "react";
import {
  IonButton,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonInput,
  IonText,
  IonAlert,
  IonItem,
  IonPage,
} from "@ionic/react";
import "../styles/login.css";
import { login } from "../api/api";
import { useUser } from "../context/UserContext";
import logo from "../assets/img/logo.png";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [no_empleado_users, setNoEmpleadoUsers] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate(); // Hook para redireccionar
  const { login: loginUsuario } = useUser(); // Función de login del contexto

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
  
    if (!no_empleado_users || !contrasena) {
      setError("Por favor, completa todos los campos.");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await login(no_empleado_users, contrasena);
      console.log("Login exitoso:", response);
  
      loginUsuario(response);
  
      if (response.rol === "admin") {
        navigate("/lotes");
      } else {
        navigate("/lotes");
      }
    } catch (err) {
      console.error("Error en el login:", err);
      setError(err.message || "Credenciales incorrectas");
      setAlertMessage(err.message || "Credenciales incorrectas");
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const isLoginFormValid = () => no_empleado_users && contrasena;

  return (
    <IonPage>
      <IonContent className="login">
        <IonGrid>
          <IonRow className="ion-justify-content-center" style={{ marginTop: "1%" }}>
            <IonCol size="12" size-md="8" size-lg="6">
              <IonCard className="box-shadow-none">
                <IonCardContent>
                  <img src={logo} alt="logo" className="logo" />
                  <div className="text">
                    <h1>Iniciar Sesión</h1>
                  </div>
                  <div className="text-2">
                    <p style={{ textAlign: "center" }}>Ingrese sus credenciales para acceder al sistema</p>
                  </div>

                  {/* Campo de número de empleado */}
                  <div className="text-3">
                    <p>Número de empleado</p>
                  </div>
                  <div
                    className="wrapper"
                    style={{
                      border: "2px solid transparent",
                      borderImage:
                        focusedField === "no_empleado_users"
                          ? "linear-gradient(135deg, #6a11cb, #2575fc) 1"
                          : "none",
                      borderRadius: "10px",
                      transition: "border-image 0.3s ease",
                    }}
                    onFocus={() => setFocusedField("no_empleado_users")}
                    onBlur={() => setFocusedField(null)}
                  >
                    <IonItem>
                      <IonInput
                        required
                        value={no_empleado_users}
                        onIonChange={(e) => setNoEmpleadoUsers(e.detail.value)}
                        placeholder="Ingrese su número de empleado"
                        className="text-4"
                        type="text"
                        style={{
                          color: "var(--ion-input-text-color)",
                        }}
                      />
                    </IonItem>
                  </div>

                  {/* Campo de contraseña */}
                  <div className="text-5">
                    <p>Contraseña</p>
                  </div>
                  <div
                    className="wrapper-2"
                    style={{
                      border: "2px solid transparent",
                      borderImage:
                        focusedField === "contrasena"
                          ? "linear-gradient(135deg, #6a11cb, #2575fc) 1"
                          : "none",
                      borderRadius: "10px",
                      transition: "border-image 0.3s ease",
                    }}
                    onFocus={() => setFocusedField("contrasena")}
                    onBlur={() => setFocusedField(null)}
                  >
                    <IonItem>
                      <IonInput
                        required
                        value={contrasena}
                        onIonChange={(e) => setContrasena(e.detail.value)}
                        placeholder="Ingrese su contraseña"
                        className="text-6"
                        style={{
                          color: "var(--ion-input-text-color)",
                        }}
                        type="password"
                      />
                    </IonItem>
                  </div>

                  {/* Botón de inicio de sesión */}
                  <div className="group">
                    <IonButton
                      color="dark"
                      expand="block"
                      className="text-7"
                      onClick={handleLogin}
                      disabled={!isLoginFormValid() || loading}
                    >
                      {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                    </IonButton>
                  </div>
                  <br />

                  {/* Enlace para recuperar contraseña */}
                  <IonText className="text-8">
                    <p style={{ textAlign: "center" }}>¿Olvidó su contraseña? Contacte a soporte técnico</p>
                  </IonText>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Alerta para mostrar errores */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={"Error"}
          message={alertMessage}
          buttons={["OK"]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;