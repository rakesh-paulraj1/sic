import  { useEffect, useState } from 'react';

const ImagesCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    "https://pmshrischools.education.gov.in/static/media/Exemplar_School4.bc0b002dd17b15f54219.jpg",
    "https://pmshrischools.education.gov.in/static/media/Exemplar_School1.b202c193512a5c3d9ba4.jpg",
    "https://pmshrischools.education.gov.in/static/media/Exemplar_School2.3377644a3827b417cda1.jpg",
   " https://pmshrischools.education.gov.in/static/media/Exemplar_School5.54ef42ade0cfc712e8fb.jpg"
  ];

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  useEffect(() => {
    
    const interval = setInterval(nextImage, 3000);
    return () => clearInterval(interval); 
  }, []);

  return (
    <div id="animation-carousel" className="relative w-full" data-carousel="static">
      
      <div className="relative h-40 sm:h-25  overflow-hidden rounded-lg md:h-66 xl:h-[23rem] 2xl:h-[28rem]">
  {images.map((src, index) => (
    <div
      key={index}
      className={`absolute block w-full h-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 transition-opacity duration-200 ease-linear ${
        currentIndex === index ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <img src={src} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
    </div>
  ))}
</div>


    
      <button
        type="button"
        className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={prevImage}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <svg
            className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 1 1 5l4 4"
            />
          </svg>
          <span className="sr-only">Previous</span>
        </span>
      </button>
      <button
        type="button"
        className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={nextImage}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <svg
            className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
          <span className="sr-only">Next</span>
        </span>
      </button>
    </div>
  );
};

export default ImagesCarousel;
