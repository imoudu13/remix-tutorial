import { CommentEntry, getComments } from "./comments";
import { data } from '../../FilmsData';

export type FilmCharacter = {
  id: string;
  name: string;
  gender?: string;
  age?: string;
  eye_color?: string;
  hair_color?: string;
};

export type Film = {
  id: string;
  title: string;
  original_title: string;
  description: string;
  image: string;
  movie_banner: string;
  people: string[];
  characters?: FilmCharacter[];
  comments?: CommentEntry[]
};

export async function getFilms(title?: string | null): Promise<Film[]> {
  const films: Film[] = data.films;

  return films.filter((film: Film): boolean =>
    title ? film.title.toLowerCase().includes(title.toLowerCase()) : true
  );
}

export async function getFilmById(filmId: string) {

  let filmWeAreLookingFor;

  for (let i = 0; i < data.films.length; i++) {
    let film = data.films[i];
    if (film.id === filmId) {
      filmWeAreLookingFor = film;

      const characters = await Promise.all(
          filmWeAreLookingFor.people
              .filter((url) => url !== 'https://ghibliapi.herokuapp.com/people/')
              .map((url) => fetch(url).then((res) => res.json()))
      );

      const comments = await getComments(filmId);

      return { ...film, characters, comments };
    }
  }

  return { };
}

export async function getFilmCharacter(characterId: string): Promise<FilmCharacter> {
  const response = await fetch(
    `https://ghibliapi.herokuapp.com/people/${characterId}`
  );

  if (!response.ok) {
    throw response;
  }

  return response.json();
}
