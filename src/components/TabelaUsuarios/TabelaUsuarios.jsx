import { useState } from "react";
import { VscChevronDown, VscChevronUp } from "react-icons/vsc";
import styles from "./TabelaUsuarios.module.css";

function TabelaUsuarios({ usuarios }) {
    const [pesquisa, setPesquisa] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("Todos");
    const [filtroTipo, setFiltroTipo] = useState("Todos");
    const [ordenacao, setOrdenacao] = useState({ campo: "nome", direcao: "asc" });

    const ordenar = (campo) => {
        setOrdenacao((prev) => ({
            campo,
            direcao: prev.campo === campo && prev.direcao === "asc" ? "desc" : "asc",
        }));
    };

    const getIconeOrdenacao = (campo) => {
        if (ordenacao.campo !== campo) return null;
        return ordenacao.direcao === "asc" ? <VscChevronUp /> : <VscChevronDown />;
    };

    const usuariosFiltrados = usuarios.filter((u) => {
        const pesquisaMatch =
            u.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
            u.email.toLowerCase().includes(pesquisa.toLowerCase());

        const statusMatch = filtroStatus === "Todos" || u.status === filtroStatus;
        const tipoMatch = filtroTipo === "Todos" || u.tipo === filtroTipo;

        return pesquisaMatch && statusMatch && tipoMatch;
    });

    const usuariosOrdenados = [...usuariosFiltrados].sort((a, b) => {
        const dir = ordenacao.direcao === "asc" ? 1 : -1;

        if (ordenacao.campo === "createdAt") {
            const dataA = a.createdAt?.toDate?.() || new Date(0);
            const dataB = b.createdAt?.toDate?.() || new Date(0);
            return (dataA - dataB) * dir;
        }

        return a[ordenacao.campo].localeCompare(b[ordenacao.campo]) * dir;
    });

    const formatarData = (data) => {
        if (!data?.toDate) return "";
        const d = data.toDate();
        return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR");
    };

    return (
        <div className={styles.container}>
            <div className={styles.filtros}>
                <input
                    type="text"
                    placeholder="Buscar por nome ou e-mail..."
                    value={pesquisa}
                    onChange={(e) => setPesquisa(e.target.value)}
                />
                <select
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value)}
                >
                    <option value="Todos">Todos os status</option>
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                    <option value="bloqueado">Bloqueado</option>
                </select>
                <select
                    value={filtroTipo}
                    onChange={(e) => setFiltroTipo(e.target.value)}
                >
                    <option value="Todos">Todos os tipos</option>
                    <option value="administrador">Administrador</option>
                    <option value="cliente">Cliente</option>
                </select>
            </div>

            <div className={styles.tabela_wrapper}>
                <table className={styles.tabela}>
                    <thead>
                        <tr>
                            <th onClick={() => ordenar("nome")}>
                                Nome {getIconeOrdenacao("nome")}
                            </th>
                            <th onClick={() => ordenar("email")}>
                                Email {getIconeOrdenacao("email")}
                            </th>
                            <th onClick={() => ordenar("createdAt")}>
                                Criado {getIconeOrdenacao("createdAt")}
                            </th>
                            <th>Tipo</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuariosOrdenados.length > 0 ? (
                            usuariosOrdenados.map((usuario) => (
                                <tr key={usuario.id}>
                                    <td>{usuario.nome}</td>
                                    <td>{usuario.email}</td>
                                    <td>{formatarData(usuario.createdAt)}</td>
                                    <td>{usuario.status}</td>
                                    <td>{usuario.tipo}</td>
                                    <td>

                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className={styles.sem_resultados}>
                                    Nenhum usuário encontrado
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TabelaUsuarios;
