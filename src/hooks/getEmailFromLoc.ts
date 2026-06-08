import { useState } from "react";

export function useEmailLoc() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmailFromLoc = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `http://localhost:3000/api/fetchUserEmail/${userId}`
      );
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      return data.email;
    } catch (err) {
      setError(err.message || "Something went wrong");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, fetchEmailFromLoc };
}
