import Image from 'next/image';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

// Define types for our data
type MapWithDetails = {
  id: string;
  name: string;
  description: string | null;
  price: number | string; // Changed from Prisma.Decimal to be more compatible
  isTemplate: boolean;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  location: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    zoomLevel: number;
    createdAt: Date;
    updatedAt: Date;
    mapId: string;
  } | null;
  frameStyle: {
    id: string;
    style: string;
    material: string;
    color: string | null;
    createdAt: Date;
    updatedAt: Date;
    mapId: string;
  } | null;
  size: {
    id: string;
    width: number;
    height: number;
    createdAt: Date;
    updatedAt: Date;
    mapId: string;
  } | null;
  layers: Array<{
    id: string;
    depth: number;
    material: string;
    color: string | null;
    createdAt: Date;
    updatedAt: Date;
    mapId: string;
  }>;
};

// Define basic map type for the maps returned from Prisma
type BasicMapType = {
  id: string;
  name: string;
  description: string | null;
  price: unknown; // Use unknown for Prisma.Decimal
  isTemplate: boolean;
  createdAt: Date;
  updatedAt: Date;
  location: Record<string, unknown> | null;
  frameStyle: Record<string, unknown> | null;
  size: Record<string, unknown> | null;
  layers: Record<string, unknown>[];
};

// Define category type with specific map type
type CategoryType = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  maps: BasicMapType[];
};

export default async function Home() {
  // Use a more generic type for the initial fetch
  const categoriesData = await prisma.category.findMany({
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
  
  // Safely cast to our type
  const categories = categoriesData as unknown as CategoryType[];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">Maps & Memories</h1>
        
        {categories.map((category) => (
          <div key={category.id} className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">{category.name}</h2>
            <p className="mb-6 text-gray-600">{category.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {category.maps.map((map: BasicMapType) => {
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
                        <span className="text-lg font-bold">${String(map.price)}</span>
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
