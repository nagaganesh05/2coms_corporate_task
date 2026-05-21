const images = [
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
  "https://images.unsplash.com/photo-1515169067868-5387ec356754",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
];

function Gallery() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Office Event Gallery</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-[28px] shadow-lg group"
          >
            <img
              src={image}
              alt="gallery"
              className="h-80 w-full object-cover group-hover:scale-110 transition duration-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gallery;
