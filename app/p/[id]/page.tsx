import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';

// Update: params is now a Promise
export default async function View({ params }: { params: Promise<{ id: string }> }) {
  // Await the params object
  const { id } = await params;

  const paste = await prisma.paste.findUnique({ 
    where: { id: id } 
  });

  if (!paste) notFound();
  
  // Expiry and View limit validation
  if (paste.expires_at && paste.expires_at <= new Date()) notFound();
  if (paste.max_views !== null && paste.current_views >= paste.max_views) notFound();

  return (
    <main className="p-10 max-w-4xl mx-auto">
      <div className="bg-white p-6 border rounded shadow-sm">
        <pre className="whitespace-pre-wrap font-mono text-gray-800">{paste.content}</pre>
      </div>
    </main>
  );
}