import { NextResponse } from "next/server"

const config = {
  designer: {
    name: "Batman",
    age: 16,
    bio: "Me chamo Erick, tenho 16 anos e sou designer há mais de um ano. Minha jornada no design começou de forma curiosa: na época, eu não queria pagar por artes para o meu próprio servidor no Discord, então decidi aprender por conta própria. Desde então, o que começou como uma necessidade virou uma paixão. Hoje, sou especializado na criação de artes únicas e no desenvolvimento de identidades visuais para servidores do Discord e projetos relacionados. Meu foco é entregar trabalhos criativos, personalizados e que realmente se destaquem, sempre buscando captar a essência de cada projeto com originalidade e profissionalismo.",
    skills: [
      "Artes Estáticas",
      "Capas para Sites",
      "Artes para Discord",
      "Motion",
      "Thumbnails e Banners para YouTube",
    ],
    location: "Brasil",
    experience: "1.6k",
    startDate: "2024-04-12",
  },
  predefinedTags: [
    "Discord",
    "Banner",
    "Logo",
    "Thumbnail",
    "Motion",
    "Estático",
    "Gaming",
    "Anime",
    "Dark",
    "Colorido",
    "Minimalista",
    "Futurista",
    "Retro",
    "Neon",
    "Gradient",
    "Typography",
    "Icon",
    "Avatar",
    "Cover",
    "Header",
  ],
  discordServers: [
    {
      id: 1,
      name: "Batman Studio",
      description: "Aqui você encontra o meu studio, é onde eu vendo as minhas artes e converso com a galera do servidor.",
      members: "120+",
      category: "Design",
      invite: "https://discord.gg/r7Exvc3eVU",
      color: "#1a1a1a",
      banner: "/assets/bannerstudio.jpg",
      icon: "/assets/batman-studio.jpg",
    },
    {
      id: 2,
      name: "Zona Segura",
      description: "Aqui vendo robux, contas de roblox e algumas outras coisinhas...",
      members: "250+",
      category: "Vendas",
      invite: "https://discord.gg/S9s6PXtu3M",
      color: "#2d2d2d",
      banner: "/assets/bannerzona.jpg",
      icon: "/assets/zona-segura.jpg",
    },
    {
      id: 3,
      name: "Batman Studio 2",
      description: "Aqui é basicamente a mesma coisa que a studio 1, porém tem mais membros e dou prioridades nas encomendas de designs.",
      members: "330+",
      category: "Design",
      invite: "https://discord.gg/yfFb89mwFw",
      color: "#404040",
      banner: "/assets/bannerstudio2.jpg",
      icon: "/assets/batman-studio-2.jpg",
    },
  ],
  olliver: {
    link: "https://discord.com/users/1045126614071115828",
    uploadPassword: "euseiasenha2",
  },
  batman: {
    link: "https://discord.com/users/1235678334831034519",
  },
}

export async function GET() {
  return NextResponse.json(config)
}
