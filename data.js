// All resume content lives here. Edit this file to update the site; no build step needed.
window.RESUME = {
  name: "Divyam Rawat",
  title: "Module Lead — Software",
  company: "Horner Automation & Solutions Group",
  location: "Bengaluru, India",
  rotating: [
    "industrial IoT platforms",
    "PLC-to-cloud connectivity",
    "C++ desktop applications",
    "Spring Boot services",
  ],
  summary:
    "Software engineer with 6+ years of experience, now leading device-communication work at Horner Automation. " +
    "I work across Cscape, a Windows application used to program industrial controllers (PLCs), and OCS360, " +
    "Horner's industrial IoT cloud platform. I design features end-to-end across the desktop app, the cloud server " +
    "and the device firmware specification, and develop the desktop and cloud sides myself.",
  links: {
    email: "divyamrawat325@gmail.com",
    linkedin: "https://www.linkedin.com/in/divyam-rawat-7a232a114",
    github: "https://github.com/drawat123",
  },
  stats: [
    { value: "6+", label: "years building software" },
    { value: "3", label: "layers designed per feature: desktop, cloud, firmware spec" },
    { value: "2", label: "products owned: Cscape & OCS360" },
  ],

  // Featured work. `flow` drives the interactive diagram.
  featured: [
    {
      id: "remote-view",
      name: "Remote View",
      tagline: "Open a controller's WebMI (its web-based HMI) from anywhere with an internet connection. OCS360 takes over the job of the web server that used to run on the controller.",
      role: "Designed end-to-end · developed the Cscape and cloud sides · wrote the firmware spec",
      tags: ["C++", "MFC", "Java", "Spring Boot", "Angular", "MQTT", "IoT", "System Design"],
      // Both modes share the same grid so the toggle reads as a before/after.
      modes: [
        {
          label: "Before: local network only",
          note: "The controller hosts the web server itself, so WebMI is reachable only from the controller's own network.",
          nodes: [
            { id: "cscape", label: "Cscape", sub: "desktop", x: 90, y: 55 },
            { id: "browser", label: "Browser", sub: "same network", x: 90, y: 205 },
            { id: "plc", label: "PLC", sub: "hosts web server", x: 690, y: 130 },
          ],
          flow: [
            { path: ["cscape", "plc"], text: "Cscape generates the WebMI package for the project and downloads it to the controller." },
            { path: ["browser", "plc"], text: "The browser opens the controller's local address and loads the WebMI app, which runs in the browser." },
            { path: ["browser", "plc"], text: "The app sends requests to the web server on the controller, which passes them to the controller's firmware." },
            { path: ["plc", "browser"], text: "The firmware replies and the web server answers the browser." },
          ],
        },
        {
          label: "Remote View: from anywhere",
          default: true,
          note: "OCS360 replaces the controller's local web server, so WebMI works from anywhere with an internet connection. The same WebMI pages work both locally and remotely.",
          nodes: [
            { id: "cscape", label: "Cscape", sub: "desktop", x: 90, y: 55 },
            { id: "browser", label: "Browser", sub: "anywhere", x: 90, y: 205 },
            { id: "cloud", label: "OCS360", sub: "cloud server", x: 390, y: 130 },
            { id: "plc", label: "PLC", sub: "controller", x: 690, y: 130 },
          ],
          flow: [
            { path: ["cscape", "cloud"], text: "Cscape publishes the same WebMI pages to OCS360 instead of to the controller." },
            { path: ["browser", "cloud"], text: "The browser opens the Remote View address from anywhere, and OCS360 serves the WebMI pages." },
            { path: ["browser", "cloud", "plc"], text: "Requests from the browser go through OCS360 to the controller." },
            { path: ["plc", "cloud", "browser"], text: "The controller's reply comes back the same way, with no local web server involved." },
          ],
        },
      ],
    },
    {
      id: "remote-connect",
      name: "Remote Connect",
      tagline: "Program and debug PLCs from anywhere. Cscape connects to the controller through the cloud, with no static IP, VPN or firewall changes.",
      role: "Designed end-to-end · developed the Cscape and cloud sides · wrote the firmware spec",
      tags: ["C++", "MFC", "Java", "Spring Boot", "MQTT", "IoT", "Multithreading", "System Design"],
      modes: [
        {
          label: "Before: direct link only",
          note: "Cscape reached the controller only over a direct serial, USB or LAN connection, so the engineer had to be on site or on the same network.",
          nodes: [
            { id: "cscape", label: "Cscape", sub: "desktop", x: 90, y: 130 },
            { id: "plc", label: "PLC", sub: "direct link", x: 690, y: 130 },
          ],
          flow: [
            { path: ["cscape", "plc"], text: "Cscape communicates with the controller over the direct link." },
            { path: ["plc", "cscape"], text: "The controller replies on the same link." },
          ],
        },
        {
          label: "Remote Connect: from anywhere",
          default: true,
          note: "Cscape works the way engineers already know, but through the cloud, so the controller can be anywhere with an internet connection.",
          nodes: [
            { id: "cscape", label: "Cscape", sub: "desktop", x: 90, y: 130 },
            { id: "cloud", label: "OCS360", sub: "cloud", x: 390, y: 130 },
            { id: "plc", label: "PLC", sub: "controller", x: 690, y: 130 },
          ],
          flow: [
            { path: ["cscape", "cloud"], text: "Cscape gets a new Remote Connect option alongside serial, USB and LAN, and sends its traffic through OCS360." },
            { path: ["cloud", "plc"], text: "OCS360 passes it on to the controller." },
            { path: ["plc", "cloud", "cscape"], text: "Replies come back the same way, so programming, monitoring and debugging work from anywhere." },
            { path: ["cloud", "cscape"], text: "OCS360 alerts Cscape if the controller stops responding." },
          ],
        },
      ],
    },
  ],

  projects: [
    {
      name: "Cloud platform migration",
      text: "Migrated OCS360's custom features — remote access, usage & billing, user login — onto a new version of the underlying IoT platform.",
      tags: ["Java", "Spring Boot", "Angular", "PostgreSQL"],
    },
    {
      name: "Expiring share links & security hardening",
      text: "Server-enforced expiry for public dashboard and Remote View links, plus access-control and error-handling hardening across the cloud APIs.",
      tags: ["Java", "Spring Boot", "Angular", "Security"],
    },
    {
      name: "Cscape cloud configuration",
      text: "Restructured Cscape's OCS360 configuration — account, control & status dialogs, navigator tree — with backward-compatible download-format changes.",
      tags: ["C++", "MFC"],
    },
    {
      name: "Faster graphics downloads",
      text: "Full, smart and live Canvas graphics downloads bundled into a single zip to cut download time to the controller.",
      tags: ["C++", "MFC"],
    },
    {
      name: "Sequencher — DNA sequence editor",
      text: "Designed and built the DNA sequence editor for Gene Codes' Sequencher, with fast algorithms for editing and loading very large files.",
      tags: ["C++", "Qt", "Algorithms"],
    },
    {
      name: "Remote Amplify — video collaboration",
      text: "Real-time text, audio and video chat and server video streaming for SPG Studios' collaboration app, using socket.io, GStreamer and JACK.",
      tags: ["C++", "Qt", "QML", "Multithreading"],
    },
  ],

  experience: [
    {
      company: "Horner Automation & Solutions Group",
      place: "Bengaluru, India",
      roles: [
        {
          title: "Module Lead",
          dates: "Jul 2026 — Present",
          points: [
            "Lead PLC/device-communication across Cscape (desktop) and OCS360 (cloud) and set technical direction for the area.",
            "Design new device-to-cloud features end-to-end and write the specifications the firmware team implements.",
            "Lead and mentor a developer: onboarding to the Cscape codebase, planning and assigning work, reviewing code, keeping deliveries on schedule.",
          ],
          tags: ["System Design", "Leadership", "Code Review", "IoT"],
        },
        {
          title: "Senior Software Engineer",
          dates: "Jul 2024 — Jun 2026",
          points: [
            "Remote View: designed end-to-end and built the Cscape and cloud sides, so existing WebMI pages work from anywhere.",
            "Remote Connect: designed end-to-end and built the Cscape and cloud sides, so engineers can program and debug controllers from anywhere.",
            "Migrated OCS360's custom features onto a new platform version; added expiring share links and security hardening.",
            "Restructured Cscape's OCS360 configuration, integrated the billing app into Cscape, and sped up graphics downloads.",
          ],
          tags: ["C++", "MFC", "Java", "Spring Boot", "Angular", "MQTT", "IoT", "PostgreSQL"],
        },
        {
          title: "Software Engineer",
          dates: "Jul 2021 — Jun 2024",
          points: [
            "Developed features and enhancements for Cscape, Horner's Windows PLC programming software, across many areas including the graphics editor.",
            "Fixed critical bugs and improved stability and performance.",
          ],
          tags: ["C++", "MFC", "Multithreading"],
        },
      ],
    },
    {
      company: "Evon Technologies",
      place: "Dehradun, India",
      roles: [
        {
          title: "Software Developer",
          dates: "Jan 2020 — Jun 2021",
          points: [
            "Sequencher (Gene Codes): designed and implemented the DNA sequence editor, including grouping and protein-base display, with algorithms that make editing and loading large files fast.",
            "Remote Amplify (SPG Studios): made the frontend dynamic; integrated socket.io for chat and sessions, GStreamer for audio/video chat and streaming, and JACK for system audio routing; built the macOS installer.",
          ],
          tags: ["C++", "Qt", "QML", "Algorithms", "Multithreading"],
        },
      ],
    },
    {
      company: "Infosys",
      place: "Mysuru, India",
      roles: [
        {
          title: "Intern",
          dates: "Jan 2019 — May 2019",
          points: ["Built the backend of an animal-adoption site with a team, using Java, Spring and Hibernate."],
          tags: ["Java", "Spring Boot"],
        },
      ],
    },
  ],

  skills: {
    Languages: ["C++", "Java", "TypeScript", "Python"],
    "Frameworks & libraries": ["MFC", "Qt", "QML", "Spring Boot", "Angular"],
    "Systems & protocols": ["MQTT", "IoT", "Multithreading", "PostgreSQL", "Security"],
    Practice: ["System Design", "Algorithms", "Code Review", "Leadership"],
  },

  education: [
    { name: "B.Tech, Computer Science", org: "Graphic Era Deemed to be University", dates: "2015 — 2019" },
    { name: "C++ Nanodegree", org: "Udacity", dates: "2021" },
  ],
  certifications: [
    "Beginning C++ Programming — From Beginner to Beyond",
    "Linux Mastery: Master the Linux Command Line",
    "Algorithms and Data Structures in Python",
    "QML for Beginners",
  ],
};
