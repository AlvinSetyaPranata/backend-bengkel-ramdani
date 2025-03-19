import React, { ChangeEvent, useEffect, useRef, useState } from "react";

interface imageFieldProps {
  src: string;
  name: string;
  alt?: string;
}

const ImageField: React.FC<imageFieldProps> = ({ src, name, alt = "Gambar" }) => {
  const [selectedImage, setSelectedImage] = useState()
  const fileRef = useRef()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target?.files?.[0]) {
      setSelectedImage(URL.createObjectURL(event.target.files[0]))
    }
  }


  return (
    <>
      <input ref={fileRef} onChange={handleChange} type="file" name={name} className="hidden"/>
      <div className="size-[200px] rounded-md overflow-hidden relative group hover:cursor-pointer">
        {src ? (
          <>
            <div
              className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 min-w-full min-h-full z-10 bg-black/75 transition-opacity ease-in duration-300 flex justify-center items-center"
              onClick={() => fileRef.current.click()}
            >
              <p>Ganti</p>
            </div>
            <img src={selectedImage ? selectedImage : src} alt={alt} className="size-full aspect-square" />
          </>
        ) : (
          <div className="border border-gray-400 border-dotted">
            <p>Pilih Foto</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ImageField;
