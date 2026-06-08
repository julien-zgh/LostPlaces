import { useState, useEffect } from "react";

function UserName({ userId }) {
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchName = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/user/${userId}`);
        const data = await res.json();
        setName(data.name);
      } catch (err) {
        console.error(err);
      }
    };

    fetchName();
  }, [userId]);

  return <span className="font-semibold">{name}</span>;
}

export default UserName;
