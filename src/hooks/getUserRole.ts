import { useEffect, useState } from "react";

export function useUserRole(userId: string) {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRole = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/fetchUserRole/${userId}`);
      const data = await res.json();
      setRole(data.role);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };
  
  useEffect(() => {
    fetchRole();
  }, []);

  return { role, loading, error };
}
