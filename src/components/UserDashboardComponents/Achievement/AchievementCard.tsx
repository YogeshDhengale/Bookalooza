import React, { useCallback } from "react";
import { Card, CardContent, CardDescription, CardTitle } from "../../ui/card";
import { Book } from "@/types/BookTypes";
import { downloadFromBlob, getFormattedDate } from "@/lib/utils";
import { Download, Share2 } from "lucide-react";
import { Button } from "../../ui/button";
import { fetchCertificate } from "@/actions/BookAction/BookAction";
import { toast } from "sonner";
import ViewPosterDialog from "./ViewPosterDialog";

interface Props {
  book: Book;
}

const AchievementCard: React.FC<Props> = ({ book }) => {
  const viewCertificate = useCallback(() => {
    fetchCertificate(book.id).then((res) => {
      const blob = new Blob([res], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    });
  }, [book.id]);

  const downloadCertificateHandler = useCallback(() => {
    fetchCertificate(book.id).then((response) => {
      const blob = new Blob([response], { type: "application/pdf" });
      downloadFromBlob(blob, `Bookalooza-certificate-${book.title.trim()}.pdf`);
      toast.success("Certificate downloaded successfully.");
    });
  }, [book.id, book.title]);

  return (
    <Card className="w-full">
      <CardContent className="p-3 md:p-4 flex gap-3">
        <img
          className="bg-slate-300 object-contain rounded shadow-xl"
          src={book.frontThumbURL}
          alt={book.title}
          width={96}
          height={144}
          loading="lazy"
        />
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex justify-between">
            <div>
              <CardTitle className="capitalize text-app">
                {book.title}
              </CardTitle>
              <CardDescription>
                Published on: {getFormattedDate(book.publishDate)}
              </CardDescription>
            </div>
            <div className="space-y-2 flex flex-col size-fit">
              <ViewPosterDialog
                urlSlag={book.urlSlag}
                id={book.id}
                title={book.title}
              >
                <Button variant="outline" size="icon" className="text-app">
                  <Share2 />
                </Button>
              </ViewPosterDialog>
              <Button
                variant="outline"
                size="icon"
                className="text-app"
                onClick={downloadCertificateHandler}
              >
                <Download />
              </Button>
            </div>
          </div>
          <div className="grid gap-1">
            <ViewPosterDialog
              urlSlag={book.urlSlag}
              id={book.id}
              title={book.title}
            >
              <Button variant="link" className="p-0 size-max text-sm">
                View Poster
              </Button>
            </ViewPosterDialog>
            <Button
              variant="link"
              className="p-0 size-max text-sm"
              onClick={viewCertificate}
            >
              View Certificate
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(AchievementCard);
