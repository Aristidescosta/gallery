import * as C from "./styles";

interface IPhotoItemProps {
  url: string;
  name: string;
}

export const PhotoItem: React.FC<IPhotoItemProps> = ({ url, name }) => {
  return(
    <C.Container>
      <img src={url} alt={name} />
      {name}
    </C.Container>
  )
};
