export type HomeServiceArticle = {
  slug: string;
  title: string;
  shortTitle: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  eyebrow: string;
  hero: string;
  image: string;
  imageAlt: string;
  secondaryImage: string;
  secondaryImageAlt: string;
  intro: string[];
  servicesTitle: string;
  problemsTitle: string;
  problems: Array<{ title: string; copy: string }>;
  coverageTitle: string;
  coverage: string[];
  whyTitle: string;
  why: string[];
  customerLoveTitle: string;
  customerLove: string[];
  brandsTitle: string;
  brandsCopy: string;
  brands: string[];
  faqs: Array<{ question: string; answer: string }>;
  relatedSlugs: string[];
};

export const homeServiceArticles: HomeServiceArticle[] = [
  {
    slug: "desktop-pc-repairs",
    title: "Desktop PC Repairs",
    shortTitle: "Desktop PC Repairs",
    metaTitle: "Desktop PC Repairs Australia | Home Computer Repair Near Me",
    metaDescription:
      "Professional desktop PC repairs for Australian homes. Fix slow computers, no power issues, hardware faults and upgrades with friendly Orca IT technicians.",
    keywords: [
      "desktop PC repairs",
      "computer repair near me",
      "PC repair Australia",
      "home computer repair",
      "desktop computer not turning on",
      "slow PC fix",
      "computer hardware repair",
    ],
    eyebrow: "Home IT Support",
    hero: "We know how frustrating computer problems can be. Whether the issue is big or small, Orca IT can help with desktop PC repairs and support for Australian homes.",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Desktop computer on a desk ready for repair",
    secondaryImage: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=900&q=80",
    secondaryImageAlt: "Computer technician working on a PC",
    intro: [
      "Need help with a PC that won’t turn on, runs slowly, needs a hardware upgrade, or keeps crashing? You’ll find a practical fix with Orca IT desktop PC repairs. Whether your computer is used for work-from-home, study or everyday family life, our technicians diagnose the problem clearly and recommend a tailored solution.",
      "Taking care of troublesome tech is what we do best. We can help remotely for many software issues, or arrange on-site support when hardware needs hands-on attention — so you can get back online as soon as possible.",
    ],
    servicesTitle: "What desktop PC repair services does Orca IT provide?",
    problemsTitle: "Common computer problems we repair",
    problems: [
      {
        title: "Computer won’t turn on",
        copy: "Power supply, cable, motherboard and startup faults diagnosed carefully so we can get your desktop running again.",
      },
      {
        title: "Slow PC and freezing",
        copy: "Startup cleanup, storage checks, driver updates and performance fixes when your computer feels unusable.",
      },
      {
        title: "Blue screens and crashes",
        copy: "We track down unstable software, failing hardware and Windows errors that keep interrupting your day.",
      },
      {
        title: "Hardware upgrades",
        copy: "SSD, RAM and component upgrades to improve speed and reliability when repair alone isn’t enough.",
      },
      {
        title: "Overheating and noisy fans",
        copy: "Cooling, dust buildup and hardware stress issues sorted before they cause bigger failures.",
      },
      {
        title: "General troubleshooting",
        copy: "Whatever odd behaviour your desktop is showing, we work through it step by step until there’s a clear answer.",
      },
    ],
    coverageTitle: "We’ve got you covered for desktop PC repairs",
    coverage: [
      "Orca IT provides home computer repair support for desktops used every day across Australia. From a machine that suddenly won’t start to a PC that has been slowing down for months, we focus on finding the real cause — not guesswork.",
      "We realise there is nothing worse than being disconnected, especially if you rely on your computer for work, school or staying in touch. That’s why we offer remote computer support for many software issues, with on-site help available when a technician needs to be there in person.",
      "Even if your desktop is working, we can still advise on sensible upgrades, better storage, and practical ways to keep performance stable. If the problem is something unusual, we take the time to investigate properly and explain your options in plain English.",
    ],
    whyTitle: "Why choose Orca IT for home computer repairs?",
    why: [
      "No computer issue is too big or too small — we walk you through the process clearly.",
      "Remote support when an on-site visit isn’t needed, plus on-site help for physical repairs.",
      "Friendly technicians who listen first, then provide a tailored solution.",
      "Clear pricing discussed before major work begins.",
      "Support for Windows PCs and everyday home computing setups.",
    ],
    customerLoveTitle: "Why customers choose Orca IT computer repair",
    customerLove: [
      "We get the job done and explain what was fixed",
      "We’re friendly and take time to go through things step by step",
      "We listen to your needs and provide a practical solution",
      "We focus on lasting fixes, not quick temporary patches",
      "It’s easy to get in touch by phone or email",
    ],
    brandsTitle: "We repair and troubleshoot major computer brands",
    brandsCopy:
      "Our technicians keep up to date with repair and troubleshooting needs across popular desktop and component brands used in Australian homes.",
    brands: ["HP", "Dell", "Lenovo", "Asus", "Acer", "Microsoft", "Custom-built PCs"],
    faqs: [
      {
        question: "How do I get help with my desktop computer?",
        answer: `Call Orca IT on 0450 577 407 or email info@orcait.com.au and tell us what’s happening. We’ll help you work out whether remote support or an on-site visit is the best next step.`,
      },
      {
        question: "Can you fix a PC that won’t turn on?",
        answer:
          "Yes. Desktops that won’t power on are a common request. We check power, connections and hardware to find the cause and recommend the best repair path.",
      },
      {
        question: "Do you only repair desktops?",
        answer:
          "Desktop PC repair is a core service, and we also help with related issues like virus removal, data recovery, networking and email setup.",
      },
    ],
    relatedSlugs: ["virus-removal", "data-recovery", "remote-phone-support", "mac-repairs"],
  },
  {
    slug: "internet-networking",
    title: "Internet & Home Networking",
    shortTitle: "Internet & Networking",
    metaTitle: "Wi-Fi & Home Network Setup Australia | Internet Troubleshooting",
    metaDescription:
      "Home Wi-Fi and networking support across Australia. Fix slow internet, dropouts, dead zones and router setup with Orca IT technicians.",
    keywords: [
      "Wi-Fi setup",
      "home network technician",
      "slow internet fix",
      "router setup Australia",
      "Wi-Fi not working",
      "home networking support",
      "internet troubleshooting",
    ],
    eyebrow: "Home IT Support",
    hero: "Slow Wi-Fi and dropouts are frustrating. Orca IT helps Australian homes set up reliable internet and home networks that actually cover the rooms you use.",
    image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Modern home Wi-Fi router for reliable networking",
    secondaryImage: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?auto=format&fit=crop&w=900&q=80",
    secondaryImageAlt: "Person using a laptop on home Wi-Fi",
    intro: [
      "Whether you need a new router configured, help with devices that won’t connect, or a home network that stops dropping out during video calls, Orca IT can provide practical internet and networking support.",
      "A stable wireless network lets you share internet, printers and files across the household. We’ll set things up properly and explain how it works in simple language.",
    ],
    servicesTitle: "What internet and networking help do we provide?",
    problemsTitle: "Home network issues we resolve",
    problems: [
      {
        title: "Slow Wi-Fi and buffering",
        copy: "We identify whether the problem is coverage, congestion, router settings or the broadband link itself.",
      },
      {
        title: "Wi-Fi dead zones",
        copy: "Better placement, extender or mesh advice so bedrooms and offices stay connected.",
      },
      {
        title: "Router and modem setup",
        copy: "New equipment configured correctly with your internet service and household devices.",
      },
      {
        title: "Devices won’t connect",
        copy: "Phones, laptops, TVs and printers brought onto the network cleanly and securely.",
      },
      {
        title: "Home network security",
        copy: "Stronger passwords, guest Wi-Fi options and safer settings for everyday family use.",
      },
      {
        title: "Work-from-home networking",
        copy: "More reliable connections for video meetings, cloud apps and shared household bandwidth.",
      },
    ],
    coverageTitle: "We’ve got you covered for home networking",
    coverage: [
      "Orca IT helps homes across Australia improve internet reliability — from first-time router setup through to stubborn dropouts that keep interrupting streaming and work.",
      "Many networking issues can be improved quickly once the real bottleneck is found. We separate broadband problems from Wi-Fi problems so you don’t replace the wrong equipment.",
      "If your home is larger or multi-level, we can advise on mesh Wi-Fi and practical coverage upgrades that fit your layout and budget.",
    ],
    whyTitle: "Why choose Orca IT for Wi-Fi and networking?",
    why: [
      "Clear diagnosis instead of random router resets",
      "Remote help for many configuration issues",
      "On-site support when placement and cabling matter",
      "Advice tailored to real Australian home layouts",
      "Security-minded setup for family networks",
    ],
    customerLoveTitle: "Why customers trust our networking support",
    customerLove: [
      "We explain the issue in plain English",
      "We improve coverage where it matters most",
      "We secure the network properly",
      "We help every device get connected",
      "We leave you with simple next steps",
    ],
    brandsTitle: "Routers and networking gear we commonly support",
    brandsCopy:
      "We work with popular consumer routers and mesh systems used in Australian homes.",
    brands: ["TP-Link", "Netgear", "Google Nest", "Asus", "Linksys", "ISP-supplied modems"],
    faqs: [
      {
        question: "Why is my home Wi-Fi so slow?",
        answer:
          "Common causes include weak signal, outdated routers, interference, too many devices, or an ISP issue. We test methodically so the fix targets the real cause.",
      },
      {
        question: "Can you set up a wireless home network?",
        answer:
          "Yes. We configure routers, connect your devices, and help you understand how the network works day to day.",
      },
      {
        question: "Do I need mesh Wi-Fi?",
        answer:
          "Not always. Sometimes better placement or a newer router is enough. We’ll recommend mesh only when it genuinely improves coverage.",
      },
    ],
    relatedSlugs: ["broadband", "printer-setup", "smart-tv-setup", "remote-phone-support"],
  },
  {
    slug: "virus-removal",
    title: "Virus, Spyware & Malware Removal",
    shortTitle: "Virus Removal",
    metaTitle: "Virus Removal Australia | Malware & Spyware Cleanup",
    metaDescription:
      "Virus, spyware and malware removal for home computers in Australia. Orca IT cleans infected PCs, restores performance and improves security.",
    keywords: [
      "virus removal",
      "malware removal Australia",
      "spyware removal",
      "computer virus cleanup",
      "remove ransomware",
      "infected PC repair",
      "antivirus setup",
    ],
    eyebrow: "Home IT Support",
    hero: "Just like people get sick, computers can catch viruses too. If your PC is slow, showing pop-ups, or sending emails you never wrote, Orca IT can help.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Cyber security lock concept on a laptop",
    secondaryImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=900&q=80",
    secondaryImageAlt: "Digital security and malware protection concept",
    intro: [
      "Virus, spyware and malware infections can steal time, damage trust in your computer, and put personal information at risk. Orca IT provides careful malware cleanup for Australian homes.",
      "We remove unwanted software, repair common browser and system damage where possible, and put practical protections in place so you’re safer going forward.",
    ],
    servicesTitle: "What malware cleanup services do we provide?",
    problemsTitle: "Warning signs we commonly treat",
    problems: [
      {
        title: "Pop-ups and browser redirects",
        copy: "Unwanted toolbars, hijacked searches and constant ads cleaned from your system.",
      },
      {
        title: "Sudden slow performance",
        copy: "Malware using your CPU and startup processes identified and removed.",
      },
      {
        title: "Suspicious emails sent from your account",
        copy: "Account and device checks when something looks compromised.",
      },
      {
        title: "Ransomware and locked files",
        copy: "Careful assessment of what’s recoverable and what protection you need next.",
      },
      {
        title: "Fake antivirus alerts",
        copy: "Scareware removed and genuine security tools configured properly.",
      },
      {
        title: "Ongoing security hardening",
        copy: "Windows security, updates and safer browsing habits set up after cleanup.",
      },
    ],
    coverageTitle: "We’ve got you covered for virus removal",
    coverage: [
      "Orca IT helps households get infected computers back under control. Many cleanups can be completed remotely, which means faster help when you need your PC urgently.",
      "We treat malware removal seriously: identify what’s on the machine, clean it thoroughly, and explain what changed so you’re not left guessing.",
      "After cleanup, we focus on prevention — safer settings, update checks and practical advice that reduces the chance of the same infection returning.",
    ],
    whyTitle: "Why choose Orca IT for virus and malware removal?",
    why: [
      "Careful cleanup that aims to protect your files",
      "Clear explanation of what was found",
      "No scare tactics or unnecessary product pushing",
      "Remote help available for many infections",
      "Practical prevention advice after the fix",
    ],
    customerLoveTitle: "Why customers choose our malware cleanup",
    customerLove: [
      "We take security concerns seriously",
      "We explain risks without jargon",
      "We clean thoroughly, then harden settings",
      "We help you feel confident using the PC again",
      "We’re easy to contact when something feels wrong",
    ],
    brandsTitle: "Systems we commonly clean and secure",
    brandsCopy:
      "We support virus and malware cleanup across popular Windows PCs and home computing setups.",
    brands: ["Windows 10", "Windows 11", "HP", "Dell", "Lenovo", "Asus", "Acer"],
    faqs: [
      {
        question: "Can you remove a virus without deleting my files?",
        answer:
          "In most cases yes. We prioritise safe cleanup. If files look at risk, we discuss options before major changes.",
      },
      {
        question: "How do I know if my computer has malware?",
        answer:
          "Pop-ups, redirects, sudden slowness, unknown programs and strange outbound emails are common signs. If you’re unsure, get it checked early.",
      },
      {
        question: "Will the virus come back?",
        answer:
          "We strengthen protections and share safer habits. Good security reduces risk, but careful browsing still matters.",
      },
    ],
    relatedSlugs: ["desktop-pc-repairs", "data-recovery", "remote-phone-support", "email-troubleshooting"],
  },
  {
    slug: "email-troubleshooting",
    title: "Email Setup & Troubleshooting",
    shortTitle: "Email Troubleshooting",
    metaTitle: "Email Setup & Troubleshooting Australia | Outlook & Gmail Help",
    metaDescription:
      "Email setup and troubleshooting for Australian homes. Fix Outlook, Gmail, send/receive errors, syncing issues and mail app problems with Orca IT.",
    keywords: [
      "email troubleshooting",
      "Outlook not working",
      "Gmail setup help",
      "email not sending",
      "email not receiving",
      "mail app configuration",
      "email support Australia",
    ],
    eyebrow: "Home IT Support",
    hero: "It’s hard to get by without email. Orca IT helps Australian homes set up and troubleshoot email so sending, receiving and syncing work again.",
    image: "https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Laptop showing messaging and email apps on a bright desk",
    secondaryImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=900&q=80",
    secondaryImageAlt: "Person setting up email on a laptop at a bright desk",
    intro: [
      "Whether you’re configuring a new laptop, recovering access after a password change, or stuck with Outlook errors, our technicians can help get email reliable again.",
      "We’ll walk you through setup on computers and phones, fix common send/receive issues, and leave you confident checking and sending messages.",
    ],
    servicesTitle: "What email support does Orca IT provide?",
    problemsTitle: "Email issues we fix every day",
    problems: [
      {
        title: "Email not sending or receiving",
        copy: "Server settings, authentication and network causes checked and corrected.",
      },
      {
        title: "Outlook problems",
        copy: "Password loops, crashes, sync delays and profile repairs handled carefully.",
      },
      {
        title: "Gmail and webmail setup",
        copy: "Accounts configured cleanly on Windows, Mac, iPhone and Android.",
      },
      {
        title: "New device email setup",
        copy: "Mail apps installed and configured so your inbox follows you to the new device.",
      },
      {
        title: "Spam and missing mail",
        copy: "Filters, junk folders and rules reviewed when important messages go missing.",
      },
      {
        title: "Account security help",
        copy: "Guidance on safer passwords and two-factor authentication after access issues.",
      },
    ],
    coverageTitle: "We’ve got you covered for email setup and support",
    coverage: [
      "Orca IT supports the email tools Australian households actually use — Outlook, Gmail, Apple Mail and popular ISP mail accounts.",
      "Most email problems can be resolved remotely, which means faster help without waiting for a home visit when software settings are the issue.",
      "We don’t just “make it work once”. We aim for a stable setup you can keep using confidently on your computer and phone.",
    ],
    whyTitle: "Why choose Orca IT for email help?",
    why: [
      "Support across major mail apps and providers",
      "Remote fixes for most send/receive problems",
      "Clear walkthroughs for less technical users",
      "Security-minded account recovery guidance",
      "Help for both computers and mobile devices",
    ],
    customerLoveTitle: "Why customers value our email support",
    customerLove: [
      "We fix the immediate problem quickly",
      "We explain settings in simple language",
      "We help on computers and phones",
      "We reduce repeat password headaches",
      "We’re patient with every question",
    ],
    brandsTitle: "Email platforms we commonly support",
    brandsCopy: "We help with mainstream email providers and applications used at home.",
    brands: ["Outlook", "Gmail", "Apple Mail", "Yahoo Mail", "Outlook.com", "ISP email"],
    faqs: [
      {
        question: "Can you set up Outlook for my email address?",
        answer:
          "Yes. We configure Outlook with the correct account settings so send, receive and syncing work reliably.",
      },
      {
        question: "Why does email keep asking for my password?",
        answer:
          "Usually outdated credentials, provider security changes, or incorrect app settings. We identify the cause and stabilise the login.",
      },
      {
        question: "Do you support email on phones as well?",
        answer:
          "Yes. We can help set up and troubleshoot email on iPhone and Android devices too.",
      },
    ],
    relatedSlugs: ["remote-phone-support", "mac-repairs", "desktop-pc-repairs", "virus-removal"],
  },
  {
    slug: "printer-setup",
    title: "Printer Setup & Installation",
    shortTitle: "Printer Setup",
    metaTitle: "Printer Setup Australia | Wi-Fi Printer Installation & Repair Help",
    metaDescription:
      "Printer setup and troubleshooting for Australian homes. Connect Wi-Fi or USB printers, fix offline errors, drivers and scanning with Orca IT.",
    keywords: [
      "printer setup",
      "Wi-Fi printer installation",
      "printer not connecting",
      "printer troubleshooting Australia",
      "wireless printer help",
      "printer driver install",
      "scanner setup",
    ],
    eyebrow: "Home IT Support",
    hero: "Just bought a new printer, or stuck with one that says offline? Orca IT helps Australian homes set printers up properly and explore the features you actually need.",
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Home office printer setup",
    secondaryImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
    secondaryImageAlt: "Computer workstation ready for printer and device setup",
    intro: [
      "Printers should make life easier, but wireless setup, drivers and scanning often create more frustration than the printing itself. Our technicians install and troubleshoot home printers clearly and patiently.",
      "We connect USB and Wi-Fi printers, get multiple household devices printing, and help with common scan and queue problems.",
    ],
    servicesTitle: "What printer services does Orca IT provide?",
    problemsTitle: "Printer problems we solve",
    problems: [
      {
        title: "Wi-Fi printer connection",
        copy: "Wireless printers joined to your network and made visible to your computers and phones.",
      },
      {
        title: "Printer offline errors",
        copy: "Queue, driver and network issues fixed when Windows keeps saying the printer is offline.",
      },
      {
        title: "Driver installation",
        copy: "Correct software installed after a new PC, update or printer replacement.",
      },
      {
        title: "Scan setup",
        copy: "Scanning features configured where your printer or all-in-one supports them.",
      },
      {
        title: "Shared household printing",
        copy: "One printer set up for laptops, desktops and mobile devices in the home.",
      },
      {
        title: "New printer installation",
        copy: "Unboxing-to-ready setup so you can print documents the same day.",
      },
    ],
    coverageTitle: "We’ve got you covered for printer setup",
    coverage: [
      "Orca IT supports the printer brands and setups commonly used in Australian homes, from compact inkjets to all-in-one wireless machines.",
      "Many driver and software issues can be resolved remotely. When network placement or cabling is the blocker, on-site help is available.",
      "Our goal is simple: reliable printing without a ritual of restarts, reinstalls and guesswork every time you need one page.",
    ],
    whyTitle: "Why choose Orca IT for printer help?",
    why: [
      "USB and Wi-Fi printer experience",
      "Setup across mixed household devices",
      "Clear instructions you can reuse later",
      "Remote support for many software faults",
      "Practical troubleshooting, not endless reinstall loops",
    ],
    customerLoveTitle: "Why customers use us for printer setup",
    customerLove: [
      "We get printers online quickly",
      "We make scanning less confusing",
      "We connect the whole household",
      "We explain the settings that matter",
      "We’re patient with every brand quirk",
    ],
    brandsTitle: "Printer brands we commonly support",
    brandsCopy: "We help install and troubleshoot popular home printer brands.",
    brands: ["HP", "Epson", "Brother", "Canon", "Xerox", "Samsung"],
    faqs: [
      {
        question: "Why does my printer say offline?",
        answer:
          "Usually Wi-Fi, IP, driver or print-spooler issues. We reconnect it properly and stabilise the settings that keep knocking it offline.",
      },
      {
        question: "Can you connect one printer to multiple devices?",
        answer:
          "Yes. Once the printer is on the network correctly, we can help computers and phones print to it.",
      },
      {
        question: "Do you set up brand-new printers?",
        answer:
          "Yes. New printer installation and first-time wireless setup are common requests.",
      },
    ],
    relatedSlugs: ["internet-networking", "desktop-pc-repairs", "remote-phone-support", "email-troubleshooting"],
  },
  {
    slug: "mac-repairs",
    title: "Mac Repairs & Support",
    shortTitle: "Mac Repairs",
    metaTitle: "Mac Repairs Australia | MacBook & iMac Support Near Me",
    metaDescription:
      "Mac repairs and support for Australian homes. Fix slow MacBooks, iMac issues, macOS problems, backups and everyday Apple troubleshooting with Orca IT.",
    keywords: [
      "Mac repairs",
      "MacBook repair Australia",
      "iMac support",
      "slow Mac fix",
      "macOS troubleshooting",
      "Apple computer repair",
      "Mac technician near me",
    ],
    eyebrow: "Home IT Support",
    hero: "Whether you use a MacBook or iMac at home, Orca IT provides friendly Mac support when performance drops, updates fail, or everyday Apple tools stop cooperating.",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Apple MacBook on a desk",
    secondaryImage: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
    secondaryImageAlt: "Laptop open on a wooden table",
    intro: [
      "Macs are excellent machines, but they still need care — especially after years of files, apps and system updates. We help Australian home users troubleshoot Mac software issues and improve day-to-day reliability.",
      "From slowdowns and storage warnings to email, printers and migration help, we provide clear Apple-aware support without the jargon.",
    ],
    servicesTitle: "What Mac support does Orca IT provide?",
    problemsTitle: "Mac issues we help with",
    problems: [
      {
        title: "Slow MacBook or iMac",
        copy: "Storage, startup items and background processes checked to restore smoother performance.",
      },
      {
        title: "macOS update problems",
        copy: "Failed updates, login issues and system glitches worked through carefully.",
      },
      {
        title: "Storage full warnings",
        copy: "Safe cleanup guidance so you free space without deleting the wrong files.",
      },
      {
        title: "Backup and Time Machine help",
        copy: "Backup routines set up so important photos and documents are protected.",
      },
      {
        title: "Printers and peripherals",
        copy: "Displays, printers and accessories connected cleanly to your Mac.",
      },
      {
        title: "Moving to a new Mac",
        copy: "Migration help so your accounts, files and everyday apps come across smoothly.",
      },
    ],
    coverageTitle: "We’ve got you covered for Mac repairs and support",
    coverage: [
      "Orca IT supports Apple computers used at home for work, study and family life. Many software and setup issues can be handled remotely.",
      "If hardware service is required, we give honest advice based on your model and situation so you know the best next step.",
      "Our approach is patient and practical: understand the problem, fix what we can, and make sure you understand how to keep things running well.",
    ],
    whyTitle: "Why choose Orca IT for Mac help?",
    why: [
      "Apple-aware troubleshooting for home users",
      "Remote support for many software issues",
      "Clear explanations without technical overwhelm",
      "Help with backups, email and connected devices",
      "Honest guidance when hardware service is needed",
    ],
    customerLoveTitle: "Why customers choose our Mac support",
    customerLove: [
      "We respect how you already use your Mac",
      "We explain options before major changes",
      "We improve speed where possible",
      "We help with the apps you rely on",
      "We’re calm and easy to understand",
    ],
    brandsTitle: "Apple devices we commonly support",
    brandsCopy: "We help with popular Apple computers and related home setups.",
    brands: ["MacBook Air", "MacBook Pro", "iMac", "Mac mini", "macOS Sonoma", "macOS Sequoia"],
    faqs: [
      {
        question: "Do you repair MacBooks and iMacs?",
        answer:
          "We provide Mac software support, performance fixes and troubleshooting. For physical hardware faults, we advise the most practical next step for your model.",
      },
      {
        question: "Can you speed up a slow Mac?",
        answer:
          "Yes. We check storage pressure, startup items and software issues that commonly make Macs feel sluggish.",
      },
      {
        question: "Can you help me move to a new Mac?",
        answer:
          "Yes. Migration, account setup and transferring everyday files are all part of our Mac support.",
      },
    ],
    relatedSlugs: ["data-recovery", "email-troubleshooting", "remote-phone-support", "desktop-pc-repairs"],
  },
  {
    slug: "data-recovery",
    title: "Data Recovery",
    shortTitle: "Data Recovery",
    metaTitle: "Data Recovery Australia | Recover Files from PC or Hard Drive",
    metaDescription:
      "Home data recovery support in Australia. Orca IT helps recover documents, photos and files from PCs, Macs and storage devices after deletion or drive failure.",
    keywords: [
      "data recovery",
      "recover deleted files",
      "hard drive recovery Australia",
      "USB data recovery",
      "recover photos from computer",
      "failed hard drive",
      "file recovery service",
    ],
    eyebrow: "Home IT Support",
    hero: "That sinking feeling when files go missing is awful. If you think you’ve lost important documents or photos, Orca IT can help assess recovery options.",
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Hard drive and computer storage components",
    secondaryImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
    secondaryImageAlt: "Computer circuit board representing stored data",
    intro: [
      "Accidentally deleted folders, failing hard drives and computers that won’t boot can put precious family and work files at risk. We provide careful home data recovery support across Australia.",
      "We start with an assessment, explain what’s realistic, and prioritise the files that matter most — then help you set up better backups so it doesn’t happen again.",
    ],
    servicesTitle: "What data recovery help do we provide?",
    problemsTitle: "Data loss situations we assess",
    problems: [
      {
        title: "Deleted documents and photos",
        copy: "Logical recovery attempts when files were removed but the drive is still healthy.",
      },
      {
        title: "Hard drive not detected",
        copy: "Careful checks when Windows or macOS can no longer see your storage.",
      },
      {
        title: "Computer won’t boot",
        copy: "File access options explored before repair or reinstall decisions.",
      },
      {
        title: "USB and external drive issues",
        copy: "Support for many common portable drives used at home.",
      },
      {
        title: "Corruption after crashes",
        copy: "Assessment after sudden shutdowns, power loss or failed updates.",
      },
      {
        title: "Backup planning after recovery",
        copy: "Practical backup advice so recovered files stay protected.",
      },
    ],
    coverageTitle: "We’ve got you covered for data recovery support",
    coverage: [
      "Orca IT understands how stressful data loss is. We won’t leave obvious options unexplored, and we’ll be honest when recovery is unlikely.",
      "The sooner you stop using a failing drive, the better your chances. If something feels wrong, power down and contact us for guidance.",
      "Where recovery succeeds, we also help you put a simple backup routine in place — because prevention is always cheaper than emergency recovery.",
    ],
    whyTitle: "Why choose Orca IT for data recovery?",
    why: [
      "Care-first process that avoids risky guesswork",
      "Clear communication about likely outcomes",
      "Focus on your most important files first",
      "Support for PCs, Macs and common external drives",
      "Backup recommendations after the recovery effort",
    ],
    customerLoveTitle: "Why customers trust us with their files",
    customerLove: [
      "We take data loss seriously",
      "We explain chances honestly",
      "We prioritise irreplaceable files",
      "We avoid reckless DIY risks",
      "We help prevent repeat loss",
    ],
    brandsTitle: "Storage we commonly assess",
    brandsCopy: "We help with many consumer storage devices used in Australian homes.",
    brands: ["Internal HDDs", "SSDs", "USB flash drives", "External hard drives", "Windows PCs", "Macs"],
    faqs: [
      {
        question: "Can all lost data be recovered?",
        answer:
          "Not always. Success depends on how the data was lost and the condition of the drive. We assess first and explain realistic options.",
      },
      {
        question: "Should I keep using a failing hard drive?",
        answer:
          "No. Continued use can make recovery harder. Stop using the device and seek assessment as soon as possible.",
      },
      {
        question: "Do you recover data from USB drives?",
        answer:
          "Yes, for many common consumer USB and external drives. We’ll confirm suitability after reviewing the symptoms.",
      },
    ],
    relatedSlugs: ["desktop-pc-repairs", "virus-removal", "mac-repairs", "remote-phone-support"],
  },
  {
    slug: "smart-tv-setup",
    title: "Smart TV Setup",
    shortTitle: "Smart TV Setup",
    metaTitle: "Smart TV Setup Australia | Streaming Apps & Wi-Fi TV Help",
    metaDescription:
      "Smart TV setup for Australian homes. Connect Wi-Fi, install streaming apps, fix casting issues and link devices with friendly Orca IT support.",
    keywords: [
      "Smart TV setup",
      "connect TV to Wi-Fi",
      "streaming app setup",
      "Netflix on TV",
      "Chromecast setup",
      "Smart TV not connecting",
      "home entertainment setup",
    ],
    eyebrow: "Home IT Support",
    hero: "A new Smart TV should make entertainment easier. Orca IT helps Australian homes connect TVs to Wi-Fi, install streaming apps and sort casting problems.",
    image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Family watching a smart TV in a living room",
    secondaryImage: "https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=900&q=80",
    secondaryImageAlt: "Living room entertainment setup with TV",
    intro: [
      "From first-time setup to buffering and app login issues, we make living-room technology simpler for the whole household.",
      "Whether you need Netflix and other apps installed, help connecting sound equipment, or a TV that refuses to join Wi-Fi, we can guide you through it clearly.",
    ],
    servicesTitle: "What Smart TV services does Orca IT provide?",
    problemsTitle: "Smart TV issues we resolve",
    problems: [
      {
        title: "TV won’t connect to Wi-Fi",
        copy: "Network settings and signal issues fixed so your TV stays online.",
      },
      {
        title: "Streaming app setup",
        copy: "Popular Australian streaming apps installed and ready to watch.",
      },
      {
        title: "Buffering and playback issues",
        copy: "Connection and settings checks when shows keep stalling.",
      },
      {
        title: "Casting from phone to TV",
        copy: "Chromecast-style and screen-mirroring problems troubleshot carefully.",
      },
      {
        title: "HDMI and input confusion",
        copy: "Inputs, soundbars and basic connection setup made understandable.",
      },
      {
        title: "Software updates",
        copy: "TV system updates and account setup completed where needed.",
      },
    ],
    coverageTitle: "We’ve got you covered for Smart TV setup",
    coverage: [
      "Orca IT helps households get value from the Smart TV they already own — connected properly, apps installed, and everyday features explained.",
      "Many app and account issues can be handled with guided remote support. When cables and living-room layout matter, on-site help is available.",
      "We focus on a setup the whole family can use, not a complicated arrangement only one person understands.",
    ],
    whyTitle: "Why choose Orca IT for Smart TV help?",
    why: [
      "Patient setup for every age group",
      "Help with Wi-Fi, apps and casting",
      "Remote guidance for many software issues",
      "On-site support for physical connections",
      "Clear instructions left behind for the household",
    ],
    customerLoveTitle: "Why customers use our TV setup service",
    customerLove: [
      "We remove the confusion quickly",
      "We get streaming apps working",
      "We explain inputs and casting simply",
      "We improve Wi-Fi for smoother playback",
      "We’re calm with first-time Smart TV users",
    ],
    brandsTitle: "TV platforms we commonly support",
    brandsCopy: "We help with popular Smart TV brands and streaming devices used at home.",
    brands: ["Samsung", "LG", "Sony", "Hisense", "TCL", "Chromecast", "Fire TV Stick"],
    faqs: [
      {
        question: "Can you set up Netflix and other apps on my TV?",
        answer:
          "Yes. We install popular streaming apps, help with logins, and confirm playback on your home network.",
      },
      {
        question: "Why is my Smart TV buffering?",
        answer:
          "Often Wi-Fi strength, congestion or TV settings. We check the connection path and recommend practical fixes.",
      },
      {
        question: "Do you help with Chromecast and Fire Stick?",
        answer:
          "Yes. Common streaming sticks and casting devices are part of our Smart TV support.",
      },
    ],
    relatedSlugs: ["internet-networking", "broadband", "remote-phone-support", "printer-setup"],
  },
  {
    slug: "remote-phone-support",
    title: "Remote & Phone Support",
    shortTitle: "Remote & Phone Support",
    metaTitle: "Remote Computer Support Australia | Phone IT Help at Home",
    metaDescription:
      "Remote and phone IT support for Australian homes. Fix computer, email, Wi-Fi and software issues securely with Orca IT — no on-site visit required for many jobs.",
    keywords: [
      "remote computer support",
      "phone IT support Australia",
      "remote desktop help",
      "online tech support",
      "computer help by phone",
      "remote IT assistance",
      "home tech support",
    ],
    eyebrow: "Home IT Support",
    hero: "Many tech problems can be fixed without a home visit. Orca IT provides remote and phone support so Australian households get expert help quickly and securely.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Friendly IT support specialist on a phone headset call",
    secondaryImage: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=900&q=80",
    secondaryImageAlt: "Remote video support session on a laptop",
    intro: [
      "If your issue is software, email, Wi-Fi settings or everyday computer troubleshooting, remote support is often the fastest path to a fix.",
      "We guide you step by step over the phone, or connect securely when screen sharing helps — always with your permission.",
    ],
    servicesTitle: "What can remote and phone support help with?",
    problemsTitle: "Popular remote support requests",
    problems: [
      {
        title: "Software troubleshooting",
        copy: "Windows and everyday app issues diagnosed and fixed without an on-site visit.",
      },
      {
        title: "Email and browser problems",
        copy: "Send/receive errors, login loops and browser headaches resolved remotely.",
      },
      {
        title: "Slow computer tune-ups",
        copy: "Startup cleanup and performance improvements over a secure remote session.",
      },
      {
        title: "Wi-Fi and printer software setup",
        copy: "Configuration help when the hardware is already in place.",
      },
      {
        title: "Updates and account setup",
        copy: "Guided help installing updates, apps and important accounts.",
      },
      {
        title: "Quick advice when you’re stuck",
        copy: "A calm technician on the phone when you just need the next step explained.",
      },
    ],
    coverageTitle: "We’ve got you covered with remote IT support",
    coverage: [
      "Orca IT remote support is designed for busy Australian homes that need help now — without waiting for a technician to travel.",
      "Remote is ideal for software problems. If we discover the issue needs hands-on hardware work, we’ll tell you clearly and discuss on-site options.",
      "Security matters: we only connect with permission, explain what we’re doing, and you can end the session at any time.",
    ],
    whyTitle: "Why choose Orca IT remote and phone support?",
    why: [
      "Faster help for many common problems",
      "Secure remote assistance with your permission",
      "Plain-English phone guidance",
      "Honest advice if on-site support is better",
      "Ideal for software, email and setup issues",
    ],
    customerLoveTitle: "Why customers like remote support",
    customerLove: [
      "It’s convenient and quick",
      "No waiting around for a visit when remote is enough",
      "We explain every step",
      "We fix the issue and confirm you’re comfortable",
      "We’re easy to reach by phone",
    ],
    brandsTitle: "Devices we commonly support remotely",
    brandsCopy: "Remote help works well across popular home computers and software platforms.",
    brands: ["Windows PCs", "Macs", "Laptops", "Home routers", "Printers", "Email apps"],
    faqs: [
      {
        question: "Is remote support safe?",
        answer:
          "Yes when done properly. We only connect with your permission, explain the steps, and you remain in control of the session.",
      },
      {
        question: "What can’t be done remotely?",
        answer:
          "Physical hardware faults, complex cabling and some replacements need on-site help. We’ll say so quickly if that’s the case.",
      },
      {
        question: "How do I get remote support?",
        answer:
          "Call 0450 577 407 or email info@orcait.com.au with a short description of the problem and your preferred contact time.",
      },
    ],
    relatedSlugs: ["desktop-pc-repairs", "email-troubleshooting", "virus-removal", "internet-networking"],
  },
  {
    slug: "broadband",
    title: "Broadband Setup & Troubleshooting",
    shortTitle: "Broadband",
    metaTitle: "Broadband Setup Australia | NBN & Home Internet Help",
    metaDescription:
      "Broadband and NBN connection help for Australian homes. Orca IT assists with modem setup, dropouts, slow speeds and home internet troubleshooting.",
    keywords: [
      "broadband setup",
      "NBN troubleshooting",
      "internet connection help Australia",
      "broadband not working",
      "slow NBN speed",
      "modem setup",
      "home broadband technician",
    ],
    eyebrow: "Home IT Support",
    hero: "Broadband problems can knock out your whole household. Orca IT helps Australian homes with modem setup, dropouts, speed issues and connection troubleshooting.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80",
    imageAlt: "High-speed network and broadband technology lights",
    secondaryImage: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?auto=format&fit=crop&w=900&q=80",
    secondaryImageAlt: "Laptop connected to home broadband internet",
    intro: [
      "Sometimes the Wi-Fi looks guilty when the real issue is the broadband service, modem settings or how the connection enters your home. We help separate those problems clearly.",
      "From new modem setup to unstable connections, we improve the foundation your home internet depends on — then optimise the network that sits on top.",
    ],
    servicesTitle: "What broadband support does Orca IT provide?",
    problemsTitle: "Broadband issues we help resolve",
    problems: [
      {
        title: "New broadband and modem setup",
        copy: "Equipment configured correctly so your service comes online cleanly.",
      },
      {
        title: "Dropouts and unstable connections",
        copy: "Intermittent faults traced between modem, router and in-home setup.",
      },
      {
        title: "Slower speeds than expected",
        copy: "Practical testing to find whether Wi-Fi, hardware or the line is limiting performance.",
      },
      {
        title: "NBN connection confusion",
        copy: "Clear guidance on in-home setup and what to escalate to your provider.",
      },
      {
        title: "Modem lights and cabling checks",
        copy: "Basic physical and status checks before unnecessary equipment replacement.",
      },
      {
        title: "Home network optimisation after install",
        copy: "Once broadband is stable, we improve Wi-Fi for everyday household use.",
      },
    ],
    coverageTitle: "We’ve got you covered for broadband support",
    coverage: [
      "Orca IT helps Australian homes get more reliable internet by diagnosing the full path: modem, router, Wi-Fi and devices.",
      "If the fault sits with your internet provider, we help you identify that quickly so your call to the ISP is specific and useful.",
      "Good broadband setup is the base for Smart TVs, remote work, gaming and every connected device in the home — we treat it that way.",
    ],
    whyTitle: "Why choose Orca IT for broadband help?",
    why: [
      "We diagnose modem, router and Wi-Fi together",
      "Clear advice on ISP vs in-home faults",
      "Remote help for many configuration issues",
      "On-site support when setup needs hands-on work",
      "Practical recommendations instead of random restarts",
    ],
    customerLoveTitle: "Why customers use our broadband support",
    customerLove: [
      "We find the real bottleneck",
      "We explain provider vs home issues clearly",
      "We stabilise everyday internet use",
      "We improve the network after the connection works",
      "We’re easy to contact when dropouts return",
    ],
    brandsTitle: "Connections and hardware we commonly support",
    brandsCopy: "We help with common Australian home broadband setups and consumer networking hardware.",
    brands: ["NBN setups", "ISP modems", "TP-Link", "Netgear", "Asus", "Mesh Wi-Fi systems"],
    faqs: [
      {
        question: "Can you fix NBN connection problems?",
        answer:
          "We help with in-home setup and troubleshooting. If the fault is on the provider network, we help you identify that so escalation is faster.",
      },
      {
        question: "Why are my broadband speeds slow?",
        answer:
          "Wi-Fi congestion, outdated routers, peak-hour limits or line issues can all be involved. We test methodically before recommending changes.",
      },
      {
        question: "Do you set up new modems?",
        answer:
          "Yes. New modem and router setup, plus connecting household devices afterward, is a common request.",
      },
    ],
    relatedSlugs: ["internet-networking", "smart-tv-setup", "remote-phone-support", "printer-setup"],
  },
];

export function getHomeServiceArticle(slug: string) {
  return homeServiceArticles.find((article) => article.slug === slug);
}

export function getRelatedArticles(slug: string) {
  const article = getHomeServiceArticle(slug);
  if (!article) return [];
  return article.relatedSlugs
    .map((relatedSlug) => getHomeServiceArticle(relatedSlug))
    .filter((item): item is HomeServiceArticle => Boolean(item));
}
