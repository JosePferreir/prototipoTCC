import { Insignia } from "./Insignia";
import { UserBook } from "./UserBook";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  nivel: number;
  pontos: number;
  sequencia: number;
  sequenciaMaxima: number;
  pagesRead: number;
  totalBooksRead: number;
  genresRead: {
    romance: number;
    aventura: number;
    investigacao: number;
    economia: number;
  };
  books: UserBook[];
  insignias: Insignia[];
  lastReadDate: string;
}