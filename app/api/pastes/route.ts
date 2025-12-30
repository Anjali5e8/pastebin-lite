import { prisma } from '@/lib/db';
import { nanoid } from 'nanoid';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const CreateSchema = z.object({
  content: z.string().min(1),
  ttl_seconds: z.number().int().min(1).optional(),
  max_views: z.number().int().min(1).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = CreateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { content, ttl_seconds, max_views } = result.data;
    const id = nanoid(10);
    const expires_at = ttl_seconds ? new Date(Date.now() + ttl_seconds * 1000) : null;

    const paste = await prisma.paste.create({
      data: { id, content, max_views: max_views || null, expires_at }
    });

    const host = req.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';

    return NextResponse.json({
      id: paste.id,
      url: `${protocol}://${host}/p/${paste.id}`
    }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}