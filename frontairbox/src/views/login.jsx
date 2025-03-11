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
import "../styles/login.css";
import { useUser } from '../context/UserContext';
import { login as apiLogin } from '../api/api';
import logo from "../assets/img/logo.png";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [user, setUser] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const { login } = useUser(); // Obtén la función login del contexto
  const navigate = useNavigate(); // Para redirigir después del login

  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await apiLogin({ user, contrasena });
      if (response && response.token) { 
        login(response.token); // Guarda el token con tu contexto
        navigate('/Lotes');
      } else {
        setAlertMessage(response.message || "Credenciales incorrectas");
        setShowAlert(true);
      }
    } catch (error) {
      setAlertMessage("Error al iniciar sesión. Inténtelo de nuevo.");
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };
  

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const isLoginFormValid = () => user && contrasena;

  return (
    <IonPage>
      <IonContent className="login">
        <IonGrid>
          <IonRow className="ion-justify-content-center" style={{marginTop:"1%"}}>
            <IonCol size="12" size-md="8" size-lg="6">
              <IonCard className="box-shadow-none">
                <IonCardContent>
                  <img src={logo} alt="logo" className="logo"/>
                  <div className="text">
                    <h1>Iniciar Sesión</h1>
                  </div>
                  <div className="text-2">
                    <p style={{textAlign:"center"}}>Ingrese sus credenciales para acceder al sistema</p>
                  </div>

                  <div className="text-3">
                    <p>Número de empleado</p>
                  </div>
                  <div className="wrapper" style={{border: '2px solid transparent', 
                        borderImage: focusedField === 'user' 
                          ? 'linear-gradient(135deg, #6a11cb, #2575fc) 1' 
                          : 'none', 
                        borderRadius: '10px',
                        transition: 'border-image 0.3s ease',}}
                    onFocus={() => setFocusedField('user')}
                    onBlur={() => setFocusedField(null)}
                  >
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
                  <div className="wrapper-2" style={{border: '2px solid transparent', 
                        borderImage: focusedField === 'contrasena' 
                          ? 'linear-gradient(135deg, #6a11cb, #2575fc) 1' 
                          : 'none', 
                        borderRadius: '10px',
                        transition: 'border-image 0.3s ease',}}
                    onFocus={() => setFocusedField('contrasena')}
                    onBlur={() => setFocusedField(null)}
                  >
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
