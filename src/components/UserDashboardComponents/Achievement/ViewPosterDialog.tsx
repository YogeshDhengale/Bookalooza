import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Copy, Facebook, Linkedin, Share2 } from "lucide-react";
import OptionDropdownMenu from "../../OpenDropDownMenu/OpenDropdownMenu";
import WhatsApp from "../../Footer/WhatsApp";
import { copyToClipboard } from "@/lib/utils";

interface Props {
  urlSlag: string;
  id: string;
  title: string;
  children: React.ReactNode;
}

const ViewPosterDialog: React.FC<Props> = ({ urlSlag, id, title, children }) => {
  const shareUrl = `${window.origin}/designer/share/authorBook/slug/${urlSlag}`;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Poster</DialogTitle>
          <DialogDescription>Share your poster with your friends and family.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="relative ring-8 ring-orange-600 rounded-lg overflow-hidden">
            <img
              src={`/designer/books/poster/${id}`}
              alt="Poster"
              className="w-full bg-slate-300"
              loading="lazy"
            />
            <SharePosterButton urlSlag={urlSlag} />
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input id="link" defaultValue={shareUrl} readOnly />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(shareUrl, "Link copied to clipboard successfully.")}
            >
              <Copy />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const SharePosterButton: React.FC<{ urlSlag: string }> = ({ urlSlag }) => {
  const shareUrl = `${window.origin}/designer/share/authorBook/slug/${urlSlag}`;

  return (
    <div className="absolute top-3 right-3">
      <OptionDropdownMenu
        Icon={Share2}
        options={[
          { title: "Facebook", icon: Facebook, onClick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, "_blank") },
          { title: "WhatsApp", icon: WhatsApp, onClick: () => window.open(`https://api.whatsapp.com/send?text=${shareUrl}`, "_blank") },
          { title: "LinkedIn", icon: Linkedin, onClick: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, "_blank") },
        ]}
      />
    </div>
  );
};

export default React.memo(ViewPosterDialog);
