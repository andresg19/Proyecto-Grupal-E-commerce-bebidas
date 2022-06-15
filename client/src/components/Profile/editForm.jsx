import { sendPasswordResetEmail, updateProfile } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../../fb";
import FileBase64 from "react-file-base64";
import { getUserDb, resetUserDb, updateUser } from "../../redux/actions";
import { Navigate, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import validate from "./profileResources";

export default function EditForm() {
  const user = useSelector((state) => state.currentUser);
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [nameError, setNameError] = useState(null);
  const [surnameError, setSurnameError] = useState(null);
  const [input, setInput] = useState({
    nombre: "",
    apellido: "",
  });
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleChange(e) {
    setInput({ ...input, [e.target.name]: e.target.value });
    validate(e.target.value, e.target.name, setNameError, setSurnameError);
  }
  function passwordHandle() {
    sendPasswordResetEmail(auth, user.email);
    setDisabledBtn(true);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    //put
    console.log("se despacha esto", {
      id: user.uid,
      nombre: input.nombre,
      apellido: input.apellido,
      image: image,
    });
    dispatch(
      updateUser({
        id: user.uid,
        nombre: input.nombre,
        apellido: input.apellido,
        image: image
      })
    );
    updateProfile(auth.currentUser, {
      displayName: `${input.nombre} ${input.apellido}`,
    })
      .then(() => {
        swal({
          title: "Editado con exito ",
          type: "success",
          buttons: false,
          timer: 500,
        });
      })
      .catch((error) => {
        swal({
          title: "Ups... hubo un error",
          type: "warning",
          buttons: false,
          timer: 500,
        });
        console.log(error);
      });
    navigate("/profile");
  }
  console.log("user selector", user);
  useEffect(() => {
    if (user) {
      console.log("seteo input");
      if (user.displayName) {
        let name = user.displayName.split(" ");
        setInput({
          nombre: name[0] ? name[0] : "",
          apellido: name[1] ? name[1] : "",
        });
      } else {
        setInput({
          nombre: "",
          apellido: "",
        });
      }
    }
    return () => {
      if (user && user.isAdmin) {
        navigate("/profile");
      }
      console.log("Aactualizo y me voy a la mierda");
      dispatch(resetUserDb());
    };
  }, [user]);
  console.log(input, user);
  return (
    <div>
      <h1>Editar Perfil</h1>
      <div>
        <form>
          <br />
          {nameError && <span>{nameError}</span>}
          <br />
          <label htmlFor="nombre">Nombre: </label>
          <input
            type="text"
            value={input.nombre}
            name="nombre"
            onChange={handleChange}
            />
          <br />
            {surnameError && <span>{surnameError}</span>}
          <br />
          <label htmlFor="apellido">Apellido: </label>
          <input
            type="text"
            value={input.apellido}
            name="apellido"
            onChange={handleChange}
          />
          <br />
          <label htmlFor="password">Cambiar contraseña mediante email: </label>
          {!disabledBtn ? (
            <button onClick={passwordHandle}>Solicitar Cambio</button>
            ) : (
              <div>
              <button disabled onClick={passwordHandle}>
                Solicitar Cambio
              </button>
              <span> Se envio email para restablecer contraseña</span>
            </div>
          )}
          <br />
          <FileBase64
            type="file"
            multiple={false}
            onDone={({ base64 }) => setImage(base64)}
          />
          <br />
          {
            surnameError || nameError ?  
          <button type="button" onClick={() => alert("Complete todos los campos correctamente")}>
            Guardar
          </button>
          :
          <button type="submit" onClick={handleSubmit}>
            Guardar
          </button>

          }
        </form>
        {user && <img src={user.photoURL} style={{ width: "20%" }} />}
      </div>
    </div>
  );
}
