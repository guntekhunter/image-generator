"use client"
import React from 'react';
import ColorPicker from 'react-pick-color';


export default function ColorPicker() {
    const [color, setColor] = useState('#fff');

    return (
    <ColorPicker color={color} onChange={color => setColor(color.hex)} />
  )
}
