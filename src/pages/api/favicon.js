import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

async function loadNotoSansFont() {
  return await fetch(
    'https://raw.githubusercontent.com/googlefonts/noto-fonts/main/hinted/ttf/NotoSans/NotoSans-Bold.ttf',
  ).then((res) => res.arrayBuffer());
}
export default async function handler(req, res) {
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host;
  const fullUrl = `${protocol}://${host}${req.url}`;
  const decodedUrl = fullUrl.replace(/&amp;/g, '&');
  const parsedUrl = new URL(decodedUrl);
  const params = Object.fromEntries(parsedUrl.searchParams.entries());
  const fontData = await loadNotoSansFont();

  try {
    const { client = 'Hello Amita', theme = '#000' } = params;
    const stringArray = client?.split(' ');
    let fallbackInitials = 'A';
    fallbackInitials =
      stringArray?.length <= 1
        ? `${client.charAt(0).toUpperCase()}${client.charAt(1)?.toUpperCase() || ''}`
        : stringArray
            ?.map((word) => word.charAt(0).toUpperCase())
            .join('')
            .slice(0, 2);

    const svg = await satori(
      {
        type: 'div',
        props: {
          style: {
            height: '630px',
            width: '1200px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            background: theme,
            position: 'relative',
            textAlign: 'center',
            fontFamily: 'Noto Sans',
          },

          children: [
            {
              type: 'div',
              props: {
                style: {
                  fontSize: '600px',
                  fontWeight: 'bold',
                  letterSpacing: '90px',
                  color: '#fff',
                  textAlign: 'center',
                  lineHeight: 1.2,
                },
                children: fallbackInitials,
              },
            },
          ],
        },
      },
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Noto Sans',
            data: fontData,
            weight: 700,
            style: 'normal',
          },
        ],
      },
    );

    const resvg = new Resvg(svg, {
      fitTo: {
        mode: 'width',
        value: 1200,
      },
    });

    const pngBuffer = resvg.render().asPng();

    res.setHeader(
      'Cache-Control',
      'public, immutable, no-transform, s-maxage=31536000, max-age=31536000',
    );
    res.setHeader('Content-Type', 'image/png');
    res.send(pngBuffer);
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: 'Failed to generate image', details: error.message });
  }
}
