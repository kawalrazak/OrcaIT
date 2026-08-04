import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  Cloud,
  Code2,
  DatabaseZap,
  Globe2,
  Headphones,
  Megaphone,
  MonitorCog,
  Network,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Workflow,
} from "lucide-react";

export type ServicePage = {
  slug: string;
  title: string;
  shortTitle: string;
  eyebrow: string;
  summary: string;
  hero: string;
  icon: LucideIcon;
  gradient: string;
  stats: Array<{ label: string; value: string }>;
  solutionsTitle: string;
  solutions: Array<{ title: string; copy: string; icon: LucideIcon }>;
  benefits: string[];
  process: Array<{ title: string; copy: string }>;
};

export const servicePages: ServicePage[] = [
  {
    slug: "software-development",
    title: "Software Development",
    shortTitle: "Software Development",
    eyebrow: "Custom platforms",
    summary:
      "Purpose-built software that removes manual work, connects your systems and gives your team a smoother way to operate.",
    hero:
      "We design and build practical business applications, portals and workflow tools around the way your organisation actually works.",
    icon: Code2,
    gradient: "from-brand-ink via-brand-navy to-brand-blue",
    stats: [
      { label: "Discovery-led", value: "01" },
      { label: "Built to scale", value: "02" },
      { label: "Secure delivery", value: "03" },
    ],
    solutionsTitle: "Software that fits your business",
    solutions: [
      {
        title: "Business applications",
        copy: "Custom tools for operations, staff workflows, reporting and customer-facing processes.",
        icon: Workflow,
      },
      {
        title: "Web portals",
        copy: "Secure client, staff or partner portals that centralise information and reduce admin.",
        icon: Globe2,
      },
      {
        title: "System integrations",
        copy: "Connect CRMs, accounting tools, cloud apps and databases so your data moves cleanly.",
        icon: DatabaseZap,
      },
      {
        title: "Modernisation",
        copy: "Refresh ageing tools with faster, more secure and easier-to-maintain digital systems.",
        icon: MonitorCog,
      },
    ],
    benefits: [
      "Less double handling and manual data entry.",
      "A platform designed around your real process.",
      "Clearer reporting and better visibility.",
      "A maintainable foundation for future growth.",
    ],
    process: [
      {
        title: "Map the workflow",
        copy: "We learn where the bottlenecks are and what the software must achieve.",
      },
      {
        title: "Design the experience",
        copy: "We shape simple screens, permissions and data flows before development begins.",
      },
      {
        title: "Build and improve",
        copy: "We deliver in stages, test with your team and refine the solution as it takes shape.",
      },
    ],
  },
  {
    slug: "crm-development",
    title: "CRM Development",
    shortTitle: "CRM Development",
    eyebrow: "Customer systems",
    summary:
      "CRM setup, customisation and automation that helps you manage leads, customers and follow-up with confidence.",
    hero:
      "We help turn scattered customer information into a clear sales and service system your team will actually use.",
    icon: BriefcaseBusiness,
    gradient: "from-brand-ink via-brand-navy to-brand-fun",
    stats: [
      { label: "Lead visibility", value: "100%" },
      { label: "Better follow-up", value: "24/7" },
      { label: "Cleaner data", value: "1 view" },
    ],
    solutionsTitle: "CRM tools for sales and service",
    solutions: [
      {
        title: "CRM implementation",
        copy: "Set up the right pipeline, customer fields, permissions and team workflows.",
        icon: BriefcaseBusiness,
      },
      {
        title: "Automation",
        copy: "Automate reminders, lead assignment, emails and follow-up steps to reduce missed opportunities.",
        icon: Workflow,
      },
      {
        title: "Reporting dashboards",
        copy: "See enquiries, activity, conversion and service performance in one place.",
        icon: BarChart3,
      },
      {
        title: "Data cleanup",
        copy: "Organise existing records and improve data quality before your team depends on it.",
        icon: DatabaseZap,
      },
    ],
    benefits: [
      "A single source of truth for customer relationships.",
      "Faster response to new enquiries.",
      "Better accountability across sales and support.",
      "Automated follow-up that keeps work moving.",
    ],
    process: [
      {
        title: "Understand your customer journey",
        copy: "We map enquiries, sales steps, onboarding and service touchpoints.",
      },
      {
        title: "Configure the platform",
        copy: "We create fields, pipelines, automations and dashboards for your team.",
      },
      {
        title: "Train and refine",
        copy: "We help your staff adopt the CRM and adjust it as real usage reveals opportunities.",
      },
    ],
  },
  {
    slug: "managed-it",
    title: "Managed IT for Businesses",
    shortTitle: "Managed IT",
    eyebrow: "Reliable support",
    summary:
      "Ongoing IT management, monitoring and support that keeps devices, users, networks and servers working smoothly.",
    hero:
      "Orca IT becomes your dependable technology partner, handling daily support and proactive maintenance so your team can stay productive.",
    icon: Headphones,
    gradient: "from-brand-ink via-brand-navy to-brand-blue",
    stats: [
      { label: "Support desk", value: "24/7" },
      { label: "Monitoring", value: "Always" },
      { label: "Less downtime", value: "Proactive" },
    ],
    solutionsTitle: "Managed IT that covers the essentials",
    solutions: [
      {
        title: "Service desk",
        copy: "Friendly remote and on-site support for everyday technical issues and user requests.",
        icon: Headphones,
      },
      {
        title: "Network support",
        copy: "Wi-Fi, routers, firewalls and connectivity kept stable, secure and ready.",
        icon: Network,
      },
      {
        title: "Endpoint management",
        copy: "Workstations, laptops and servers monitored, patched and maintained as one environment.",
        icon: MonitorCog,
      },
      {
        title: "Security baseline",
        copy: "Practical protection, updates and user guidance to reduce common business risks.",
        icon: ShieldCheck,
      },
    ],
    benefits: [
      "Predictable IT support without hiring a full internal team.",
      "Clear ownership when something goes wrong.",
      "Proactive maintenance instead of constant firefighting.",
      "A practical roadmap for upgrades and improvements.",
    ],
    process: [
      {
        title: "Assess your environment",
        copy: "We review devices, network, cloud systems, users and risks.",
      },
      {
        title: "Stabilise and protect",
        copy: "We prioritise urgent issues, monitoring, updates and security basics.",
      },
      {
        title: "Support and improve",
        copy: "We provide ongoing help desk support and planned improvements over time.",
      },
    ],
  },
  {
    slug: "it-consultancy",
    title: "IT Consultancy",
    shortTitle: "IT Consultancy",
    eyebrow: "Better decisions",
    summary:
      "Straightforward technology advice, audits and roadmaps that help you spend wisely and improve performance.",
    hero:
      "We translate technology decisions into clear business choices, helping you improve security, reliability and long-term value.",
    icon: BarChart3,
    gradient: "from-brand-ink via-brand-navy to-brand-fun",
    stats: [
      { label: "Roadmaps", value: "Clear" },
      { label: "Advice", value: "Practical" },
      { label: "Waste", value: "Reduced" },
    ],
    solutionsTitle: "Consulting that leads to action",
    solutions: [
      {
        title: "Technology audit",
        copy: "Review your systems, risks, vendors and costs to identify what needs attention.",
        icon: CheckCircle2,
      },
      {
        title: "Migration planning",
        copy: "Plan moves to better platforms, cloud systems or new infrastructure with less disruption.",
        icon: Workflow,
      },
      {
        title: "Network design",
        copy: "Create a reliable network plan that supports security, growth and daily performance.",
        icon: Network,
      },
      {
        title: "Vendor guidance",
        copy: "Get help comparing options, avoiding overbuying and selecting tools that fit.",
        icon: ShoppingBag,
      },
    ],
    benefits: [
      "Clear priorities before spending money.",
      "Less risk during upgrades and migrations.",
      "Better alignment between IT and business goals.",
      "Independent guidance without confusing jargon.",
    ],
    process: [
      {
        title: "Review",
        copy: "We understand the current environment, business pressure points and existing costs.",
      },
      {
        title: "Recommend",
        copy: "We provide a practical plan with priorities, risks and expected outcomes.",
      },
      {
        title: "Execute",
        copy: "We can support implementation or work alongside your internal team and vendors.",
      },
    ],
  },
  {
    slug: "cloud-computing",
    title: "Cloud Computing",
    shortTitle: "Cloud Computing",
    eyebrow: "Modern workplace",
    summary:
      "Cloud migration, Microsoft 365, Azure, backup and collaboration tools that make work more flexible and resilient.",
    hero:
      "We help businesses move from scattered, device-based systems to secure cloud platforms that staff can use from anywhere.",
    icon: Cloud,
    gradient: "from-brand-ink via-brand-navy to-brand-blue",
    stats: [
      { label: "Access", value: "Anywhere" },
      { label: "Backup", value: "Secure" },
      { label: "Scale", value: "Flexible" },
    ],
    solutionsTitle: "Cloud services that support modern work",
    solutions: [
      {
        title: "Microsoft 365",
        copy: "Licensing, configuration and support for email, Teams, SharePoint and collaboration.",
        icon: Cloud,
      },
      {
        title: "Azure services",
        copy: "Cloud infrastructure and compute options for business workloads and growth.",
        icon: Smartphone,
      },
      {
        title: "Cloud backup",
        copy: "Backup strategies that protect key business data from accidental loss and disruption.",
        icon: ShieldCheck,
      },
      {
        title: "Domain management",
        copy: "Domain setup, DNS and cloud identity support for a reliable online foundation.",
        icon: Globe2,
      },
    ],
    benefits: [
      "Flexible work from office, home or on the road.",
      "Reduced dependence on ageing local hardware.",
      "Stronger continuity with cloud backup options.",
      "Simpler collaboration across your team.",
    ],
    process: [
      {
        title: "Plan the move",
        copy: "We identify what should move, what should stay and how to reduce downtime.",
      },
      {
        title: "Configure securely",
        copy: "We set up identities, permissions, backup and access controls properly.",
      },
      {
        title: "Support adoption",
        copy: "We help your team use the tools confidently and safely.",
      },
    ],
  },
  {
    slug: "product-promise",
    title: "Product Promise",
    shortTitle: "Product Promise",
    eyebrow: "Hardware supply",
    summary:
      "Quality hardware supply, setup and warranty support for desktops, laptops, printers, routers, servers and gaming consoles.",
    hero:
      "We help you choose the right products, configure them correctly and support them after purchase.",
    icon: PackageCheck,
    gradient: "from-brand-ink via-brand-navy to-brand-fun",
    stats: [
      { label: "Setup", value: "Ready" },
      { label: "Support", value: "Local" },
      { label: "Warranty", value: "Backed" },
    ],
    solutionsTitle: "Products with practical support",
    solutions: [
      {
        title: "Business devices",
        copy: "Desktops and laptops selected for reliability, performance and staff needs.",
        icon: MonitorCog,
      },
      {
        title: "Network hardware",
        copy: "Routers, Wi-Fi equipment and related devices for stable connectivity.",
        icon: Network,
      },
      {
        title: "Servers and storage",
        copy: "On-premise or hybrid hardware options sized for your workload.",
        icon: Smartphone,
      },
      {
        title: "Printers and peripherals",
        copy: "Devices supplied, installed and configured so your team can use them quickly.",
        icon: ShoppingBag,
      },
    ],
    benefits: [
      "Avoid buying devices that do not fit your needs.",
      "Professional setup before staff start using equipment.",
      "Support when something needs attention.",
      "Better consistency across your business devices.",
    ],
    process: [
      {
        title: "Choose",
        copy: "We match product options to your budget, workload and environment.",
      },
      {
        title: "Configure",
        copy: "We set up devices, accounts, updates and security basics.",
      },
      {
        title: "Support",
        copy: "We help with warranty, troubleshooting and replacement planning.",
      },
    ],
  },
  {
    slug: "website-development",
    title: "Website Development",
    shortTitle: "Website Development",
    eyebrow: "Digital presence",
    summary:
      "Modern websites and web applications that are fast, secure, easy to update and designed to convert visitors.",
    hero:
      "We build polished websites that look professional, explain your value clearly and support your business goals.",
    icon: Globe2,
    gradient: "from-brand-ink via-brand-navy to-brand-blue",
    stats: [
      { label: "Performance", value: "Fast" },
      { label: "Design", value: "Modern" },
      { label: "Growth", value: "Ready" },
    ],
    solutionsTitle: "Websites that work as hard as you do",
    solutions: [
      {
        title: "Business websites",
        copy: "Responsive marketing sites that clearly present your services and encourage enquiries.",
        icon: Globe2,
      },
      {
        title: "Custom web apps",
        copy: "Tailored portals and web tools for staff, customers or operations.",
        icon: Code2,
      },
      {
        title: "UX and content structure",
        copy: "Clear page hierarchy and messaging that helps visitors find what they need.",
        icon: Workflow,
      },
      {
        title: "Performance and security",
        copy: "Modern foundations, safe deployment and speed-focused build practices.",
        icon: ShieldCheck,
      },
    ],
    benefits: [
      "A professional first impression.",
      "Clear service pages that support search and conversion.",
      "A faster, easier experience on mobile and desktop.",
      "Room to grow into forms, portals and integrations.",
    ],
    process: [
      {
        title: "Plan the message",
        copy: "We define the pages, content flow and calls to action.",
      },
      {
        title: "Design the interface",
        copy: "We create a clean visual system that matches your brand.",
      },
      {
        title: "Launch and improve",
        copy: "We build, test, publish and keep improving based on real needs.",
      },
    ],
  },
  {
    slug: "digital-marketing",
    title: "Digital Marketing",
    shortTitle: "Digital Marketing",
    eyebrow: "Online growth",
    summary:
      "Search, content, paid campaigns and social strategies that help the right customers find and trust your business.",
    hero:
      "We connect your website, content and campaigns into a practical marketing system focused on enquiries and growth.",
    icon: Megaphone,
    gradient: "from-brand-ink via-brand-navy to-brand-fun",
    stats: [
      { label: "Traffic", value: "Targeted" },
      { label: "Leads", value: "Focused" },
      { label: "Reporting", value: "Clear" },
    ],
    solutionsTitle: "Marketing with measurable direction",
    solutions: [
      {
        title: "SEO",
        copy: "Improve site structure, content and visibility so customers can find your services.",
        icon: Globe2,
      },
      {
        title: "Paid campaigns",
        copy: "Focused search and social campaigns built around real business outcomes.",
        icon: Megaphone,
      },
      {
        title: "Content marketing",
        copy: "Useful content that explains your expertise and builds trust before customers call.",
        icon: Workflow,
      },
      {
        title: "Conversion optimisation",
        copy: "Improve landing pages, calls to action and forms so more visitors become leads.",
        icon: BarChart3,
      },
    ],
    benefits: [
      "A clearer online message.",
      "Better quality website traffic.",
      "More consistent enquiry generation.",
      "Reporting that helps you decide what to do next.",
    ],
    process: [
      {
        title: "Audit",
        copy: "We review your current website, channels, audience and opportunities.",
      },
      {
        title: "Campaign plan",
        copy: "We define priorities, content themes, budgets and success measures.",
      },
      {
        title: "Optimise",
        copy: "We improve campaigns and pages based on performance data.",
      },
    ],
  },
];

export const servicePageLinks = servicePages.map((service) => ({
  title: service.shortTitle,
  href: `/services/${service.slug}`,
}));
