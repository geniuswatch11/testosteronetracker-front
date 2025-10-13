import Image from "next/image"

interface LogoProps {
  width?: number
  height?: number
  className?: string
}

export function Logo({ width = 80, height = 80, className = "" }: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="Genius Testosterone Logo"
      width={width}
      height={height}
      className={className}
    />
  )
}
