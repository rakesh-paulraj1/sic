import React from 'react'


const Navbar = () => {
  return (
    <header className=" shadow">
    <div className="header-top bg-gray-300 border-b ">
      
    </div>
    <nav className="navbar  border-b">
  <div className="container mx-auto flex items-center justify-between">
    <div className="flex items-center space-x-3">
      <a href="/">
        <img
          src="/image.png"
          alt="Logo"
          className="h-14"
        />
      </a>
     
    </div>

    <div className="text-lg font-bold">School Innovation Council</div>
  
    
   
  </div>
</nav>


  </header>
  )
}

export default Navbar