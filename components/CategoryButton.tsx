import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";

const categories = [
  { id: 1, name: "Action" },
  { id: 2, name: "Adventure" },
  { id: 4, name: "Comedy" },
  { id: 8, name: "Drama" },
  { id: 10, name: "Fantasy" },
  { id: 14, name: "Horror" },
  { id: 22, name: "Romance" },
  { id: 24, name: "Sci-Fi" },
];

export default async function CategoryButtons( { AllCategories }: { AllCategories: any }) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((category) => (
        <Link href={`/?genre=${category.id}`} key={category.id}>
          <Button variant="outline">{category.name}</Button>
        </Link>
      ))}
      <Drawer>
        <DrawerTrigger>
          <Button variant="outline">More</Button>
        </DrawerTrigger>
        <DrawerContent className="fixed bottom-0 left-0 right-0 max-h-[90dvh]">
          <DrawerHeader>
            <DrawerTitle>All Genres</DrawerTitle>
            <DrawerClose />
          </DrawerHeader>
          <div className="h-[40vh]">
            <ScrollArea className="h-full">
              <div className="flex flex-wrap gap-3 p-4">
                {AllCategories.map((category: any) => (
                  <DrawerClose asChild key={category.id}>
                    <Link href={`/?genre=${category.id}`}>
                      <Button
                        variant="outline"
                        className="text-muted-foreground"
                      >
                        {category.name}
                      </Button>
                    </Link>
                  </DrawerClose>
                ))}
              </div>
            </ScrollArea>
          </div>
          <DrawerFooter>
            <DrawerClose asChild >
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
