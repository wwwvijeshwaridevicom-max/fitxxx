import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = {
  width: 48,
  height: 48,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          background: '#090909',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '10px',
          border: '1px solid #262626',
          fontFamily: 'sans-serif',
          fontWeight: 900,
          letterSpacing: '-1px',
        }}
      >
        <span style={{ color: '#FFFFFF' }}>F</span>
        <span style={{ color: '#E50924' }}>X</span>
      </div>
    ),
    {
      ...size,
    }
  );
}
