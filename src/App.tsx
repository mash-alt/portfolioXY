import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import './App.css'

// Import all images
const importImages = () => {
  const imageModules = import.meta.glob('./assets/images/*.{png,jpg,jpeg}', { eager: true })
  const webpModules = import.meta.glob('./assets/images/webp/*.webp', { eager: true })
  const thumbModules = import.meta.glob('./assets/images/thumbnails/*.webp', { eager: true })
  const images: { src: string; webpSrc: string; thumbSrc: string; name: string; category: string }[] = []
  
  Object.entries(imageModules).forEach(([path, module]) => {
    const filename = path.split('/').pop()?.split('.')[0] || ''
    const src = (module as any).default
    
    // Find corresponding WebP image
    const webpPath = path.replace('/images/', '/images/webp/').replace(/\.(jpg|jpeg|png)$/i, '.webp')
    const webpSrc = webpModules[webpPath] ? (webpModules[webpPath] as any).default : src
    
    // Find corresponding thumbnail
    const thumbPath = path.replace('/images/', '/images/thumbnails/').replace(/\.(jpg|jpeg|png)$/i, '.webp')
    const thumbSrc = thumbModules[thumbPath] ? (thumbModules[thumbPath] as any).default : webpSrc
    
    // Categorize images based on filename
    let category = 'portrait'
    if (filename.includes('cityscape') || filename.includes('cityshot') || filename.includes('citycape')) category = 'cityscape'
    else if (filename.includes('longexposure') || filename.includes('longexposre') || filename.includes('trail')) category = 'longexposure'
    else if (filename.includes('animal') || filename.includes('cat') || filename.includes('doggy')) category = 'animal'
    else if (filename.includes('lowlight') || filename.includes('sunset')) category = 'lowlight'
    else if (filename.includes('portrait') || filename.includes('potrait')) category = 'portrait'
    
    images.push({ src, webpSrc, thumbSrc, name: filename, category })
  })
  
  return images
}

const Header = () => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="header"
    >
      <div className="header-content">
        <h1 className="logo">PORTFOLIO</h1>
      </div>
    </motion.header>
  )
}

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 1 }}
      className="footer"
    >
      <div className="footer-content">
        <div className="footer-info">
          <h3 className="footer-name">Moses Zachary F. Sabido</h3>
          <p className="footer-alias">Known as Mash</p>
        </div>
        <div className="footer-links">
          <motion.a
            href="https://www.facebook.com/ayaya032/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Facebook
          </motion.a>
          <motion.a
            href="mailto:moseszachfsabido@gmail.com"
            className="footer-link"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Email
          </motion.a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Moses Zachary F. Sabido. All rights reserved.</p>
      </div>
    </motion.footer>
  )
}

const ImageCard = ({ image, index, onClick }: { 
  image: { src: string; webpSrc: string; thumbSrc: string; name: string; category: string }; 
  index: number; 
  onClick: () => void 
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageSrc, setImageSrc] = useState('')

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      setImageSrc(image.thumbSrc)
      setImageLoaded(true)
    }
    img.src = image.thumbSrc
  }, [image.thumbSrc])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      className="image-card"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {!imageLoaded ? (
        <div className="image-placeholder loading-shimmer" />
      ) : (
        <motion.img
          src={image.thumbSrc}
          srcSet={`${image.thumbSrc} 400w, ${image.webpSrc} 900w`}
          sizes="(max-width: 600px) 100vw, 25vw"
          alt={image.name}
          className="portfolio-image"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          loading="lazy"
        />
      )}
      <motion.div
        className="image-overlay"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
      </motion.div>
    </motion.div>
  )
}

const ImageViewer = ({ 
  image, 
  isOpen, 
  onClose 
}: { 
  image: { src: string; webpSrc: string; name: string; category: string } | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="image-viewer-overlay"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="image-viewer-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-button" onClick={onClose}>
              ×
            </button>
            <img src={image.src} alt={image.name} className="viewer-image" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function App() {
  const [images] = useState(() => importImages())
  const [selectedImage, setSelectedImage] = useState<{ src: string; webpSrc: string; name: string; category: string } | null>(null)
  const [isViewerOpen, setIsViewerOpen] = useState(false)

  const openImageViewer = (image: { src: string; webpSrc: string; name: string; category: string }) => {
    setSelectedImage(image)
    setIsViewerOpen(true)
  }

  const closeImageViewer = () => {
    setIsViewerOpen(false)
    setTimeout(() => setSelectedImage(null), 300)
  }

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="gallery-container"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="masonry-grid"
          >
            {images.map((image, index) => (
              <ImageCard
                key={`${image.name}-${index}`}
                image={image}
                index={index}
                onClick={() => openImageViewer(image)}
              />
            ))}
          </motion.div>
        </motion.div>
      </main>

      <Footer />

      <ImageViewer
        image={selectedImage}
        isOpen={isViewerOpen}
        onClose={closeImageViewer}
      />
    </div>
  )
}

export default App
