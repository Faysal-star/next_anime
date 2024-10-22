import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MoveLeft } from "lucide-react";

async function getAnimeDetails(id: string) {
  const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`);
  if (!res.ok) {
    throw new Error("Failed to fetch anime details");
  }
  return res.json();
}

const getModifiedUrl = (url: string) => {
  try {
    const videoUrl = new URL(url);
    videoUrl.searchParams.set("autoplay", "0");
    return videoUrl.toString();
  } catch {
    return url ? `${url}${url.includes("?") ? "&" : "?"}autoplay=0` : url;
  }
};

interface Genre {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

interface PageProps {
  params: {
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function AnimePage({ params }: PageProps) {
  const { data: anime } = await getAnimeDetails(params.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-3">
        <Link href="/" passHref>
          <Button variant={"outline"}>
            <MoveLeft />
            Back to Home
          </Button>
        </Link>
      </div>
      {anime.trailer.embed_url && (
        <div className="flex flex-col items-center w-full max-w-[50vw] mx-auto mb-5">
          <h3 className="font-semibold text-4xl mb-4 text-blue-400">
            {anime.title}
          </h3>
          <div className="w-full relative" style={{ paddingBottom: "56.25%" }}>
            <iframe
              title={`Trailer for ${anime.title}`}
              src={getModifiedUrl(anime.trailer.embed_url)}
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-lg"
            />
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold mb-4">
            {anime.title}
          </CardTitle>
          <div className="flex flex-col md:flex-row gap-6">
            <Image
              src={anime.images.jpg.large_image_url}
              alt={anime.title}
              width={350}
              height={500}
              className="rounded-lg"
            />
            <CardContent className="flex-grow">
              <p className="text-lg mb-4">{anime.synopsis}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Type:</h3>
                  <p className="text-muted-foreground">{anime.type}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Episodes:</h3>
                  <p className="text-muted-foreground">{anime.episodes}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Status:</h3>
                  <p className="text-muted-foreground">{anime.status}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Aired:</h3>
                  <p className="text-muted-foreground">{anime.aired.string}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Genres:</h3>
                  <p className="text-muted-foreground">
                    {anime.genres.map((genre: Genre) => genre.name).join(", ")}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Score:</h3>
                  <p className="text-muted-foreground">{anime.score}</p>
                </div>
              </div>
            </CardContent>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
