import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Briefcase,
  Cloud,
  Code2,
  Contact,
  Cpu,
  Gamepad2,
  Globe,
  HardDrive,
  Headphones,
  Laptop,
  Layers,
  Mail,
  Megaphone,
  Monitor,
  Network,
  Phone,
  Printer,
  Router,
  Server,
  ShieldCheck,
  Tv,
  Users,
  Wifi,
} from "lucide-react";

export type ServiceItem = {
  title: string;
  copy: string;
  icon: LucideIcon;
  accent: string;
};

export type ServiceCategory = {
  id: string;
  label: string;
  description: string;
  services: ServiceItem[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: "home-it-support",
    label: "Home IT Support",
    description:
      "Friendly, practical technology help for your home — available remotely or at your location.",
    services: [
      {
        icon: Monitor,
        title: "Desktop PC Repairs",
        copy: "Diagnosis, repairs, upgrades and performance fixes for desktop computers.",
        accent: "bg-brand-mist text-brand-navy",
      },
      {
        icon: Wifi,
        title: "Internet & Networking",
        copy: "Reliable Wi-Fi, router and home network setup with help resolving connection problems.",
        accent: "bg-red-50 text-brand-fun",
      },
      {
        icon: ShieldCheck,
        title: "Virus Removal",
        copy: "Malware cleanup, security checks and practical protection for your computer and data.",
        accent: "bg-brand-mist text-brand-navy",
      },
      {
        icon: Mail,
        title: "Email Troubleshooting",
        copy: "Help with email setup, password issues, syncing, sending, receiving and account access.",
        accent: "bg-red-50 text-brand-fun",
      },
      {
        icon: Printer,
        title: "Printer Setup",
        copy: "Printer and scanner installation, Wi-Fi connection and troubleshooting for common faults.",
        accent: "bg-brand-mist text-brand-navy",
      },
      {
        icon: Laptop,
        title: "Mac Repairs",
        copy: "Support and troubleshooting for Mac computers, software, updates and connected devices.",
        accent: "bg-red-50 text-brand-fun",
      },
      {
        icon: HardDrive,
        title: "Data Recovery",
        copy: "Assessment and recovery support for important files from computers and storage devices.",
        accent: "bg-brand-mist text-brand-navy",
      },
      {
        icon: Tv,
        title: "Smart TV Setup",
        copy: "Smart TV connection, streaming app setup and help linking your home devices.",
        accent: "bg-red-50 text-brand-fun",
      },
      {
        icon: Headphones,
        title: "Remote & Phone Support",
        copy: "Convenient technical help by phone or secure remote connection when an on-site visit is not needed.",
        accent: "bg-brand-mist text-brand-navy",
      },
      {
        icon: Router,
        title: "Broadband",
        copy: "Broadband setup and troubleshooting to improve connection stability, coverage and speed.",
        accent: "bg-red-50 text-brand-fun",
      },
    ],
  },
  {
    id: "managed-it",
    label: "Managed IT & Support",
    description:
      "Proactive monitoring, responsive help desk support and complete IT management for homes and businesses.",
    services: [
      {
        icon: Headphones,
        title: "Managed IT for Businesses",
        copy: "We maintain, monitor and keep your systems and servers updated around the clock with experienced specialists.",
        accent: "bg-brand-mist text-brand-navy",
      },
      {
        icon: Phone,
        title: "24x7 Support Desk",
        copy: "Technicians available day and night to resolve issues, restore productivity and keep your team moving.",
        accent: "bg-red-50 text-brand-fun",
      },
      {
        icon: Briefcase,
        title: "IT Consultancy",
        copy: "Practical advice, vendor guidance and technology planning aligned to your business goals and budget.",
        accent: "bg-brand-mist text-brand-navy",
      },
      {
        icon: Wifi,
        title: "Network and NBN",
        copy: "Internet, Wi-Fi and network design, monitoring and troubleshooting to keep every connection reliable.",
        accent: "bg-red-50 text-brand-fun",
      },
      {
        icon: Monitor,
        title: "Endpoint Management",
        copy: "Client and server endpoints managed as one estate for security, stability and maximum uptime.",
        accent: "bg-brand-mist text-brand-navy",
      },
      {
        icon: Cpu,
        title: "All Devices Support",
        copy: "Computers, printers, routers, servers, firewalls and more — kept efficient and ready when you need them.",
        accent: "bg-red-50 text-brand-fun",
      },
      {
        icon: Layers,
        title: "Managed Services Plus",
        copy: "Advanced service management with reporting, vendor management, vCIO support and workstation coverage.",
        accent: "bg-brand-mist text-brand-navy",
      },
    ],
  },
  {
    id: "development",
    label: "Development & Digital",
    description:
      "Custom software, CRM platforms, websites and digital marketing built to help your business grow online.",
    services: [
      {
        icon: Code2,
        title: "Software Development",
        copy: "Tailored applications and business software designed around the way your team actually works.",
        accent: "bg-brand-mist text-brand-navy",
      },
      {
        icon: Contact,
        title: "CRM Development",
        copy: "Customer relationship platforms that streamline sales, service and follow-up across your organisation.",
        accent: "bg-red-50 text-brand-fun",
      },
      {
        icon: Globe,
        title: "Website Development",
        copy: "Modern, high-performing websites that represent your brand and convert visitors into customers.",
        accent: "bg-brand-mist text-brand-navy",
      },
      {
        icon: Megaphone,
        title: "Digital Marketing",
        copy: "Search, social and campaign support to strengthen your online presence and reach the right audience.",
        accent: "bg-red-50 text-brand-fun",
      },
    ],
  },
  {
    id: "cloud-comms",
    label: "Cloud, Comms & Hosting",
    description:
      "Cloud migration, business communications and hosting solutions that keep your organisation connected.",
    services: [
      {
        icon: Cloud,
        title: "Cloud Computing",
        copy: "Secure cloud migration, Microsoft 365, backup and collaboration solutions built for modern teams.",
        accent: "bg-brand-mist text-brand-navy",
      },
      {
        icon: Server,
        title: "Domains and Hosting",
        copy: "Domain registration, web hosting and ongoing management so your online presence stays secure and online.",
        accent: "bg-red-50 text-brand-fun",
      },
      {
        icon: Network,
        title: "VOIP & Dialers",
        copy: "Business phone systems, VoIP setup and dialer solutions that improve communication and call handling.",
        accent: "bg-brand-mist text-brand-navy",
      },
    ],
  },
  {
    id: "products",
    label: "Hardware & Product Store",
    description:
      "Quality hardware supply backed by our product promise, warranty support and expert setup assistance.",
    services: [
      {
        icon: ShieldCheck,
        title: "Product Promise",
        copy: "Backed by warranty support and dependable service so every product you buy performs as expected.",
        accent: "bg-brand-mist text-brand-navy",
      },
      {
        icon: Monitor,
        title: "Desktops",
        copy: "Business-grade desktop computers sourced, configured and supported for home or office use.",
        accent: "bg-red-50 text-brand-fun",
      },
      {
        icon: Laptop,
        title: "Laptops",
        copy: "Portable devices for staff and home users, selected for performance, reliability and value.",
        accent: "bg-brand-mist text-brand-navy",
      },
      {
        icon: Printer,
        title: "Printers",
        copy: "Printers and multifunction devices supplied, installed and maintained for smooth day-to-day printing.",
        accent: "bg-red-50 text-brand-fun",
      },
      {
        icon: Router,
        title: "Routers",
        copy: "Networking hardware for secure connectivity, coverage and performance across your environment.",
        accent: "bg-brand-mist text-brand-navy",
      },
      {
        icon: Server,
        title: "Servers",
        copy: "On-premise and hybrid server solutions sized, deployed and supported for your workload needs.",
        accent: "bg-red-50 text-brand-fun",
      },
      {
        icon: Gamepad2,
        title: "Gaming Consoles",
        copy: "Console supply and setup support for home entertainment and recreational technology needs.",
        accent: "bg-brand-mist text-brand-navy",
      },
    ],
  },
];

export const industries = [
  {
    icon: Briefcase,
    label: "Banking",
    copy: "Secure, compliant technology support for financial services environments.",
  },
  {
    icon: BarChart3,
    label: "Capital markets",
    copy: "Reliable infrastructure and support for fast-moving trading and finance teams.",
  },
  {
    icon: Server,
    label: "Manufacturing",
    copy: "Stable systems and connectivity to keep production and operations running smoothly.",
  },
  {
    icon: Users,
    label: "Healthcare",
    copy: "Dependable IT for clinics and care providers with privacy and uptime in mind.",
  },
  {
    icon: Globe,
    label: "Higher education",
    copy: "Modern campus technology, devices and support for staff and students.",
  },
];

export const footerServiceLinks = [
  "Managed IT for Businesses",
  "IT Consultancy",
  "Cloud Computing",
  "Software Development",
  "Website Development",
  "Domains and Hosting",
  "VOIP & Dialers",
];
