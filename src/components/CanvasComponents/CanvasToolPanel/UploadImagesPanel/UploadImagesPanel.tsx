import { cn } from "@/lib/utils";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Upload } from "lucide-react";

const imageUrls = [
  "https://www.bookalooza.com/designer/storage/userImages/649454b95ca4953fc19d01cb/thumbs/1728554910435_0.jpeg",
  "https://www.bookalooza.com/designer/storage/userImages/649454b95ca4953fc19d01cb/thumbs/1728560658250_0.jpg",
  "https://www.bookalooza.com/designer/storage/userImages/649454b95ca4953fc19d01cb/thumbs/1728560892936_0.jpg",
  "https://www.bookalooza.com/designer/storage/userImages/649454b95ca4953fc19d01cb/thumbs/1728561653838_0.jpeg",
  "https://www.bookalooza.com/designer/storage/userImages/649454b95ca4953fc19d01cb/thumbs/1728563409711_0.png",
  "https://www.bookalooza.com/designer/storage/userImages/649454b95ca4953fc19d01cb/thumbs/1728556409398_0.jpeg",
];

const getRandomImage = () => {
  return imageUrls[Math.floor(Math.random() * imageUrls.length)];
};

const data = new Array(12).fill(null).map(getRandomImage);

const UploadImagesPanel = () => {
  return (
    <SidebarContent>
      <SidebarGroup className="px-0">
        <SidebarGroupContent className="px-3 pt-2">
          <div className="columns-2 gap-2">
            {data.map((item, index) => (
              <div
                className={cn(
                  "break-inside-avoid relative bg-white shadow-md hover:shadow-lg",
                  index !== 0 && "mt-2"
                )}
                key={index}
              >
                <img
                  src={item}
                  alt={item}
                  className="w-full object-cover rounded-sm"
                />
                <Button className="absolute bg-primary w-6 h-6 top-2 right-2 bg-white rounded-full p-1">
                  <Trash2 color="#000" />
                </Button>
              </div>
            ))}
          </div>
          <div className="sticky bottom-0 p-3 bg-[hsl(var(--sidebar-background))]">
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
              <Upload /> Upload Image
            </Button>
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
};

UploadImagesPanel.Header = () => {
  return <></>;
};

export default UploadImagesPanel;
