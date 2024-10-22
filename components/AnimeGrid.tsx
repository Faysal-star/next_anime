import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { MoveRight } from "lucide-react";

let lastRequestTime = 0;
const RATE_LIMIT_DELAY = 500;

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getAnime(page: number, query: string, genre: string) {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    await wait(RATE_LIMIT_DELAY - timeSinceLastRequest);
  }
  let url = `https://api.jikan.moe/v4/top/anime?page=${page}`;
  if (query) {
    url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(
      query
    )}&page=${page}`;
  } else if (genre) {
    url = `https://api.jikan.moe/v4/anime?genres=${genre}&page=${page}`;
  }

  console.log(url);
  const res = await fetch(url, {
    cache: 'force-cache',
    next: {
      revalidate: 3600
    }
  });
  lastRequestTime = Date.now();
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

export default async function AnimeGrid({
  page,
  query,
  genre,
}: {
  page: number;
  query: string;
  genre: string;
}) {
  const data = await getAnime(page, query, genre);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-6">
      {data.data.map((anime: any) => (
        <Card key={anime.mal_id} className="flex flex-col">
          <CardHeader>
            <Image
              src={anime.images.jpg.image_url}
              alt={anime.title}
              width={225}
              height={320}
              className="w-full h-64 object-cover rounded-t-lg"
            />
          </CardHeader>
          <CardContent className="flex-grow">
            <CardTitle className="mb-2">{anime.title}</CardTitle>
            <p className="text-sm text-muted-foreground mb-2">
              {anime.genres.map((genre: any) => genre.name).join(", ")}
            </p>
            <p className="text-sm line-clamp-3">{anime.synopsis}</p>
          </CardContent>
          <div className="flex justify-between mb-3 px-6">
            <p className="text-sm text-muted-foreground font-semibold">
              Rating: {anime.score}
            </p>
            <p className="text-sm text-muted-foreground font-semibold">
              Episodes: {anime.episodes}
            </p>
          </div>
          <CardFooter>
            <Link href={`/anime/${anime.mal_id}`} passHref>
              <Button variant="outline" className="w-full">
                Read More
                <MoveRight />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
