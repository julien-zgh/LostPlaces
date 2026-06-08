import { useState } from "react";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export const ImageGallery = ({ selectedSubmission }) => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const images = selectedSubmission.images.map((img) => ({
    src: import.meta.env.VITE_SUPABASE_STORAGE_URL + img,
  }));

  return (
    <div className="w-full">
      {/* First big image */}
      <img
        src={images[0].src}
        alt="Main"
        className="w-full h-64 object-cover rounded-lg cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          setIndex(0);
          setOpen(true);
        }}
      />

      {/* Thumbnails */}
      <div className="flex justify-center gap-2 mt-2 flex-wrap">
        {images.slice(1).map((img, i) => (
          <img
            key={i + 1}
            src={img.src}
            alt={`Thumbnail ${i + 1}`}
            className="w-24 h-24 object-cover rounded-lg cursor-pointer"
            onClick={() => {
              setIndex(i + 1);
              setOpen(true);
            }}
          />
        ))}
      </div>

      {/* Lightbox */}
      {open && (
        <div onClick={(e) => e.stopPropagation()}>
          <Lightbox
            open={open}
            close={() => setOpen(false)}
            index={index}
            slides={images}
            render={{
              buttonPrev: () => null,
              buttonNext: () => null,
            }}
          />
        </div>
      )}
    </div>
  );
};
