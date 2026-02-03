import * as React from "react"
import Image from "next/image"

const Avatar = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}
        {...props}
    />
))
Avatar.displayName = "Avatar"

interface AvatarImageProps {
    className?: string
    src?: string
    alt?: string
}

const AvatarImage = React.forwardRef<
    HTMLImageElement,
    AvatarImageProps
>(({ className, src, alt }, ref) => {
    if (!src) return null

    return (
        <Image
            ref={ref as React.Ref<HTMLImageElement>}
            className={`aspect-square h-full w-full ${className || ""}`}
            src={src}
            alt={alt || ""}
            width={40}
            height={40}
            unoptimized
        />
    )
})
AvatarImage.displayName = "AvatarImage"

const AvatarFallback = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className}`}
        {...props}
    />
))
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }
