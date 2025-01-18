import React from 'react'
import { cn } from '@/lib/utils'

const SearchButton = () => {
  return (
    <button
      type="submit"
      className={cn(
        "w-full max-w-xs mx-auto rounded-md", // Center and round corners
        "transition-all duration-200 flex items-center justify-center font-medium py-4 px-8",
        // Light mode: black background, white text
        "bg-black text-white hover:bg-gray-900",
        // Dark mode: white background, black text
        "dark:bg-white dark:text-black dark:hover:bg-gray-100"
      )}
    >
      Search
    </button>
  )
}

export default SearchButton
