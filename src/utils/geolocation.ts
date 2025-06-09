export async function getCoordinatesFromPostalCode(postalCode: string): Promise<{ lat: number; lon: number } | null> {
  try {
    const res = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${postalCode}&limit=1`);
    const data = await res.json();
    const coords = data?.features?.[0]?.geometry?.coordinates;
    if (!coords) return null;
    return { lon: coords[0], lat: coords[1] };
  } catch {
    return null;
  }
}
