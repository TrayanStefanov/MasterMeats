import { FaUpload, FaTrash } from "react-icons/fa";

const ProductImageUpload = ({ images = [], onChange, onRemove }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center">
        <input
          type="file"
          id="images"
          className="sr-only"
          accept="image/*"
          multiple
          onChange={onChange}
        />
        <label
          htmlFor="images"
          className="cursor-pointer bg-accent/30 hover:bg-accent/50 px-4 py-2 rounded-md flex items-center gap-2 text-sm text-secondary border border-accent/40 transition-all"
        >
          <FaUpload className="w-4 h-4" />
          Upload Images (max 5)
        </label>
        {images.length > 0 && (
          <span className="ml-3 text-sm text-secondary/70">
            {images.length} image{images.length > 1 ? "s" : ""} selected.
          </span>
        )}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {images.map((img, i) => (
            <div
              key={i}
              className="relative w-full aspect-square rounded-lg overflow-hidden border border-accent/30"
            >
              <img
                src={img}
                alt={`preview-${i}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="absolute top-1 right-1 bg-accent text-accent-content p-1 rounded-full text-xs hover:bg-black/70"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageUpload;
