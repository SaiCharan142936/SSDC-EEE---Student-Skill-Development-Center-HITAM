import type { ProjectDetail } from "@/components/ProjectDetailModal";

import wheelchairImg from "@/assets/project-wheelchair.jpg";
import ebikeImg from "@/assets/project-ebike.jpg";
import tricycleImg from "@/assets/project-tricycle.jpg";
import helmetImg from "@/assets/project-helmet.jpg";
import hybridImg from "@/assets/project-hybrid.jpg";
import iotImg from "@/assets/project-iot.jpg";

import pdfWheelchairGroup from "@/assets/pdf-wheelchair-group.jpg";
import pdfEbikeGroup from "@/assets/pdf-ebike-group.jpg";
import pdfTricycleGroup from "@/assets/pdf-tricycle-group.jpg";
import pdfTricycleBanner from "@/assets/pdf-tricycle-banner.jpg";
import pdfSmartHelmet from "@/assets/pdf-smart-helmet.jpg";
import pdfHybridScooter from "@/assets/pdf-hybrid-scooter.jpg";
import pdfAutonomousEv from "@/assets/pdf-autonomous-ev.jpg";
import pdfIotAutomation from "@/assets/pdf-iot-automation.jpg";

export const categories = ["All", "AI", "EV", "IoT"];

