import React,{useState} from "react";

function Usuarios() {

    const [user, setUser] = useState("asd");
    const [contrasena, setContrasena] = useState("");

  return (
    <>
    <div>
      <h1>Usuarios {user}</h1>
    </div>
    </>
  );
}

export default Usuarios;