import { BiLoaderCircle } from 'react-icons/bi';

interface Props {
  message?: string;
}

const LoadingSpinner = ({ message }: Props) => {
  const displayMessage = message || 'Cargando datos del repositorio, esto puede tardar unos minutos...';

  return (
    <div className="flex flex-col items-center justify-center min-h-64 p-8">
      <span className="relative flex h-16 w-16">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-50"></span>
        <BiLoaderCircle className="relative h-16 w-16 text-blue-500 animate-spin" />
      </span>
      <p className="mt-6 text-lg font-medium text-gray-700 dark:text-gray-300 text-center max-w-xs">
        {displayMessage}
      </p>
    </div>
  );
};

export default LoadingSpinner;