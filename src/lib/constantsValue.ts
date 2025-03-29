import ankur from "../assets/images/ankur.png";
import anuj from "../assets/images/anuj.png";
import partho from "../assets/images/partho.png";
import parul from "../assets/images/parul.png";
import manu from "../assets/images/mannu.png";
import amita from "../assets/images/amita.png";
import yogesh from "../assets/images/yogesh.png";
import daulat from "../assets/images/daulat.png";
import deepak from "../assets/images/deepak.png";
import pankaj from "../assets/images/pankaj.png";
import shivali from "../assets/images/shivali.png";
import Consts from "./consts";
import { ArrowLeftRight, Bell, Facebook, Heading, History, House, Image, ImageUp, Instagram, Landmark, LibraryBig, Linkedin, Mic, PanelsTopLeft, PiggyBank, Trophy, Type, UserRound, Youtube } from "lucide-react";
import Twitter from "@/components/Footer/Twitter";
import Pinterest from "@/components/Footer/Pinterest";
import DesignPanel from "@/components/CanvasComponents/CanvasToolPanel/DesignPanel/DesignPanel";
import TextPanel from "@/components/CanvasComponents/CanvasToolPanel/TextPanel/TextPanel";
import HeadingPanel from "@/components/CanvasComponents/CanvasToolPanel/HeadingPanel/HeadingPanel";
import ImagesPanel from "@/components/CanvasComponents/CanvasToolPanel/ImagesPanel/ImagesPanel";
import UploadImagesPanel from "@/components/CanvasComponents/CanvasToolPanel/UploadImagesPanel/UploadImagesPanel";

export const RUPEE = '\u20B9';

export const NAV_LINKS = [
  {
    name: "About Us",
    link: "/about-us",
  },
  {
    name: "Create",
    link: "/newbook",
  },
  {
    name: "Bookstore",
    link: "/store",
  },
  {
    name: "Blogs",
    link: "/blogs",
  },
  {
    name: "Workshops",
    items: [
      { name: "School", link: "/workshops/school" },
      { name: "Student", link: "/workshops/student" },
    ],
  },
  {
    name: "Podcasts",
    link: "/podcasts",
  },
  {
    name: "Contact Us",
    link: "/contact-us",
  },
];

export const TEAM_MEMBERS = [
    {
      name: "Ankur Gupta",
      designation: "Director",
      image: ankur,
      details: {
        industry: [
          "Branding, Sales",
          "Growth",
          "Strategy",
          "Market",
          "Influence",
          "Revenue",
          "Advertising",
          "Networking",
          "Customer Acquisition",
        ],
        personal: [
          "Persuasive",
          "Visionary",
          "Strategic",
          "Energetic",
          "Goal-driven",
          "Motivational",
          "Adaptable",
          "Outgoing",
          "Dynamic",
        ],
      },
    },
    {
      name: "Deepak Garg",
      designation: "Director",
      image: deepak,
      details: {
        industry: [
          "Software Development",
          "AI & Automation",
          "Cybersecurity",
          "Cloud Computing",
          "Data Analytics",
          "System Architecture",
          "Scalability & Performance",
          "Product Innovation",
          "Tech Strategy",
        ],
        personal: [
          "Analytical",
          "Problem-solver",
          "Innovative",
          "Logical",
          "Detail-oriented",
          "Resilient",
          "Tech-savvy",
          "Strategic",
          "Adaptive",
          "Visionary",
        ],
      },
    },
    {
      name: "Amita Wadhwani",
      designation: "GM- Marketing",
      image: amita,
      details: {
        industry: [
          "Brand Strategy",
          "Digital Marketing",
          "Content Marketing",
          "Social Media Management",
          "Campaign Planning",
          "Market Research",
          "SEO & SEM",
          "Customer Engagement",
          "Performance Analytics",
        ],
        personal: [
          "Book Reading",
          "Meditation",
          "Exercise",
          "Reeling",
          "Networking",
          "Public Speaking",
          "Traveling",
          "Blogging",
          "Photography",
          "Music",
          "Copywriting",
        ],
      },
    },
    {
      name: "Daulat Singh",
      designation: "Video Editor",
      image: daulat,
      details: {
        industry: [
          "Editing",
          "Storytelling",
          "Transitions",
          "Motion",
          "Effects",
          "Color-grading",
          "Sound",
          "Composition",
          "Production",
        ],
        personal: [
          "Creative",
          "Detail-oriented",
          "Perceptive",
          "Storyteller",
          "Expressive",
          "Innovative",
          "Patient",
          "Observant",
          "Adaptive",
        ],
      },
    },
    {
      name: "Partho Banerjee",
      designation: "Graphics Designer",
      image: partho,
      details: {
        industry: [
          "Design",
          "Branding",
          "Illustration",
          "Typography",
          "Visuals",
          "Graphics",
          "Creativity",
          "Composition",
          "Photoshop Expert",
        ],
        personal: [
          "Creative",
          "Visionary",
          "Detail-oriented",
          "Artistic",
          "Passionate",
          "Innovative",
          "Imaginative",
          "Expressive",
          "Observant",
        ],
      },
    },
    {
      name: "Pankaj Sharma",
      designation: "Graphic Designer",
      image: pankaj,
      details: {
        industry: [
          "Typesetting",
          "Page Layout",
          "Cover Design",
          "Print Production",
          "Proofing",
          "E-book Formatting",
          "Typography Selection",
          "Color Correction",
          "Vector Graphics",
          "Image Editing",
        ],
        personal: [
          "Family time",
          "Playing with kids",
          "Health care",
          "Movies",
          "Music",
          "Cooking",
          "Travel",
          "Gardening",
          "Board games",
          "Photography",
        ],
      },
    },
    {
      name: "Parul Rana",
      designation: "Marketing Executive",
      image: parul,
      details: {
        industry: [
          "Branding",
          "Outreach",
          "Digital",
          "Engagement",
          "Strategy",
          "WhatsApp Advertising",
          "Social Media",
          "Campaigns",
          "Podcasting",
        ],
        personal: [
          "Persuasive",
          "Outgoing",
          "Strategic",
          "Passionate",
          "Creative",
          "Adaptable",
          "Data-driven",
          "Goal-oriented",
          "Visionary",
        ],
      },
    },
    {
      name: "Manu Sharma",
      designation: "Marketing Coordinator",
      image: manu,
      details: {
        industry: [
          "Planning",
          "Execution",
          "Books Editing",
          "Dispatch",
          "Customer Coordination",
          "Team Coordination",
          "Agency Management",
        ],
        personal: [
          "Organized",
          "Detail-oriented",
          "Communicative",
          "Strategic",
          "Collaborative",
          "Analytical",
          "Adaptable",
          "Proactive",
          "Resourceful",
          "Multitasker",
        ],
      },
    },
    {
      name: "Anuj Chauhan",
      image: anuj,
      designation: "Telesales cum Account Executive",
      details: {
        industry: [
          "Customer Interaction",
          "Lead Generation",
          "Follow-ups",
          "CRM Management",
          "Order Processing",
          "Data Entry",
          "Problem Solving",
          "Target Achievement",
          "Coordination",
        ],
        personal: [
          "Friendly",
          "Talkative",
          "Multitasker",
          "Adaptable",
          "Team Player",
          "Coffee Lover",
          "Social Media Scroller",
          "Quick Learner",
        ],
      },
    },
    {
      name: "Shivali Kashyap",
      image: shivali,
      designation: "Account Executive",
      details: {
        industry: [
          "Bookkeeping", "Cashflow", "Reconciliation", "Banking", "Taxation", "Tally", "Accounting", "Finance"
        ],
        personal: [
          "Melophile", "Digital-Savvy", "Curious", "Photographer", "Explorer", "Trendy", "Analytical", "Adaptable"
        ],
      },
    },
    {
      name: "Yogesh Dhengale",
      designation: "Software Engineer",
      image: yogesh,
      details: {
        industry: [
          "Software Development",
          "System Architecture",
          "API Integration",
          "UX Design",
          "Scalability & Performance",
          "Project Management",
          "Testing",
          "Maintenance",
          "Debugging",
        ],
        personal: [
          "Tech enthusiast",
          "Tech-savvy",
          "Creative soul",
          "Traveler",
          "Beach + Mountain person",
          "Family man"
        ],
      },
    },
];

