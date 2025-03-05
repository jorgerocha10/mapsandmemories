import Image from 'next/image';
import { PrismaClient, Location, FrameStyle, Size, Layer } from '@prisma/client';
import type { Map } from '@prisma/client';

const prisma = new PrismaClient();

// Define a type that includes the images field
type MapWithDetails = Map & {
  location: Location | null;
  frameStyle: FrameStyle | null;
  size: Size | null;
  layers: Layer[];
  images: string[];
};

export default async function Home() {
  const categories = await prisma.category.findMany({
    include: {
      maps: {
        include: {
          location: true,
          frameStyle: true,
          size: true,
          layers: true,
        },
      },
    },
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">Maps & Memories</h1>
        
        {categories.map((category) => (
          <div key={category.id} className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">{category.name}</h2>
            <p className="mb-6 text-gray-600">{category.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {category.maps.map((map) => {
                // Cast the map to our custom type that includes images
                const mapWithImages = map as unknown as MapWithDetails;
                
                return (
                  <div key={map.id} className="border rounded-lg overflow-hidden shadow-lg">
                    <div className="relative h-64 w-full">
                      {mapWithImages.images && mapWithImages.images.length > 0 ? (
                        <Image
                          src={mapWithImages.images[0]}
                          alt={map.name}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-200">
                          <p>No image available</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{map.name}</h3>
                      <p className="text-gray-600 mb-4">{map.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold">${map.price.toString()}</span>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
