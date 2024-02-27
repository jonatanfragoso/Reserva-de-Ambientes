import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import useAuth from "./hooks/useAuth";
import HeaderLayout from "./components/Layouts/HeaderLayout";
import CadastrarUsuarios from "./pages/CadastrarUsuarios";
import MainGestor from "./pages/MainGestor";
import MainProfessor from "./pages/MainProfessor";
import HeaderLayoutProfessor from "./components/Layouts/HeaderLayoutProfessor";
import HistoricoAgendamentosProfessor from "./pages/HistoricoAgendamentosProfessor";
import SolicitarAgendamento from "./components/SolicitarAgendamento";

interface IProps {
  redirectTo: string;
}

function ProtectedRoutesGestor({ redirectTo }: IProps) {
  const { handleGetToken, handleGetGestor } = useAuth();
  const idGestor = handleGetGestor();
  return handleGetToken() && idGestor === "1" ? (
    <Outlet></Outlet>
  ) : (
    <Navigate to={redirectTo}></Navigate>
  );
}

function ProtectedRoutesProfessor({ redirectTo }: IProps) {
  const { handleGetToken } = useAuth();

  return handleGetToken() ? (
    <Outlet></Outlet>
  ) : (
    <Navigate to={redirectTo}></Navigate>
  );
}

function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SignIn></SignIn>}></Route>

      <Route
        element={<ProtectedRoutesGestor redirectTo="/"></ProtectedRoutesGestor>}
      >
        <Route path="" element={<HeaderLayout></HeaderLayout>}>
          <Route
            path="/main-gestor"
            element={<MainGestor></MainGestor>}
          ></Route>
          <Route
            path="/cadastrar-usuarios"
            element={<CadastrarUsuarios></CadastrarUsuarios>}
          ></Route>
        </Route>
      </Route>

      <Route
        element={
          <ProtectedRoutesProfessor redirectTo="/"></ProtectedRoutesProfessor>
        }
      >
        <Route
          path=""
          element={<HeaderLayoutProfessor></HeaderLayoutProfessor>}
        >
          <Route
            path="/main-professor"
            element={<MainProfessor></MainProfessor>}
          ></Route>
          <Route
            path="/historico-agendamentos"
            element={
              <HistoricoAgendamentosProfessor></HistoricoAgendamentosProfessor>
            }
          ></Route>
          <Route
            path="/reservar-ambiente"
            element={<SolicitarAgendamento></SolicitarAgendamento>}
          ></Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default MainRoutes;