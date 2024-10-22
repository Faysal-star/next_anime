import { Suspense } from "react";
import SearchBar from "@/components/SearchBar";
import CategoryButtons from "@/components/CategoryButton";
import AnimeGrid from "@/components/AnimeGrid";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import { ModeToggle } from "@/components/ui/theme-toggle";
import Loading from "./Loading";

async function getGenres() {
  const url  = `https://api.jikan.moe/v4/genres/anime`;
  const response = await fetch(url, {
    cache: 'force-cache',
    next: {
      revalidate: 3600
    }
  })
  if (!response.ok) {
    throw new Error("Failed to fetch genres");
  }
  const data = await response.json();
  interface Genre {
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }
  return data.data.map((genre: Genre ) => ({
    id: genre.mal_id,
    name: genre.name,
  }));
}

export default async function Home({
  searchParams,
}: {
  searchParams: { page?: string; q?: string; genre?: string };
}) {
  const page = Number((await searchParams).page) || 1;
  const query = (await searchParams).q || "";
  const genre = (await searchParams).genre || "";
  const AllCategories = await getGenres();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold mb-8 text-center">
          <Link href="/" className="bg-gradient-to-r from-blue-500 via-green-500 to-cyan-500 inline-block text-transparent bg-clip-text">
            NEXT Anime
          </Link>
        </h1>
        <ModeToggle />
      </div>

      <SearchBar />
      <CategoryButtons AllCategories={AllCategories} />
      <Suspense fallback={<Loading />}>
        <AnimeGrid page={page} query={query} genre={genre} />
      </Suspense>
      <Pagination currentPage={page} />
    </main>
  );
}

