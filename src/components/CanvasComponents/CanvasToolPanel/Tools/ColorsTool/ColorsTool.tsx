import React from 'react';

const colors = [
    [
      "#FF4500",
      "#FFD700",
      "#FFFFE0",
      "#FFA500",
      "#F4A460",
      "#ADFF2F",
      "#90EE90",
      "#008000",
      "#006400",
      "#008080",
      "#E6E6FA",
      "#9370DB",
    ],
    [
      "#87CEEB",
      "#4169E1",
      "#0000FF",
      "#0066CC",
      "#008B8B",
      "#000080",
      "#4B0082",
      "#B0C4DE",
      "#808080",
      "#A9A9A9",
      "#191970",
      "#000033",
    ],
  ];

function ColorsTool() {
  return (
    <div className="space-y-2">
        <label className="text-sm font-medium">Colors</label>
        <div className="grid grid-cols-6 gap-1 p-2 border rounded-sm">
          {colors.map((row, rowIndex) => (
            <div key={rowIndex} className="contents">
              {row.map((color, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  className="w-8 h-8 rounded-full hover:ring-2 ring-offset-2 ring-gray-400 transition-all"
                  style={{ backgroundColor: color }}
                  aria-label={`Color ${color}`}
                />
              ))}

            </div>
          ))}
        </div>
      </div>
  )
}

export default ColorsTool