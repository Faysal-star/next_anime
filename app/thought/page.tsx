"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { MoveLeft } from "lucide-react";
import "@/app/globals.css";
import { Trash } from "lucide-react";

export default function ThoughtsForm() {
  const [animeName, setAnimeName] = useState("");
  const [review, setReview] = useState("");
  interface Review {
    animeName: string;
    review: string;
  }

  const [savedReviews, setSavedReviews] = useState<Review[]>([]);

  useEffect(() => {
    const storedReviews = localStorage.getItem("animeReviews");
    if (storedReviews) {
      setSavedReviews(JSON.parse(storedReviews));
    }
  }, []);

  const deleteReview = (animeName: string) => {
    const updatedReviews = savedReviews.filter(
      (review) => review.animeName !== animeName
    );
    localStorage.setItem("animeReviews", JSON.stringify(updatedReviews));
    setSavedReviews(updatedReviews);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReview = { animeName, review };
    const updatedReviews = [...savedReviews, newReview];
    localStorage.setItem("animeReviews", JSON.stringify(updatedReviews));
    setSavedReviews(updatedReviews);
    setAnimeName("");
    setReview("");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-3">
        <Link href="/" passHref>
          <Button variant={"outline"}>
            <MoveLeft />
            Back to Home
          </Button>
        </Link>
      </div>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Save a Thought</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="animeName">Anime Title</Label>
              <Input
                id="animeName"
                value={animeName}
                onChange={(e) => setAnimeName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="review">Thought (Markdown)</Label>
              <Textarea
                id="review"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={6}
                required
              />
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Preview</h3>
              <div className="p-4 border rounded-md bg-background">
                <ReactMarkdown className="prose dark:prose-invert max-w-none">
                  {review}
                </ReactMarkdown>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" onClick={handleSubmit}>
            Save
          </Button>
        </CardFooter>
      </Card>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-blue-300">Saved Thoughts</h2>
        <div className="flex flex-wrap -mx-2">
          {savedReviews.map((savedReview, index) => (
            <div key={index} className="w-full md:w-1/2 px-2 mb-4">
              <Card className="h-full">
                <div className="flex justify-between px-5 pt-5">
                  <CardTitle className="hover:text-cyan-200">
                    <span> #{index + 1} </span>
                    <Link
                      href={`/?q=${encodeURIComponent(savedReview.animeName)}`}
                    >
                      {savedReview.animeName}
                    </Link>
                  </CardTitle>
                  <Button
                    variant="outline"
                    className="hover:text-red-500 h-[30px] w-[30px] flex items-center justify-center"
                    onClick={() => deleteReview(savedReview.animeName)}
                  >
                    <Trash />
                  </Button>
                </div>
                <CardContent>
                  <div className="mt-4 prose dark:prose-invert max-w-none">
                    <ReactMarkdown>{savedReview.review}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
