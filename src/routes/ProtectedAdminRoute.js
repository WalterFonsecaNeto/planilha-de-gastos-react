import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import usuario from "../services/usuario"; // já criado por você

const ProtectedAdminRoute = () => {
  const [carregando, setCarregando] = useState(true);
  const [autorizado, setAutorizado] = useState(false);

  useEffect(() => {
    const uid = localStorage.getItem("userId");

    if (!uid) {
      setAutorizado(false);
      setCarregando(false);
      return;
    }

    const verificarPermissao = async () => {
      const dados = await usuario.buscarUsuarioPorUidAsync(uid);

      if (dados?.tipo === "administrador" && dados?.status === "ativo") {
        setAutorizado(true);
      } else {
        setAutorizado(false);
      }

      setCarregando(false);
    };

    verificarPermissao();
  }, []);

  if (carregando) return <p>Verificando permissões...</p>;

  return autorizado ? <Outlet /> : <Navigate to="/nao-autorizado" replace />;
};

export default ProtectedAdminRoute;
