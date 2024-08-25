import { useState } from "react";
import { getFileSize } from "../utils/functions";

interface IProps {
  initialFile?: File | null;
  initialImageUrl?: string;
}

const useHandleImage = ({ initialFile, initialImageUrl }: IProps) => {
  const [file, setFile] = useState<File | null>(initialFile ?? null);
  const [imageUrl, setImageUrl] = useState<string | null>(
    initialImageUrl ?? null
  );

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = e;

    if (files && files.length === 1) {
      const tempFile = files[0];
      const fileSize = getFileSize(tempFile.size);

      if (fileSize > 1500) {
        alert("파일이 너무 큽니다.");
        return;
      }

      setFile(tempFile);
      setImageUrl(URL.createObjectURL(tempFile));
    }
  };

  return { file, imageUrl, handleChangeImage };
};

export default useHandleImage;
