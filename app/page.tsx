"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, Palette, Zap, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { TimeCounter } from "@/components/timer-counter"

// Componente do morcego animado
const BatIcon = ({ className = "", delay = 0 }) => (
  <motion.div
    className={`absolute ${className}`}
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 0.3, 0],
      scale: [0, 1, 0],
      rotate: [0, 360],
    }}
    transition={{
      duration: 8,
      delay,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    }}
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
      <path d="M12 2C10.5 2 9.5 3 9.5 4.5C9.5 5.5 10 6.5 11 7L9 9C8 8.5 7 8.5 6 9C4.5 10 4 12 5 13.5C6 15 8 15 9 14L11 12C11.5 12.5 12.5 12.5 13 12L15 14C16 15 18 15 19 13.5C20 12 19.5 10 18 9C17 8.5 16 8.5 15 9L13 7C14 6.5 14.5 5.5 14.5 4.5C14.5 3 13.5 2 12 2Z" />
    </svg>
  </motion.div>
)

// Configuração padrão (fallback)
const defaultConfig = {
  designer: {
    name: "Batman",
    age: 16,
    bio: "Me chamo Erick, tenho 16 anos e sou designer há mais de um ano. Minha jornada no design começou de forma curiosa: na época, eu não queria pagar por artes para o meu próprio servidor no Discord, então decidi aprender por conta própria. Desde então, o que começou como uma necessidade virou uma paixão. Hoje, sou especializado na criação de artes únicas e no desenvolvimento de identidades visuais para servidores do Discord e projetos relacionados.",
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
  discordServers: [
    {
      id: 1,
      name: "Batman Studio",
      description: "Aqui você encontra o studio no qual vendo minhas artes e converso com a galera",
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
      description: "Aqui vendemos robux, contas do roblox e outras coisinhas...",
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
      description: "Basicamente a mesma coisa que o studio 1, porém aqui temos mais membros, priorizamos as vendas e encomendas.",
      members: "330+",
      category: "Desenvolvimento",
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

export default function HomePage() {
  const [config, setConfig] = useState(defaultConfig)
  const [artworks, setArtworks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Try to load config
        try {
          const configResponse = await fetch("/api/config")
          if (configResponse.ok) {
            const configData = await configResponse.json()
            setConfig(configData)
          }
        } catch (configError) {
          console.log("Using default config")
        }

        // Try to load artworks
        try {
          const artworksResponse = await fetch("/api/artworks")
          if (artworksResponse.ok) {
            const artworksData = await artworksResponse.json()
            setArtworks(artworksData)
          }
        } catch (artworksError) {
          console.log("No artworks loaded")
          setArtworks([])
        }
      } catch (error) {
        console.log("Using fallback data")
        setConfig(defaultConfig)
        setArtworks([])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40" />

        {/* Animated Background Elements - Bats */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <BatIcon key={i} className="left-1/2 top-1/2" delay={Math.random() * 5} />
          ))}

          {/* Floating particles */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1 h-1 bg-gray-500/30 rounded-full"
              animate={{
                x: [0, Math.random() * 200 - 100, 0],
                y: [0, Math.random() * 200 - 100, 0],
                opacity: [0.1, 0.6, 0.1],
              }}
              transition={{
                duration: Math.random() * 15 + 10,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center text-white"
          >
            <motion.h1
              className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-gray-300 to-gray-600 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
            >
              {config.designer.name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-xl md:text-2xl mb-8 text-gray-400"
            >
              Designer • {config.designer.age} anos • {config.designer.location}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="flex flex-wrap justify-center gap-3 mb-8"
            >
              {config.designer.skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-sm px-4 py-2 bg-gray-800/60 text-gray-300 border-gray-700"
                >
                  {skill}
                </Badge>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 border border-gray-600"
              >
                <Link href="/gallery">
                  Ver Portfolio <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-gray-600 text-gray-300 hover:bg-gray-800/50"
              >
                <Link href="#about">Sobre Mim</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-black/60">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center text-white"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-200">Sobre Mim</h2>
            <p className="text-lg md:text-xl text-gray-400 mb-12 leading-relaxed">{config.designer.bio}</p>

            {/* Timer Counter */}
            <div className="mb-12">
              {config.designer.startDate && <TimeCounter startDate={config.designer.startDate} />}
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <motion.div whileHover={{ scale: 1.05 }} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-600">
                  <Palette className="h-8 w-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-200">Criatividade</h3>
                <p className="text-gray-500">Designs únicos & criativos para destacar ainda mais seus projetos</p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-600">
                  <Zap className="h-8 w-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-200">Experiência</h3>
                <p className="text-gray-500">Mais de {config.designer.experience} de artes feitas!</p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-600">
                  <Users className="h-8 w-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-200">Referencias</h3>
                <p className="text-gray-500">Milhares de referencias e feedbacks</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Preview Gallery */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-200">Trabalhos</h2>
            <p className="text-xl text-gray-400">Alguns dos meus designs mais recentes</p>
          </motion.div>

          {artworks.length > 0 ? (
            <>
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {artworks.slice(0, 3).map((artwork, index) => (
                  <motion.div
                    key={artwork.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="group cursor-pointer"
                  >
                    <Card className="bg-gray-900/60 border-gray-700 overflow-hidden hover:bg-gray-800/60 transition-all duration-300">
                      <div className="relative overflow-hidden">
                        <Image
                          src={artwork.image || "/placeholder.svg"}
                          alt={artwork.title}
                          width={400}
                          height={300}
                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-gray-200 font-semibold mb-2">{artwork.title}</h3>
                        <div className="flex flex-wrap gap-2">
                          {artwork.tags.map((tag, tagIndex) => (
                            <Badge
                              key={tagIndex}
                              variant="secondary"
                              className="text-xs bg-gray-800 text-gray-400 border-gray-700"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 border border-gray-600"
                >
                  <Link href="/gallery">
                    Ver Todos os Trabalhos <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center py-16"
            >
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-800/60 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-700">
                  <Palette className="h-12 w-12 text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-300 mb-4">Portfolio em Construção</h3>
                <p className="text-gray-500 mb-8">
                  As artes estão sendo adicionadas. Em breve você poderá ver todos os trabalhos incríveis do Batman!
                </p>
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 border border-gray-600"
                >
                  <Link href="/gallery">
                    Ir para Galeria <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Discord Servers Section */}
      <section className="py-20 bg-black/60">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-200">Meus Servidores do Discord</h2>
            <p className="text-xl text-gray-400">Comunidades onde comercializo minhas artes e outras coisinhas</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {config.discordServers.map((server, index) => (
              <motion.div
                key={server.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="bg-gray-900/60 border-gray-700 hover:bg-gray-800/60 transition-all duration-300 overflow-hidden">
                  <CardContent className="p-0">
                    {/* Server Banner */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={server.banner || "/placeholder.svg"}
                        alt={`${server.name} Banner`}
                        width={400}
                        height={200}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Server Icon Overlay */}
                      <div className="absolute bottom-4 left-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white/20 backdrop-blur-sm">
                          <Image
                            src={server.icon || "/placeholder.svg"}
                            alt={`${server.name} Icon`}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Member Count Badge */}
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-black/60 text-white border-white/20 backdrop-blur-sm">
                          {server.members} membros
                        </Badge>
                      </div>
                    </div>

                    {/* Server Info */}
                    <div className="p-6">
                      <h3 className="text-gray-200 text-xl font-bold mb-2">{server.name}</h3>
                      <p className="text-gray-400 mb-4">{server.description}</p>

                      <div className="flex justify-between items-center mb-4">
                        <Badge variant="secondary" className="bg-gray-800 text-gray-400 border-gray-700">
                          {server.category}
                        </Badge>
                      </div>

                      <Button
                        asChild
                        className="w-full border border-gray-600 hover:bg-gray-700 transition-all duration-300"
                        style={{ backgroundColor: server.color }}
                      >
                        <a href={server.invite} target="_blank" rel="noopener noreferrer">
                          Entrar no Servidor <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Side by Side Footer */}
      <footer className="bg-black/80 border-t border-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Left Side - Batman Arts Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-400">
                © 2025 Todas as artes e designs são de propriedade de{" "}
                <a
                  href={config.batman?.link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-200 hover:text-white transition-colors duration-300 font-semibold"
                >
                  Batman
                </a>
              </p>
            </div>

            {/* Right Side - Site Copyright */}
            <div className="text-center md:text-right">
              <p className="text-gray-500">
                Site desenvolvido por{" "}
                <a
                  href={config.olliver.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-gray-100 transition-colors duration-300 font-semibold"
                >
                  olliver
                </a>{" "}
                • 2025
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
