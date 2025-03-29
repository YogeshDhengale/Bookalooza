import { store } from "@/store/store";
import { clsx, ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isUserLoggedIn(): boolean {
  const token = Boolean(localStorage.getItem("isLoggedIn")) ?? false; 
  return token;
}

export function getUserId(): string | null {
  if (!isUserLoggedIn()) return null;

  const user = store.getState().user?.user; // Use optional chaining

  return user?.userId ?? null; // Ensure `null` is returned if `userId` is missing
}

export function getAuthorFallback(fullName?: string): string {
  if(!fullName) return "B";
  return fullName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
}

export function getAccessToken(): boolean | null {
  return document.cookie.includes("access_token=") ? true : null;
}

export function processPath(path) {
  if (path.startsWith("/user")) {
      path = path.slice(5); // Remove '/user'
  }
  return path.split('/').reduce((acc, segment) => {
      if (segment) {
          acc.push({
              title: segment.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase()),
              link: segment
          });
      }
      return acc;
  }, []);
}

export function getFormattedDate(date: number, format: string = "dd-mm-yyyy"): string { 
  const dateObj = new Date(date);
  
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = String(dateObj.getFullYear());
  const shortYear = year.slice(-2);
  
  const hours24 = String(dateObj.getHours()).padStart(2, "0");
  const hours12 = String(dateObj.getHours() % 12 || 12).padStart(2, "0"); // 12-hour format
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const seconds = String(dateObj.getSeconds()).padStart(2, "0");
  const ampm = dateObj.getHours() >= 12 ? "PM" : "AM";

  return format
    .replace("dd", day).replace("d", String(dateObj.getDate())) // Support single-digit day
    .replace("mm", month).replace("m", String(dateObj.getMonth() + 1)) // Single-digit month
    .replace("yyyy", year).replace("yy", shortYear)
    .replace("HH", hours24).replace("H", String(dateObj.getHours())) // 24-hour format
    .replace("hh", hours12).replace("h", String(dateObj.getHours() % 12 || 12)) // 12-hour format
    .replace("MM", minutes).replace("M", String(dateObj.getMinutes())) // Minutes
    .replace("SS", seconds).replace("S", String(dateObj.getSeconds())) // Seconds
    .replace("A", ampm); // AM/PM
}

export function downloadFromURL(url: string, name: string): void {
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a); // Append to the DOM for better compatibility
  a.click();
  document.body.removeChild(a); // Clean up the DOM
}


export function downloadFromBlob(blob: Blob, name: string) {
  const URL = window.URL;
  let url: string | undefined;

  try {
    url = URL.createObjectURL(blob);
    downloadFromURL(url, name); // Assuming downloadFromURL is defined elsewhere
  } finally {
    if (url) URL.revokeObjectURL(url); // Ensure URL is revoked only if it was created
  }
}

export function copyToClipboard(text: string, successMsg: string = "Text copied to clipboard") {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      toast.success(successMsg);
    })
    .catch((err) => {
      toast.error("Failed to copy text to clipboard");
      console.error("Failed to copy text: ", err);
    });
}