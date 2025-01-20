import React from "react";
import "../styles/login.css";


export default function Main() {
    return (
        <div className="main-container">
            <span className="text">Iniciar Sesión</span>
            <span className="text-2">
                Ingrese sus credenciales para acceder al sistema
            </span>
            <span className="text-3">Número de empleado</span>
            <div className="wrapper">
                <span className="text-4">Ingrese su número de empleado</span>
            </div>
            <span className="text-5">Contraseña</span>
            <div className="wrapper-2">
                <span className="text-6">Ingrese su contraseña</span>
            </div>
            <div className="group">
                <span className="text-7">Iniciar Sesión</span>
            </div>
            <span className="text-8">
                ¿Olvidó su contraseña? Contacte a soporte técnico
            </span>
        </div>
    );
}