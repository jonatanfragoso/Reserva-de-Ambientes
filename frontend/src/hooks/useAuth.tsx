function useAuth() {
  function handleAddToken(token: string) {
    localStorage.setItem("token", token);
  }

  function handleClearToken() {
    localStorage.removeItem("token");
  }

  function handleGetToken(): string | null {
    return localStorage.getItem("token");
  }

  function handleAddGestor(id_gestor: string) {
    localStorage.setItem("id_gestor", id_gestor);
  }

  function handleGetGestor(): string | null {
    return localStorage.getItem("id_gestor");
  }

  function handleLogout() {
    localStorage.clear();
  }

  return {
    handleAddToken,
    handleClearToken,
    handleGetToken,
    handleGetGestor,
    handleAddGestor,
    handleLogout,
  };
}

export default useAuth;
