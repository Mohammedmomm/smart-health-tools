import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    const body = await request.json();
    const { type, input, result } = body;

    const history = await prisma.calculatorHistory.create({
      data: { userId: payload.userId, type, input, result },
    });

    return NextResponse.json({ history, message: 'History saved' }, { status: 201 });
  } catch (error) {
    console.error('History save error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    const history = await prisma.calculatorHistory.findMany({
      where: { userId: payload.userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({ history });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
