import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import usuario from "../services/usuario";

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
      try {
        const dados = await usuario.buscarUsuarioPorUidAsync(uid);
        setAutorizado(dados?.tipo === "administrador" && dados?.status === "ativo");
      } catch (error) {
        console.error("Erro ao verificar permissões:", error);
        setAutorizado(false);
      } finally {
        setCarregando(false);
      }
    };

    verificarPermissao();
  }, []);

  if (carregando) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: '16px',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '5px solid #e0e0e0',
          borderTop: '5px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{
          fontSize: '1.2rem',
          color: '#555',
          fontFamily: 'Arial, sans-serif',
          marginTop: '1rem'
        }}>Verificando permissões...</p>
        
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return autorizado ? <Outlet /> : <Navigate to="/nao-autorizado" replace />;
};

export default ProtectedAdminRoute;