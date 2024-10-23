import SearchBar from "@/components/SearchBar";
import CategoryButtons from "@/components/CategoryButton";
import AnimeGrid from "@/components/AnimeGrid";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import { ModeToggle } from "@/components/ui/theme-toggle";

async function getGenres() {
  const url  = `https://api.jikan.moe/v4/genres/anime`;
  const response = await fetch(url, {
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

type SearchParams = Promise<{ page?: string; q?: string; genre?: string }>

export default async function Home(props :{
  searchParams : SearchParams
}) {
  const searchParams = props.searchParams
  const page = Number((await searchParams).page) || 1;
  const query = (await searchParams).q || "";
  const genre = (await searchParams).genre || "";
  const AllCategories = await getGenres();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-4xl  font-bold">
          <Link href="/" className="bg-gradient-to-r from-blue-500 via-green-500 to-cyan-500 inline-block text-transparent bg-clip-text">
            NEXT Anime
          </Link>
        </h1>
        <div className="flex gap-5 justify-center items-center">
          <Link href="/thought" className="text-muted-foreground font-semibold hover:text-cyan-200"> My Thoughts</Link>
        <ModeToggle />
        </div>
      </div>

      <SearchBar />
      <CategoryButtons AllCategories={AllCategories} />
        <AnimeGrid page={page} query={query} genre={genre} />
      <Pagination currentPage={page} />
    </main>
  );
}

