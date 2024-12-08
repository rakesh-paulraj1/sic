import React from 'react'
interface ButtonProps {
    content: string;
    onClick?: ()=> void;
  }
const Button:React.FC<ButtonProps> = ({ content,onClick }) =>  {
  return (
    <button onClick={onClick} className='px-8 py-2  bg-black  w-full text-white text-lg rounded-md font-semibold hover:bg-black/[0.8] hover:shadow-lg'>{content}</button>
  )
}

export default Button