import { useEffect, useState, FormEvent } from "react";
import * as C from "./shared/styles/App.styles";
import * as Photos from "./shared/services/photos";
import { Photo } from "./shared/types/Photo";
import { PhotoItem } from "./shared/components";

export const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [upload, setUpload] = useState(false);

  useEffect(() => {
    const getPhotos = async () => {
      setIsLoading(true);
      setPhotos(await Photos.getAll());
      setIsLoading(false);
    };

    getPhotos();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("image") as File;
    if (file && file.size > 0) {
      setUpload(true);
      let result = await Photos.insert(file);
      setUpload(false);
      if (result instanceof Error) alert(`${result.name} - ${result.message}`);
      else {
        let newPhotoList = [...photos];
        newPhotoList.push(result);
        setPhotos(newPhotoList);
      }
    }
  };

  return (
    <C.Container>
      <C.Area>
        <C.Header>Galeria de fotos</C.Header>

        <C.UploadForm method="POST" onSubmit={handleSubmit}>
          <input type="file" accept="image/*" name="image" />
          <input type="submit" value="Enviar" />
          {upload && "Enviando..."}
        </C.UploadForm>

        {isLoading && (
          <C.ScreenWarning>
            <div className="emoji">✋</div>
            <div>Carregando</div>
          </C.ScreenWarning>
        )}

        {!isLoading && photos.length > 0 && (
          <C.PhotoList>
            {photos.map((item, index) => (
              <PhotoItem key={index} url={item.url} name={item.name} />
            ))}
          </C.PhotoList>
        )}

        {!isLoading && photos.length === 0 && (
          <C.ScreenWarning>
            <div className="emoji">😔</div>
            <div>Não há fotos cadastradas.</div>
          </C.ScreenWarning>
        )}
      </C.Area>
    </C.Container>
  );
};
