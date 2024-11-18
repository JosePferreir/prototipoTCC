import { useEffect, useState, useRef } from 'react';
import './ProgressBar.css';

type Props = {
  value: number;
};

const ProgressBar = ({ value }: Props) => {
  const [progress, setProgress] = useState(0);
  const ref = useRef<HTMLDivElement>(null); // Usando useRef

  useEffect(() => {
    let start = 0;

    const interval = setInterval(() => {
      start += 1;
      if (start <= value) {
        setProgress(start); // Atualiza o estado do progresso corretamente
      } else {
        clearInterval(interval);
      }
    }, 8); // Definimos um intervalo de 20ms para a animação

    return () => clearInterval(interval); // Limpar o intervalo quando o componente for desmontado
  }, [value]);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.setProperty('--pb-progress', `${progress}%`);
    ref.current.setAttribute('data-value', progress.toString());
  }, [progress]); // Atualiza sempre que o valor de progress mudar

  return (
    <div ref={ref} className="pb-progress" data-value={progress}></div>
  );
};

export default ProgressBar;