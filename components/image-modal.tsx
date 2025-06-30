"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  artwork: {
    id: number
    title: string
    description?: string
    tags: string[]
    category: string
    image: string
    date: string
  } | null
}

export function ImageModal({ isOpen, onClose, artwork }: ImageModalProps) {
  if (!artwork) return null

  const handleDownload = async () => {
    try {
      // Criar canvas para adicionar marca d'água
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        alert("Erro: Navegador não suporta canvas")
        return
      }

      // Criar nova imagem
      const img = document.createElement("img")
      img.crossOrigin = "anonymous"

      // Promessa para carregar a imagem
      const loadImage = new Promise((resolve, reject) => {
        img.onload = () => resolve(img)
        img.onerror = () => reject(new Error("Falha ao carregar imagem"))
        img.src = artwork.image
      })

      try {
        await loadImage

        // Configurar canvas
        canvas.width = img.width
        canvas.height = img.height

        // Desenhar imagem original
        ctx.drawImage(img, 0, 0)

        // Configurar marca d'água principal
        const watermarkText = "BATMAN ARTS"
        const fontSize = Math.min(img.width, img.height) * 0.15

        // Salvar contexto
        ctx.save()

        // Configurar fonte e estilo
        ctx.font = `bold ${fontSize}px Arial`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"

        // Posição central
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2

        // Aplicar transformações
        ctx.translate(centerX, centerY)
        ctx.rotate(-Math.PI / 6) // -30 graus

        // Desenhar marca d'água principal múltiplas vezes
        const positions = [
          { x: 0, y: 0 },
          { x: -canvas.width * 0.25, y: -canvas.height * 0.15 },
          { x: canvas.width * 0.25, y: canvas.height * 0.15 },
          { x: -canvas.width * 0.15, y: canvas.height * 0.25 },
          { x: canvas.width * 0.15, y: -canvas.height * 0.25 },
        ]

        positions.forEach((pos) => {
          // Contorno preto
          ctx.strokeStyle = "rgba(0, 0, 0, 0.8)"
          ctx.lineWidth = fontSize * 0.05
          ctx.strokeText(watermarkText, pos.x, pos.y)

          // Preenchimento branco
          ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
          ctx.fillText(watermarkText, pos.x, pos.y)
        })

        // Restaurar contexto
        ctx.restore()

        // Adicionar texto de copyright nos cantos
        const copyrightText = "© BATMAN DESIGNER"
        const smallFontSize = fontSize * 0.25
        ctx.font = `bold ${smallFontSize}px Arial`
        ctx.textAlign = "center"

        const corners = [
          { x: canvas.width * 0.15, y: canvas.height * 0.1 },
          { x: canvas.width * 0.85, y: canvas.height * 0.1 },
          { x: canvas.width * 0.15, y: canvas.height * 0.9 },
          { x: canvas.width * 0.85, y: canvas.height * 0.9 },
        ]

        corners.forEach((corner) => {
          // Contorno
          ctx.strokeStyle = "rgba(0, 0, 0, 0.9)"
          ctx.lineWidth = smallFontSize * 0.05
          ctx.strokeText(copyrightText, corner.x, corner.y)

          // Preenchimento
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
          ctx.fillText(copyrightText, corner.x, corner.y)
        })

        // Converter canvas para blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Criar URL temporária
              const url = URL.createObjectURL(blob)

              // Criar link de download
              const link = document.createElement("a")
              link.href = url
              link.download = `${artwork.title.replace(/[^a-zA-Z0-9]/g, "_")}_BATMAN_WATERMARK.jpg`

              // Adicionar ao DOM, clicar e remover
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)

              // Limpar URL
              URL.revokeObjectURL(url)
            } else {
              alert("Erro ao gerar imagem com marca d'água")
            }
          },
          "image/jpeg",
          0.9,
        )
      } catch (imageError) {
        console.error("Erro ao carregar imagem:", imageError)
        alert("Erro ao carregar a imagem. Tente novamente.")
      }
    } catch (error) {
      console.error("Erro no download:", error)
      alert("Erro ao processar download. Tente novamente.")
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative max-w-7xl max-h-[90vh] w-full bg-gray-900 rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent z-10 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 mr-4">
                  <h2 className="text-2xl font-bold text-white mb-2">{artwork.title}</h2>
                  {artwork.description && <p className="text-gray-300 text-sm">{artwork.description}</p>}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-white/10 rounded-full w-10 h-10 p-0"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Image */}
            <div className="relative w-full h-full min-h-[60vh] flex items-center justify-center">
              <Image
                src={artwork.image || "/placeholder.svg"}
                alt={artwork.title}
                width={1200}
                height={800}
                className="max-w-full max-h-full object-contain"
                priority
              />
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent z-10 p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-purple-600/20 text-purple-300 border-purple-600/30">{artwork.category}</Badge>
                  {artwork.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-white/10 text-white border-white/20">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">{artwork.date}</span>
                  <Button
                    onClick={handleDownload}
                    size="sm"
                    className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                    title="Download com marca d'água de proteção"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>

              {/* Aviso sobre marca d'água */}
              <div className="mt-3 p-2 bg-orange-900/20 border border-orange-700/50 rounded-lg">
                <p className="text-orange-300 text-xs text-center">
                  🛡️ Downloads incluem marca d'água de proteção • Para uso comercial, entre em contato
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
