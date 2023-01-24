import { Coordinate } from "ol/coordinate";
import React, { ChangeEvent, CSSProperties, useState } from "react";

interface OSMPlace {
  place_id: number,
  lat: string,
  lon: string,
  display_name: string,
}

function getPlacesWithoutDuplicate(places: OSMPlace[]): OSMPlace[] {
  const placesWithoutDuplicateAddress = places.filter((v, i, a) => a.findIndex(
    (v2) => (v2.display_name === v.display_name),
  ) === i);
  return placesWithoutDuplicateAddress;
}

async function searchPlaces(search: string): Promise<OSMPlace[]> {
  const endpoint = `https://nominatim.openstreetmap.org/search?q=${search}&format=json`;
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error('Cannot search address');
  const osmPlaces = await (response.json() as Promise<OSMPlace[]>);
  return getPlacesWithoutDuplicate(osmPlaces);
}

const searchStyle: CSSProperties = {
  position: 'absolute',
  zIndex: 1,
  top: '15px',
  left: 0,
  right: 0,
  marginInline: 'auto',
  width: '60%',
  padding: '10px 12px',
  fontSize: '16px',
  borderRadius: '4px'
}

interface SearchAddressSpec {
  setSearchLocation: React.Dispatch<React.SetStateAction<Coordinate | undefined>>
}

function SearchAddress({ setSearchLocation }: SearchAddressSpec) {
  const [places, setPlaces] = useState<OSMPlace[]>([]);
  const [timeout, setNewTimeout] = useState<ReturnType<typeof setTimeout>>();
  const [loading, setLoading] = useState(false);

  const fetchAddress = (addr: string) => {
    setLoading(true);
    setPlaces([]);
    searchPlaces(addr)
      .then((pls) => { setPlaces(pls); })
      .catch(console.warn)
      .finally(() => setLoading(false));
  };

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const search = event.target.value;
    const validPlace = places.find((place) => place.display_name === search);
    if (validPlace) {
      setSearchLocation([Number(validPlace.lon), Number(validPlace.lat)]);
      return;
    }
    if (timeout) clearTimeout(timeout);
    if (search.length < 5) {
      setPlaces([]);
      return;
    }
    setNewTimeout(setTimeout(() => { fetchAddress(search); }, 500));
  };

  return (
    <>
      <input
        onChange={handleChange}
        list="addresses"
        style={searchStyle}
        placeholder="Rechercher un lieu"
      />
      <datalist id="addresses">
        {places.map((place) => <option key={place.place_id} value={place.display_name} />)}
      </datalist>
    </>
  );
}

export default SearchAddress;
