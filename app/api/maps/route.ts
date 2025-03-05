import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const maps = await prisma.map.findMany({
      include: {
        location: true,
        frameStyle: true,
        size: true,
        layers: true,
        category: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(maps);
  } catch (error) {
    console.error('Error fetching maps:', error);
    return NextResponse.json(
      { error: 'Failed to fetch maps' },
      { status: 500 }
    );
  }
} 