export const projects: ProjectDetail[] = [
  {
    title: "Smart Mobility Wheelchair",
    description: "The Smart Mobility Wheelchair project focuses on developing an AI driven electric wheelchair with multi-mode control and enhanced safety features for users with mobility impairments. Built around the ESP32 microcontroller, it supports joystick, gesture, touch, and smartphone control via the RemoteXY platform.",
    solution: "The wheelchair uses dynamic braking and ultrasonic obstacle detection to ensure safe navigation. It incorporates 24V, 250W PMDC motors powered by a 22.2V, 20Ah lithium-ion battery managed through a Battery Management System. AI algorithms analyse data like speed, battery cycles, and distance to optimize performance and predict maintenance needs. The software uses PWM for smooth motor control and braking via relay logic. Real-time monitoring through serial output helps in debugging and tuning. With a top speed of approximately 7.2 km/h and torque output of 49.6 NM, it balances performance and safety. The frame supports up to 100 kg and offers good stability on various terrains.",
    features: [
      "Multi-mode control: joystick, gesture, touch, and smartphone",
      "Dynamic braking and ultrasonic obstacle detection",
      "AI-driven performance optimization and predictive maintenance",
      "Top speed of approximately 7.2 km/h with 49.6 NM torque output",
      "Frame supports up to 100 kg with stability on various terrains",
      "Real-time monitoring through serial output",
    ],
    technologies: ["ESP32", "RemoteXY", "PMDC Motors", "Li-ion Battery", "PWM", "Ultrasonic Sensors", "AI Algorithms"],
    applications: [
      "Mobility assistance for physically impaired individuals",
      "Hospital and care facility navigation",
      "Indoor and outdoor assisted movement",
      "Smart mobility research and development",
    ],
    img: wheelchairImg,
    galleryImages: [pdfWheelchairGroup],
    cat: "AI",
  },
  {
    title: "Multifunctional Electric Bicycle",
    description: "A multifunctional electric bicycle is a modern, eco-friendly vehicle that combines traditional pedaling with electric motor assistance to make riding easier and more efficient. Designed for versatility, it addresses the need for sustainable short and medium-distance travel.",
    solution: "The e-bike includes pedal-assist and throttle modes, allowing riders to travel longer distances or tackle hills with less effort. It is equipped with practical additions like cargo racks, smart displays showing speed and battery life, built-in lighting systems, and GPS tracking with mobile app connectivity. Whether used for commuting, recreation, delivery, or off-road adventures, multifunctional e-bikes offer a convenient, sustainable, and cost-effective alternative to cars.",
    features: [
      "Pedal-assist and throttle modes",
      "Smart display showing speed and battery life",
      "Built-in lighting systems for safety",
      "GPS tracking and mobile app connectivity",
      "Cargo racks for practical utility",
      "Foldable frame for easy storage",
    ],
    technologies: ["Electric Motor", "Battery Management System", "Smart Display", "GPS Module", "Mobile App"],
    applications: [
      "Daily commuting and urban transportation",
      "Recreational cycling",
      "Delivery services",
      "Eco-friendly alternative to cars for short distances",
    ],
    img: ebikeImg,
    galleryImages: [pdfEbikeGroup],
    cat: "EV",
  },
  {
    title: "Hybrid Two-Wheeler for Reliable Mobility",
    description: "With the rising cost of petrol and growing environmental concerns, electric scooters have emerged as a popular alternative. However, electric vehicles face challenges such as limited battery range, long charging times, and inadequate charging infrastructure, making it difficult for users to depend solely on electric scooters.",
    solution: "This project proposes the development of a Hybrid Scooter that can operate on both petrol and electric power. By integrating two power sources into a single vehicle, the hybrid scooter offers greater flexibility and reliability. Users can switch between fuel modes based on availability, convenience, or efficiency, ensuring uninterrupted travel and reduced environmental impact.",
    features: [
      "Dual power source: petrol and electric",
      "Seamless switching between fuel modes",
      "Extended range compared to pure EV",
      "Reduced environmental impact",
      "Greater flexibility for daily commuting",
    ],
    technologies: ["IC Engine", "Electric Motor", "Battery Pack", "Dual Power Controller", "Fuel Switching System"],
    applications: [
      "Daily commuting with flexibility",
      "Areas with limited EV charging infrastructure",
      "Reducing carbon emissions while maintaining convenience",
      "Reliable transportation for long distances",
    ],
    img: hybridImg,
    galleryImages: [pdfHybridScooter],
    cat: "EV",
  },
  {
    title: "Electric Tricycle for Empowered Handicapped Travel",
    description: "This project mainly helps to improve the ease of travelling for handicapped people integrating with new technology of electric tricycles. A normal tricycle requires a lot of human effort to move from one place to another place.",
    solution: "This is solved by the electric tricycle which requires no effort from the person to travel. The tricycle is designed with a motorized engine and assistive control system specifically for people with special needs, providing independent and comfortable mobility.",
    features: [
      "Motorized engine for effortless travel",
      "Assistive control system for special needs users",
      "Comfortable seating and stability",
      "Easy-to-use controls",
      "Battery-powered for eco-friendly operation",
    ],
    technologies: ["Electric Motor", "Battery System", "Motor Controller", "Assistive Controls"],
    applications: [
      "Personal mobility for handicapped individuals",
      "Hospital and rehabilitation center use",
      "Campus and institutional mobility",
      "Elderly assistance transportation",
    ],
    img: tricycleImg,
    galleryImages: [pdfTricycleGroup, pdfTricycleBanner],
    cat: "EV",
  },
  {
    title: "IoT Load Automation Using Radar Sensor",
    description: "Generally we control Electrical appliances like light, fans using switches directly by switching ON or OFF. This research explores designing a controller by merging IoT Technology, advanced sensors, and Arduino-based automation.",
    solution: "This project is aimed at developing a smart automation of loads using NodeMCU, WiFi dashboard, Blynk application, and relay modules. This system allows users to control electrical appliances remotely using a smartphone or web interface due to its ability to enhance ease of use, energy efficiency, and user control.",
    features: [
      "Remote control of electrical appliances via smartphone",
      "WiFi dashboard for real-time monitoring",
      "Blynk application integration",
      "Relay module-based switching",
      "Energy efficiency optimization",
      "Radar sensor integration for automation",
    ],
    technologies: ["NodeMCU", "WiFi", "Blynk App", "Relay Modules", "Radar Sensor", "Arduino"],
    applications: [
      "Smart home automation",
      "Industrial load control",
      "Energy management systems",
      "Remote monitoring of appliances",
    ],
    img: iotImg,
    galleryImages: [pdfIotAutomation],
    cat: "IoT",
  },
  {
    title: "Smart Helmet and Safety Jacket System",
    description: "Safety of electric line workers is a major concern in power distribution systems. Accidents such as falls from height, sudden imbalance, or shock-induced movements can lead to severe physical injuries, even when helmets are worn.",
    solution: "This project introduces a Smart Safety Jacket which works in coordination with the Smart Helmet. The jacket is designed using a normal safety cloth jacket, embedded with electronics and mechanical protection systems such as a servo-controlled safety belt and shock-absorbing pads. This system focuses on physical injury prevention, making it reliable, fast-acting, and cost-effective.",
    features: [
      "Servo-controlled safety belt mechanism",
      "Shock-absorbing pads for injury prevention",
      "Coordination between helmet and jacket sensors",
      "Real-time accident detection",
      "Cost-effective safety solution",
      "Fast-acting protective mechanisms",
    ],
    technologies: ["Arduino", "Servo Motors", "Sensors", "LCD Display", "Safety Electronics"],
    applications: [
      "Electrical line worker safety",
      "Industrial workplace protection",
      "Construction site safety",
      "Power distribution field workers",
    ],
    img: helmetImg,
    galleryImages: [pdfSmartHelmet],
    cat: "AI",
  },
  {
    title: "Designing of Autonomous EV Vehicle",
    description: "While electric vehicles offer environmental benefits, human-driven systems are still prone to errors, limiting safety and efficiency. There is a need for intelligent autonomous systems that can assist or control vehicle operation under specific conditions.",
    solution: "This project aims to address this challenge by implementing a Level-2 autonomous system on the developed EV platform, enabling sensor-based perception, real-time decision-making, and controlled vehicle operation to enhance safety, reliability, and smart mobility in controlled environments.",
    features: [
      "Level-2 autonomous driving capability",
      "Sensor-based perception system",
      "Real-time decision-making algorithms",
      "Controlled vehicle operation",
      "Enhanced safety and reliability",
    ],
    technologies: ["Sensors", "Autonomous Control System", "EV Platform", "Decision Algorithms", "Embedded Systems"],
    applications: [
      "Smart campus mobility",
      "Autonomous delivery systems",
      "Research in self-driving technology",
      "Controlled environment transportation",
    ],
    img: pdfAutonomousEv,
    galleryImages: [],
    cat: "AI",
  },
];
