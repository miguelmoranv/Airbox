import React, { useState } from "react";
import {
  IonButton,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonLabel,
  IonInput,
  IonText,
  IonAlert,
  IonTitle,
  IonItem,
  IonPage
} from "@ionic/react";
import "../styles/login.css";  // Asegúrate de tener este archivo para los estilos

const Login = () => {
  const [user, setUser] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    // Aquí puedes agregar tu lógica de autenticación.
    // Simulación de éxito:
    setTimeout(() => {
      setLoading(false);
      setAlertMessage("Inicio de sesión exitoso");
      setShowAlert(true);
    }, 2000);
  };

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const isLoginFormValid = () => user && contrasena;

  return (
    <IonPage>
      <IonContent className="login">
        <IonGrid>
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" size-md="8" size-lg="6">
              <IonCard className="box-shadow-none">
                <IonCardContent>
                  <div className="text">
                    <h1>Iniciar Sesión</h1>
                  </div>
                  <div className="text-2">
                    <p style={{textAlign:"center"}}>Ingrese sus credenciales para acceder al sistema</p>
                  </div>

                  <div className="text-3">
                    <p>Número de empleado</p>
                  </div>
                  <div className="wrapper">
                    <IonItem>
                      <IonInput
                        required
                        value={user}
                        onIonChange={handleChange(setUser)}
                        placeholder="Ingrese su número de empleado"
                        className="text-4"
                        type="text"
                        style={{
                          color: "var(--ion-input-text-color)",
                        }}
                      />
                    </IonItem>
                  </div>
                  <div className="text-5">
                    <p>Contraseña</p>
                  </div>
                  <div className="wrapper-2">
                    <IonItem>
                      <IonInput
                        required
                        value={contrasena}
                        onIonChange={handleChange(setContrasena)}
                        placeholder="Ingrese su contraseña"
                        className="text-6"
                        style={{
                          color: "var(--ion-input-text-color)",
                        }}
                        type="password"
                      />
                    </IonItem>
                  </div>

                  <div className="group">
                    <IonButton
                      color="dark"
                      expand="block"
                      className="text-7"
                      onClick={handleLogin}
                    >
                      {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                    </IonButton>
                  </div>
                  <br />
                  <IonText className="text-8">
                    <p style={{textAlign:"center"}}>¿Olvidó su contraseña? Contacte a soporte técnico</p>
                  </IonText>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={"Mensaje"}
          message={alertMessage}
          buttons={["OK"]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
