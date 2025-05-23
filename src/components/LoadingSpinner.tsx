import { BiLoaderCircle } from 'react-icons/bi';

interface Props {
  message?: string;
}

const LoadingSpinner = ({ message }: Props) => {
  message = message || "Cargando datos del repositorio, esto puede tardar unos minutos...";

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <BiLoaderCircle className="h-12 w-12 text-blue-500 animate-spin" />
      <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">{message}</p>
    </div>
  );
};

export default LoadingSpinner;