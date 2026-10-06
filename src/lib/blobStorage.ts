/**
 * Upload de imagens com suporte a Vercel Blob (via token de API)
 * ou conversão otimizada Base64 / Local URL para preview imediato.
 */
export async function uploadImage(file: File, token?: string): Promise<string> {
  // Se o token da Vercel Blob estiver presente, faz o upload real para a CDN da Vercel
  if (token && token.trim().length > 0) {
    try {
      const response = await fetch(`https://blob.vercel-storage.com/${encodeURIComponent(file.name)}`, {
        method: 'PUT',
        headers: {
          'authorization': `Bearer ${token.trim()}`,
          'x-api-version': '7',
          'content-type': file.type,
        },
        body: file,
      });

      if (response.ok) {
        const data = await response.json();
        return data.url;
      }
    } catch (err) {
      console.warn('Vercel Blob direct upload failed, fallback to data URL:', err);
    }
  }

  // Fallback transparente: armazena como data URL de alta fidelidade
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
