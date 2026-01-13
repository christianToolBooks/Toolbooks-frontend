/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError } from 'axios';

// Define la interfaz para la estructura de un código NAICS
export interface NaicsCodeApiResponse {
   id: string; // Esto es lo que la API llama al código NAICS
  description: string; // Esto es lo que la API llama a la descripción
  sectorId?: string;
  sectorDescription?: string;
  subsectorId?: string;
  subsectorDescription?: string;
  revenueLimit?: number | null;
  assetLimit?: number | null;
  employeeCountLimit?: number | null;
  parent?: string | null;
  footnote?: string | null;
}

export interface NaicsCodeProcessed {
  naicsCode: string;
  naicsDescription: string;
  // Puedes añadir otras propiedades de la API si las necesitas en tu lógica
  sectorId?: string;
  sectorDescription?: string;
}

interface UseNaicsDataResult {
  data: NaicsCodeProcessed[];
  loading: boolean;
  error: string | null;
  refetch: () => void; 
}

const NAICS_API_URL = 'https://api.sba.gov/naics/naics.json';

export function useNaicsData(): UseNaicsDataResult {
  const [data, setData] = useState<NaicsCodeProcessed[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cache, setCache] = useState<{
    data: NaicsCodeProcessed[] | null;
    timestamp: number | null;
  }>({ data: null, timestamp: null });

  const CACHE_EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 horas

  const fetchNaicsCodes = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Verificar caché en memoria
    if (cache.data && cache.timestamp) {
      if (Date.now() - cache.timestamp < CACHE_EXPIRATION_MS) {
        setData(cache.data);
        setLoading(false);
        return;
      }
    }

    // Si no hay caché válido, hacer la solicitud
    try {
      const response = await axios.get<NaicsCodeApiResponse[]>(NAICS_API_URL);

      const processedData: NaicsCodeProcessed[] = response.data.map(item => ({
        naicsCode: item.id, 
        naicsDescription: item.description, 
        sectorId: item.sectorId, 
        sectorDescription: item.sectorDescription,
      }));

      setData(processedData);
      setCache({
        data: processedData,
        timestamp: Date.now()
      });
      
    } catch (err) {
      const axiosError = err as AxiosError;
      console.error("Error fetching NAICS codes:", axiosError);
      setError(axiosError.message || "An unknown error occurred while fetching NAICS codes.");
    } finally {
      setLoading(false);
    }
  }, [cache.data, cache.timestamp]); // Incluir cache en dependencias

  useEffect(() => {
    fetchNaicsCodes();
  }, [fetchNaicsCodes]);

  return { data, loading, error, refetch: fetchNaicsCodes };
}