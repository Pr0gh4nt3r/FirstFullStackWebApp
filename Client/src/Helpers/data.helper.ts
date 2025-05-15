export const getUserFromDB = async () => {
  const dataURL = process.env.REACT_APP_API_BASE_URL_DATA;
  const token = sessionStorage.getItem("accessToken");

  if (!token) {
    throw new Error("Nicht authentifiziert");
  }

  try {
    const res = await fetch(`${dataURL}/account`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Fehler beim Laden der User-Daten!");
    }

    const data = await res.json();

    return data;
  } catch (error: any) {
    console.error("Error fetching user data:", error);
    throw new Error(error.message || "Fehler beim Laden der User-Daten!");
  }
};
