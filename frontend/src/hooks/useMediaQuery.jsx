import { useState, useEffect } from "react";

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia(query);
    const handleChange = (e) => setMatches(e.matches);

    setMatches(mq.matches);
    mq.addEventListener("change", handleChange);

    return () => {
      mq.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
}
