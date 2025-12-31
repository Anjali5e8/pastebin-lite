import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

// Update: params is a Promise here too
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  // Await the params
  const { id } = await params;

  const testNowHeader = req.headers.get('x-test-now-ms');
  const now = (process.env.TEST_MODE === '1' && testNowHeader) 
    ? new Date(parseInt(testNowHeader)) 
    : new Date();

  const paste = await prisma.paste.findUnique({ where: { id: id } });

  if (!paste) return NextResponse.json({ error: "Not Found" }, { status: 404 });

  // Expiry check
  if (paste.expires_at && paste.expires_at <= now) {
    await prisma.paste.delete({ where: { id: id } }).catch(() => {});
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  // View limit check
  if (paste.max_views !== null && paste.current_views >= paste.max_views) {
    await prisma.paste.delete({ where: { id: id } }).catch(() => {});
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  const updated = await prisma.paste.update({
    where: { id: id },
    data: { current_views: { increment: 1 } }
  });

  const remaining = updated.max_views ? Math.max(0, updated.max_views - updated.current_views) : null;

  return NextResponse.json({
    content: updated.content,
    remaining_views: remaining,
    expires_at: updated.expires_at?.toISOString() || null
  });
}
