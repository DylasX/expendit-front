import React from 'react';

interface ImageDefaultProps {
  name: string;
  color?: string;
  size?: number;
}

const ImageDefault: React.FC<ImageDefaultProps> = ({
  name,
  color,
  size = 10,
}) => {
  const colors = [
    'bg-gray-600',
    'bg-red-600',
    'bg-blue-600',
    'bg-green-600',
    'bg-yellow-600',
    'bg-purple-600',
    'bg-pink-600',
  ];

  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const isHexColor = color?.startsWith('#');
  const backgroundColor = isHexColor ? color : randomColor;

  const initials = name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');

  const sizePx = `${size * 4}px`; // Convertir el tamaño a píxeles
  const fontSize = `${size * 0.1}rem`; // Ajustar el tamaño de la fuente proporcionalmente

  return (
    <span
      className={`inline-block rounded-full ${
        isHexColor ? '' : backgroundColor
      } text-white text-center flex items-center justify-center`}
      style={{
        backgroundColor: isHexColor ? backgroundColor : undefined,
        width: sizePx,
        height: sizePx,
        fontSize,
        lineHeight: sizePx,
      }}
    >
      {initials}
    </span>
  );
};

export default ImageDefault;
