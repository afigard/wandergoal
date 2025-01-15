import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Verify() {
  const router = useRouter();
  const { token } = router.query;
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (token) {
      fetch(`/api/auth/verify?token=${token}`)
        .then((res) => res.json())
        .then((data) => setMessage(data.message || "Verification failed"))
        .catch(() => setMessage("Verification failed"));
    }
  }, [token]);

  return (
    <div>
      <h1>Email Verification</h1>
      <p>{message}</p>
    </div>
  );
}
