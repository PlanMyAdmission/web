import { useEffect } from "react";

const STORAGE_KEY = "pmaProfileData";

const useProfileStorage = (formData, setFormData) => {
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed }));
      }
    } catch (_error) {
      // ignore storage errors
    }
  }, [setFormData]);

  const persistProfile = (data = formData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (_error) {
      // ignore storage errors
    }
  };

  return { persistProfile };
};

export default useProfileStorage;
