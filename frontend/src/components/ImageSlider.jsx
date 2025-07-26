import React, { useState, useEffect } from 'react';
import './ImageSlider.css';

const ImageSlider = ({ slides, autoPlayInterval = 5000 }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Função para avançar para o próximo slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  // Função para voltar ao slide anterior
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Função para ir para um slide específico
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-play do slider
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [currentSlide, autoPlayInterval]);

  // Preload das imagens
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = slides.map((slide) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = slide.image;
        });
      });

      try {
        await Promise.all(imagePromises);
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao carregar imagens:', error);
        setIsLoading(false);
      }
    };

    preloadImages();
  }, [slides]);

  // Pausar auto-play quando o mouse está sobre o slider
  const [isPaused, setIsPaused] = useState(false);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  return (
    <div 
      className="slider-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isLoading && (
        <div className="slider-loading">
          <div className="loading-spinner"></div>
          <p>Carregando imagens...</p>
        </div>
      )}

      <div className="slider">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`slide ${index === currentSlide ? 'active' : ''} ${isLoading ? 'loading' : ''}`}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${slide.image})`
            }}
          >
            <div className="slide-content">
              <h1 className="slide-title">{slide.title}</h1>
              <h2 className="slide-subtitle">{slide.subtitle}</h2>
              <p className="slide-description">{slide.description}</p>
              <div className="slide-buttons">
                <button className="btn-primary">Reservar Agora</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botões de navegação */}
      <button className="slider-btn prev" onClick={prevSlide}>
        &#10094;
      </button>
      <button className="slider-btn next" onClick={nextSlide}>
        &#10095;
      </button>

      {/* Indicadores */}
      <div className="slider-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Contador de slides */}
      <div className="slide-counter">
        <span>{currentSlide + 1}</span>
        <span className="separator">/</span>
        <span>{slides.length}</span>
      </div>
    </div>
  );
};

export default ImageSlider; 