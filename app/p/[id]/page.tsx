import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';

export default async function ViewPaste({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params; // Await here too!

  const paste = await prisma.paste.findUnique({ where: { id } });

  if (!paste) notFound();
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