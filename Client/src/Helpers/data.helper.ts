export const getUserFromDB = async (id: string) => {
  const dataURL = process.env.REACT_APP_API_BASE_URL_DATA;
  const token = localStorage.getItem("AccessToken");

  if (!token) {
    throw new Error("Nicht authentifiziert");
  }

  const res = await fetch(`${dataURL}/user/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Fehler beim Laden der User-Daten");
  }

  const data = await res.json();

  return data;
};
