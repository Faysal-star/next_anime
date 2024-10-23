'use client';

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
import React from "react";
import Loading from "@/app/Loading";

async function getAnime(page: number, query: string, genre: string) {
  let url = `https://api.jikan.moe/v4/top/anime?page=${page}`;
  if (query) {
    url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(
      query
    )}&page=${page}`;
  } else if (genre) {
    url = `https://api.jikan.moe/v4/anime?genres=${genre}&page=${page}`;
  }

  console.log(url);
  const cachedData = localStorage.getItem(url);
  if (cachedData) {
    const parsedData = JSON.parse(cachedData);
    const now = new Date().getTime();
    if (now - parsedData.timestamp < 10 * 60 * 1000) {
      return parsedData.data;
    }
  }

  const res = await fetch(url);

  if (res.ok) {
    const data = await res.json();
    localStorage.setItem(url, JSON.stringify({ data, timestamp: new Date().getTime() }));
    return data;
  }

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

export default function AnimeGrid({
  page,
  query,
  genre,
}: {
  page: number;
  query: string;
  genre: string;
}) {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLoading(true);
    setError(null);
    async function fetchData() {
      try {
        const result = await getAnime(page, query, genre);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [page, query, genre]);

  if (loading) {
    return <div><Loading /> </div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
