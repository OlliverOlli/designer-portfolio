"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  X,
  Plus,
  ArrowLeft,
  Save,
  Lock,
  Shield,
  Eye,
  EyeOff,
  ImageIcon,
  CheckCircle,
  Trash2,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const defaultConfig = {
  designer: { name: "Batman" },
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
  olliver: { uploadPassword: "euseiasenha2" },
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [config, setConfig] = useState(defaultConfig)
  const [loginError, setLoginError] = useState("")
  const [artworks, setArtworks] = useState([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: [],
    category: "",
    image: null,
    imagePreview: null,
  })
  const [currentTag, setCurrentTag] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    loadConfig()
    if (isAuthenticated) {
      loadArtworks()
    }
  }, [isAuthenticated])

  const loadConfig = async () => {
    try {
      const response = await fetch("/api/config")
      if (response.ok) {
        const data = await response.json()
        setConfig(data)
      }
    } catch (err) {
      console.log("Using default config")
      setConfig(defaultConfig)
    }
  }

  const loadArtworks = async () => {
    try {
      const response = await fetch("/api/artworks")
      if (response.ok) {
        const data = await response.json()
        setArtworks(data)
      }
    } catch (err) {
      console.log("Error loading artworks")
      setArtworks([])
    }
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (config && password === config.olliver.uploadPassword) {
      setIsAuthenticated(true)
      setLoginError("")
    } else {
      setLoginError("Senha incorreta. Apenas o Batman tem acesso.")
    }
  }

  const handleAddTag = (tagToAdd = null) => {
    const tag = tagToAdd || currentTag.trim()
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
        category: prev.category || tag,
      }))

      // Add to predefined tags if it's a custom tag
      if (!tagToAdd && !config.predefinedTags.includes(tag)) {
        setConfig((prev) => ({
          ...prev,
          predefinedTags: [...prev.predefinedTags, tag],
        }))
      }

      if (!tagToAdd) setCurrentTag("")
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Aumentado limite para 100MB para artes de alta qualidade
      const maxSize = 100 * 1024 * 1024 // 100MB

      if (file.size > maxSize) {
        alert(`Arquivo muito grande! Máximo ${formatFileSize(maxSize)}.\nSeu arquivo: ${formatFileSize(file.size)}`)
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          image: file,
          imagePreview: e.target.result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsUploading(true)
    setUploadSuccess(false)

    try {
      const uploadData = new FormData()
      uploadData.append("title", formData.title)
      uploadData.append("description", formData.description)
      uploadData.append("tags", JSON.stringify(formData.tags))
      uploadData.append("category", formData.category)
      uploadData.append("image", formData.image)

      const response = await fetch("/api/artworks", {
        method: "POST",
        body: uploadData,
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setUploadSuccess(true)
        setFormData({
          title: "",
          description: "",
          tags: [],
          category: "",
          image: null,
          imagePreview: null,
        })

        const fileInput = document.getElementById("image") as HTMLInputElement
        if (fileInput) fileInput.value = ""

        // Reload artworks to show the new one
        loadArtworks()

        setTimeout(() => setUploadSuccess(false), 5000)
      } else {
        throw new Error(result.error || "Erro ao enviar arte")
      }
    } catch (error) {
      alert(`Erro ao enviar a arte: ${error.message}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteArtwork = async (artworkId) => {
    try {
      const response = await fetch(`/api/artworks?id=${artworkId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setArtworks(artworks.filter((art) => art.id !== artworkId))
        setDeleteConfirm(null)
      } else {
        alert("Erro ao deletar a arte")
      }
    } catch (error) {
      alert("Erro ao deletar a arte")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header */}
      <div className="bg-black/60 border-b border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm" className="text-gray-300 hover:bg-gray-800">
              <Link href={isAuthenticated ? "/gallery" : "/"}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {isAuthenticated ? "Voltar à Galeria" : "Voltar ao Início"}
              </Link>
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-200">
              {isAuthenticated ? "Batcave - Painel de Controle" : "Acesso Restrito"}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {!isAuthenticated ? (
          // Login Screen
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto"
          >
            <Card className="bg-gray-900/60 border-gray-700">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-600">
                  <Shield className="h-8 w-8 text-gray-300" />
                </div>
                <CardTitle className="text-gray-200 flex items-center justify-center gap-2">
                  <Lock className="h-5 w-5" />
                  Acesso do Batman
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="password" className="text-gray-300 mb-2 block">
                      Senha de Acesso
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Digite a senha do Batman..."
                        className="bg-gray-800/60 border-gray-600 text-gray-200 placeholder:text-gray-500 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {loginError && (
                    <div className="p-3 bg-red-900/20 border border-red-700/50 rounded-lg">
                      <p className="text-red-400 text-sm">{loginError}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 border border-gray-600"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Entrar na Batcave
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-gray-800/30 border border-gray-700 rounded-lg">
                  <p className="text-gray-400 text-sm text-center">
                    🦇 Apenas o Batman possui acesso a esta área. A senha está configurada no arquivo de configuração.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          // Admin Panel (authenticated)
          <div className="space-y-8">
            {/* Success Message */}
            {uploadSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-900/20 border border-green-700/50 rounded-lg flex items-center gap-3"
              >
                <CheckCircle className="h-5 w-5 text-green-400" />
                <p className="text-green-400">✅ Arte enviada com sucesso e salva permanentemente! 🦇</p>
              </motion.div>
            )}

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Upload Form */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="bg-gray-900/60 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-gray-200 flex items-center gap-2">
                      <Upload className="h-5 w-5" />
                      Enviar Nova Arte das Sombras
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Image Upload */}
                      <div>
                        <Label htmlFor="image" className="text-gray-300 mb-2 block">
                          Imagem da Arte * (até 100MB)
                        </Label>
                        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-500 transition-colors">
                          <input
                            id="image"
                            type="file"
                            accept="image/*,image/gif"
                            onChange={handleImageUpload}
                            className="hidden"
                            required
                          />
                          <label htmlFor="image" className="cursor-pointer">
                            {formData.imagePreview ? (
                              <div className="space-y-4">
                                <img
                                  src={formData.imagePreview || "/placeholder.svg"}
                                  alt="Preview"
                                  className="max-w-full max-h-48 mx-auto rounded-lg object-cover"
                                />
                                <div className="text-gray-300">
                                  <p className="font-semibold">{formData.image?.name}</p>
                                  <p className="text-sm text-gray-400">
                                    {formData.image && formatFileSize(formData.image.size)}
                                  </p>
                                  <p className="text-sm text-gray-500">Clique para alterar</p>
                                </div>
                              </div>
                            ) : (
                              <div className="text-gray-300">
                                <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                                <p className="font-semibold">Clique para enviar uma imagem</p>
                                <p className="text-sm text-gray-500">PNG, JPG, GIF até 100MB</p>
                                <p className="text-xs text-gray-600 mt-2">⚡ Suporte para artes de alta qualidade</p>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>

                      {/* Title */}
                      <div>
                        <Label htmlFor="title" className="text-gray-300 mb-2 block">
                          Título da Arte *
                        </Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="Ex: Dark Discord Banner"
                          className="bg-gray-800/60 border-gray-600 text-gray-200 placeholder:text-gray-500"
                          required
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <Label htmlFor="description" className="text-gray-300 mb-2 block">
                          Descrição (Opcional)
                        </Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                          placeholder="Descreva sua arte das sombras..."
                          className="bg-gray-800/60 border-gray-600 text-gray-200 placeholder:text-gray-500"
                          rows={3}
                        />
                      </div>

                      {/* Predefined Tags */}
                      <div>
                        <Label className="text-gray-300 mb-2 block">
                          Tags Predefinidas ({config.predefinedTags?.length || 0} disponíveis)
                        </Label>
                        <div className="flex flex-wrap gap-2 mb-4 p-4 bg-gray-800/30 border border-gray-700 rounded-lg max-h-32 overflow-y-auto">
                          {config.predefinedTags?.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className={`cursor-pointer transition-colors ${
                                formData.tags.includes(tag)
                                  ? "bg-blue-600/20 text-blue-300 border-blue-600/50"
                                  : "border-gray-600 text-gray-400 hover:bg-gray-700/50"
                              }`}
                              onClick={() => handleAddTag(tag)}
                            >
                              {tag}
                              {formData.tags.includes(tag) && <X className="h-3 w-3 ml-1" />}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Custom Tags */}
                      <div>
                        <Label className="text-gray-300 mb-2 block">Tags Personalizadas</Label>
                        <div className="flex gap-2 mb-3">
                          <Input
                            value={currentTag}
                            onChange={(e) => setCurrentTag(e.target.value)}
                            placeholder="Digite uma tag personalizada..."
                            className="bg-gray-800/60 border-gray-600 text-gray-200 placeholder:text-gray-500"
                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                          />
                          <Button
                            type="button"
                            onClick={() => handleAddTag()}
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:bg-gray-800"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {formData.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {formData.tags.map((tag, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="bg-gray-700/60 text-gray-300 border-gray-600 flex items-center gap-1"
                              >
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTag(tag)}
                                  className="ml-1 hover:text-red-400"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isUploading || formData.tags.length === 0}
                        className="w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 border border-gray-600 disabled:opacity-50"
                      >
                        {isUploading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Enviando Arte...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Publicar Arte Permanentemente
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Artworks Management */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="bg-gray-900/60 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-gray-200 flex items-center gap-2">
                      <Trash2 className="h-5 w-5" />
                      Gerenciar Artes ({artworks.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {artworks.length > 0 ? (
                        artworks.map((artwork) => (
                          <div
                            key={artwork.id}
                            className="flex items-center gap-4 p-3 bg-gray-800/30 border border-gray-700 rounded-lg"
                          >
                            <Image
                              src={artwork.image || "/placeholder.svg"}
                              alt={artwork.title}
                              width={60}
                              height={60}
                              className="w-15 h-15 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-gray-200 font-semibold truncate">{artwork.title}</h4>
                              <p className="text-gray-400 text-sm">{artwork.date}</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {artwork.tags.slice(0, 2).map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                                    {tag}
                                  </Badge>
                                ))}
                                {artwork.tags.length > 2 && (
                                  <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                                    +{artwork.tags.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <Button
                              onClick={() => setDeleteConfirm(artwork.id)}
                              variant="outline"
                              size="sm"
                              className="border-red-600 text-red-400 hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-400">Nenhuma arte encontrada</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md w-full"
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-400" />
              <h3 className="text-lg font-semibold text-gray-200">Confirmar Exclusão</h3>
            </div>
            <p className="text-gray-400 mb-6">
              Tem certeza que deseja excluir esta arte? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setDeleteConfirm(null)}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => handleDeleteArtwork(deleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                Excluir
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
