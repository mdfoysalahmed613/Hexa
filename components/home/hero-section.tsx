"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { HeroImage, PantImage, ShirtImage, ShoeImage, TShirtsImage, WatchImage } from "@/assets/common";
const categories = [
   {
      name: "Shirts",
      image: ShirtImage, // Add your 400x400px image
      count: "120+ Styles",
      href: "/products?category=shirts",
   },
   {
      name: "T-Shirts",
      image: TShirtsImage, // Add your 400x400px image
      count: "150+ Designs",
      href: "/products?category=t-shirts",
   },
   {
      name: "Pants",
      image: PantImage, // Add your 400x400px image
      count: "80+ Fits",
      href: "/products?category=pants",
   },
   {
      name: "Shoes",
      image: ShoeImage, // Add your 400x400px image
      count: "90+ Pairs",
      href: "/products?category=shoes",
   },
   {
      name: "Watches",
      image: WatchImage,// Add your 400x400px image
      count: "60+ Timepieces",
      href: "/products?category=watches",
   },
]; export function HeroSection() {
   return (
      <section className="relative w-full">
         {/* Main Hero */}
         <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
               {/* Left Content */}
               <div className="flex flex-col justify-center space-y-6">
                  <Badge className="w-fit" variant="secondary">
                     New Collection 2025
                  </Badge>
                  <div className="space-y-4">
                     <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                        Premium Essentials for the {" "}
                        <span className="text-primary">Modern Man</span>
                     </h1>
                     <p className="text-lg text-muted-foreground md:text-xl max-w-[600px]">
                        Hexa Shop offers shirts, pants, wallets, and everyday essentials built to elevate your style and confidence.
                     </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                     <Button size="lg" asChild>
                        <Link href="/products">
                           Shop Collection
                           <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                     </Button>
                     <Button size="lg" variant="outline" asChild>
                        <Link href="/about">Learn More</Link>
                     </Button>
                  </div>
                  {/* Stats */}
                  <div className="flex gap-8 pt-4">
                     <div>
                        <div className="text-2xl font-bold">500+</div>
                        <div className="text-sm text-muted-foreground">Products</div>
                     </div>
                     <div>
                        <div className="text-2xl font-bold">10K+</div>
                        <div className="text-sm text-muted-foreground">
                           Happy Customers
                        </div>
                     </div>
                     <div>
                        <div className="text-2xl font-bold">4.9</div>
                        <div className="text-sm text-muted-foreground">Rating</div>
                     </div>
                  </div>
               </div>

               {/* Right Content - Hero Image */}
               <div className="relative aspect-square lg:aspect-auto lg:h-[600px]">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden">
                     <Image
                        src={HeroImage}
                        alt="Men's Fashion Collection"
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                     />
                  </div>
               </div>
            </div>
         </div>

         {/* Category Cards */}
         <div className="bg-secondary/30 py-12 md:py-16">
            <div className="container mx-auto px-4">
               <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold tracking-tight mb-2">
                     Shop by Category
                  </h2>
                  <p className="text-muted-foreground">
                     Discover our premium collection for modern men
                  </p>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {categories.map((category) => (
                     <Link
                        key={category.name}
                        href={category.href}
                        className="group"
                     >
                        <div className="bg-background rounded-lg overflow-hidden border border-border hover:border-primary hover:shadow-lg transition-all duration-300">
                           <div className="relative aspect-square w-full bg-secondary/30">
                              <Image
                                 src={category.image}
                                 alt={category.name}
                                 fill
                                 className="object-cover group-hover:scale-105 transition-transform duration-300"
                                 sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                              />
                           </div>
                           <div className="p-4 text-center">
                              <h3 className="font-semibold">{category.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                 {category.count}
                              </p>
                           </div>
                        </div>
                     </Link>
                  ))}
               </div>
            </div>
         </div>

         {/* Features Banner */}
         <div className="border-t border-border">
            <div className="container mx-auto px-4 py-8">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div className="space-y-1">
                     <div className="font-semibold">Free Shipping</div>
                     <div className="text-sm text-muted-foreground">
                        On orders over $50
                     </div>
                  </div>
                  <div className="space-y-1">
                     <div className="font-semibold">Easy Returns</div>
                     <div className="text-sm text-muted-foreground">
                        30-day return policy
                     </div>
                  </div>
                  <div className="space-y-1">
                     <div className="font-semibold">Premium Quality</div>
                     <div className="text-sm text-muted-foreground">
                        Handpicked materials
                     </div>
                  </div>
                  <div className="space-y-1">
                     <div className="font-semibold">Secure Payment</div>
                     <div className="text-sm text-muted-foreground">
                        100% protected
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}