export const CONTACT_INFO = [
  {
    title: "Call us at",
    link: "tel:+918799721408",
    linkText: Consts.phoneNumber,
  },
  {
    title: "Email us at",
    link: "mailto:info@bookalooza.com",
    linkText: Consts.email,
  },
  {
    title: "Reach us at",
    link: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${Consts.addressLine1}, ${Consts.addressLine2}`
    )}`,
    linkText: [
      Consts.addressLine1,
      Consts.addressLine2,
    ]
  },
]

export const USER_DASHBOARD_SIDEBAR = [
  {
    name: "Dashboard",
    url: "",
    icon: House
  },
  {
    name: "Profile",
    url: "profile",
    icon: UserRound
  },
  {
    name: "Library",
    url: "library",
    icon: LibraryBig
  },
  {
    name: "Order History",
    url: "order-history",
    icon: History
  },
  {
    name: "Bank Details",
    url: "bank-details",
    icon: Landmark
  },
  {
    name: "Earnings",
    url: "earnings",
    icon: PiggyBank
  },
  {
    name: "Royalty Earned",
    url: "royalty-earned",
    icon: ArrowLeftRight
  },
  {
    name: "Achievements",
    url: "achievements",
    icon: Trophy
  },
  {
    name: "Notification",
    url: "notifications",
    icon: Bell
  }
]
 
export const SocialMedia = [
  {
    title: "Facebook",
    link: "https://www.facebook.com/bookalooza",
    icon: Facebook,
  },
  {
    title: "Instagram",
    link: "https://www.instagram.com/bookalooza",
    icon: Instagram,
  },
  {
    title: "Youtube",
    link: "https://www.youtube.com/@Bookalooza?sub_confirmation=1",
    icon: Youtube,
  },
  {
    title: "LinkedIn",
    link: "https://www.linkedin.com/company/bookalooza/",
    icon: Linkedin,
  },
  { title: "Twitter", link: "https://twitter.com/bookalooza", icon: Twitter },
  {
    title: "Pinterest",
    link: "https://in.pinterest.com/Bookaloozacreatebooks",
    icon: Pinterest,
  },
];

type PanelComponent = React.FC & {
  Header?: React.FC;
};

export type NavItem = {
  title: string;
  url: string;
  icon: React.ElementType;
  isActive: boolean;
  component: PanelComponent;
};

export const PANEL_ITEMS: NavItem[] = [
  {
    title: "Designs",
    url: "#",
    icon: PanelsTopLeft,
    isActive: false,
    component: DesignPanel,
  },
  {
    title: "Text",
    url: "#",
    icon: Type,
    isActive: false,
    component: TextPanel,
  },
  {
    title: "Speech to text",
    url: "#",
    icon: Mic,
    isActive: false,
    component: TextPanel,
  },
  {
    title: "Heading",
    url: "#",
    icon: Heading,
    isActive: false,
    component: HeadingPanel,
  },
  {
    title: "Image",
    url: "#",
    icon: Image,
    isActive: false,
    component: ImagesPanel,
  },
  {
    title: "Upload Images",
    url: "#",
    icon: ImageUp,
    isActive: false,
    component: UploadImagesPanel,
  },
];