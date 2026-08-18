import { useEffect, useRef } from "react";
const UploadWidget = ({ uwConfig, setState }) => {
  const uploadWidgetRef = useRef(null);
  const uploadButtonRef = useRef(null);
  useEffect(() => {
    if (!window.cloudinary || !uploadButtonRef.current) return;
    uploadWidgetRef.current = window.cloudinary.createUploadWidget(
      uwConfig,
      (error, result) => {
        console.log(error, result);

        if (!error && result.event === "success") {
          setState((prev) => [...prev, result.info.secure_url]);
        }
      }
    );
    const handleClick = () => {
      uploadWidgetRef.current.open();
    };
    const button = uploadButtonRef.current;
    button.addEventListener("click", handleClick);
    return () => {
      button.removeEventListener("click", handleClick);
    };
  }, [uwConfig, setState]);
  return (
    <button
      ref={uploadButtonRef}
      id="upload_widget"
      className="cloudinary-button"
      type="button"
    >
      Upload
    </button>
  );
};
export default UploadWidget;