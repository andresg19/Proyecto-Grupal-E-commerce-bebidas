import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { deleteMercadoPago } from "../../redux/actions";

export const FeedBack = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let foo;
  useEffect(() => {
    let search = window.location.search;
    let params = new URLSearchParams(search);
    foo = params.get("status");

    console.log("foo", foo);
    if (foo === "approved") {
      dispatch(deleteMercadoPago());
      console.log("APROBADO");
      setTimeout(navigate("/"), 10000);
      swal({
        title: "Dejanos tu opinion",
        text: "... que tal te parecio el producto ⭐⭐⭐!",
        buttons: {
          cancel: "Ahorita no joven",
          review: {
            text: "Opina",
            value: "Opina",
          },
        },
        icon: "warning",
      }).then((value) => {
        if (value === "Opina") {
          navigate("/review");
        }
      });
    } else {
      navigate("/cart");
    }
  }, []);
  return <div>Status: {foo}</div>;
};
