"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, Upload, ArrowLeft, Palette } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ImageModal } from "@/components/image-modal"

export default function GalleryPage() {
  const [artworks, setArtworks] = useState([])
  const [filteredArtworks, setFilteredArtworks] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedArtwork, setSelectedArtwork] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const loadArtworks = async () => {
      try {
        const response = await fetch("/api/artworks")
        if (response.ok) {
          const data = await response.json()
          setArtworks(data)
          setFilteredArtworks(data)

          // Extrair categorias únicas
          const uniqueCategories = [...new Set(data.map((art) => art.category))]
          setCategories(uniqueCategories)
        } else {
          setArtworks([])
          setFilteredArtworks([])
          setCategories([])
        }
      } catch (err) {
        console.error("Erro ao carregar artworks:", err)
        setArtworks([])
        setFilteredArtworks([])
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    loadArtworks()
  }, [])

  useEffect(() => {
    let filtered = artworks

    // Filtrar por categoria
    if (selectedCategory !== "all") {
      filtered = filtered.filter((art) => art.category === selectedCategory)
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(
        (art) =>
          art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          art.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    setFilteredArtworks(filtered)
  }, [artworks, selectedCategory, searchTerm])

  const handleImageClick = (artwork) => {
    setSelectedArtwork(artwork)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedArtwork(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando galeria...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header */}
      <div className="bg-black/60 border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Link>
              </Button>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Galeria de Artes</h1>
            </div>
            <Button
              asChild
              className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 border border-gray-600"
            >
              <Link href="/admin">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {artworks.length > 0 ? (
          <>
            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar por título ou tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-900/60 border-gray-700 text-gray-200 placeholder:text-gray-400 pl-10"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="text-white h-4 w-4" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-gray-900/60 border border-gray-700 rounded-md px-3 py-2 text-white"
                  >
                    <option value="all">Todas as Categorias</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Category Tags */}
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedCategory === "all" ? "default" : "secondary"}
                  className={`cursor-pointer transition-colors ${
                    selectedCategory === "all"
                      ? "bg-gray-700 text-gray-200 border-gray-600"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                  onClick={() => setSelectedCategory("all")}
                >
                  Todas ({artworks.length})
                </Badge>
                {categories.map((category) => {
                  const count = artworks.filter((art) => art.category === category).length
                  return (
                    <Badge
                      key={category}
                      variant={selectedCategory === category ? "default" : "secondary"}
                      className={`cursor-pointer transition-colors ${
                        selectedCategory === category
                          ? "bg-gray-700 text-gray-200 border-gray-600"
                          : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)} ({count})
                    </Badge>
                  )
                })}
              </div>
            </motion.div>

            {/* Gallery Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredArtworks.map((artwork, index) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="group cursor-pointer"
                  onClick={() => handleImageClick(artwork)}
                >
                  <Card className="bg-white/10 border-white/20 overflow-hidden hover:bg-white/15 transition-all duration-300">
                    <div className="relative overflow-hidden">
                      <Image
                        src={artwork.image || "/placeholder.svg"}
                        alt={artwork.title}
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <div className="text-white">
                          <p className="text-sm opacity-80">{artwork.date}</p>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-white font-semibold mb-2 line-clamp-1">{artwork.title}</h3>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {artwork.tags.slice(0, 3).map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs bg-white/10 text-white">
                            {tag}
                          </Badge>
                        ))}
                        {artwork.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs bg-white/10 text-white">
                            +{artwork.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                      <Badge className="bg-purple-600/20 text-purple-300 border-purple-600/30">
                        {artwork.category}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {filteredArtworks.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <p className="text-white text-xl">Nenhuma arte encontrada com os filtros aplicados.</p>
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("all")
                  }}
                  variant="outline"
                  className="mt-4 border-white/20 text-white hover:bg-white/10"
                >
                  Limpar Filtros
                </Button>
              </motion.div>
            )}
          </>
        ) : (
          // Empty State
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20"
          >
            <div className="max-w-md mx-auto">
              <div className="w-32 h-32 bg-gray-800/60 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-700">
                <Palette className="h-16 w-16 text-gray-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-200 mb-4">Galeria Vazia</h2>
              <p className="text-gray-400 mb-8 text-lg">
                Ainda não há artes na galeria. O Batman está preparando seus trabalhos das sombras para serem
                adicionados em breve!
              </p>
              <div className="space-y-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 border border-gray-600"
                >
                  <Link href="/admin">
                    <Upload className="h-4 w-4 mr-2" />
                    Adicionar Primeira Arte
                  </Link>
                </Button>
                <div>
                  <Button
                    asChild
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                  >
                    <Link href="/">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Voltar ao Início
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Image Modal */}
      <ImageModal isOpen={isModalOpen} onClose={handleCloseModal} artwork={selectedArtwork} />
    </div>
  )
}
