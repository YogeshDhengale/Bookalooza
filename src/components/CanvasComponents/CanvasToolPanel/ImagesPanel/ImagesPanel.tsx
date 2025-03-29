import { cn } from "@/lib/utils";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import React, { useCallback, useState } from "react";

const imageUrls = [
  "https://www.bookalooza.com/designer/storage/userImages/649454b95ca4953fc19d01cb/thumbs/1728554910435_0.jpeg",
  "https://www.bookalooza.com/designer/storage/userImages/649454b95ca4953fc19d01cb/thumbs/1728560658250_0.jpg",
  "https://www.bookalooza.com/designer/storage/userImages/649454b95ca4953fc19d01cb/thumbs/1728560892936_0.jpg",
  "https://www.bookalooza.com/designer/storage/userImages/649454b95ca4953fc19d01cb/thumbs/1728561653838_0.jpeg",
  "https://www.bookalooza.com/designer/storage/userImages/649454b95ca4953fc19d01cb/thumbs/1728563409711_0.png",
  "https://www.bookalooza.com/designer/storage/userImages/649454b95ca4953fc19d01cb/thumbs/1728556409398_0.jpeg"
];

const getRandomImage = () => {
  return imageUrls[Math.floor(Math.random() * imageUrls.length)];
};

const ImagesPanel = () => {
  const [data, setData] = useState<string[]>(
    new Array(12).fill(null).map(getRandomImage)
  );
  const [loading, setLoading] = useState(false);

  const loadMoreImages = useCallback(() => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      const moreData = new Array(12).fill(null).map(getRandomImage);
      setData((prevData) => [...prevData, ...moreData]);
      setLoading(false);
    }, 1000);
  }, [loading]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const scrollBuffer = 20; // More semantic threshold
    const isNearBottom = 
      target.scrollHeight - target.scrollTop <= target.clientHeight + scrollBuffer;
    
    if (isNearBottom) {
        loadMoreImages();
    }
  };

  return (
    <SidebarContent onScroll={handleScroll} className="bg-white">
      <SidebarGroup className="px-0">
        <SidebarGroupContent className="px-3 py-2">
          <div className="columns-2 gap-2">
            {data.map((item, index) => (
              <div
                className={cn(
                  "break-inside-avoid bg-white rounded-lg shadow-md hover:shadow-lg",
                  index !== 0 && "mt-2"
                )}
                key={index}
              >
                <img src={item} alt={item} className="w-full rounded-sm object-cover" />
              </div>
            ))}
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
};
ImagesPanel.Header = () => {
  return <></>;
};

export default ImagesPanel;
