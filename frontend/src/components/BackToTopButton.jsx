// BackToTopButton.jsx
import useBackToTop from "../hooks/useBackToTop"; // ✅ default import
import { FaArrowUp } from "react-icons/fa";

export default function BackToTopButton() {
  const { visible, scrollToTop } = useBackToTop();

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-[999] bg-accent text-secondary p-3 rounded-full shadow-lg hover:bg-accent/90 transition"
      aria-label="Back to top"
    >
      <FaArrowUp size={20} />
    </button>
  );
}
