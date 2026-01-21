import { FC, useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/lib/definitions";
import { useRouter } from "next/navigation";
import { fallbackImage } from "@/lib/fallbackImg";
import { is_featuredCount } from "@/lib/ItemsCountConfig";

const FeaturedProductCarousel: FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const handleProductClick = (id: number) => {
    router.push(`/product/details/${id}`);
  };

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch(
          `/api/products?is_featured=true&limit=${is_featuredCount}`,
        );
        const data = await response.json();
        setFeaturedProducts(data.products || []);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    // Skeleton loading animation while fetching data
    return (
      <Carousel>
        <CarouselContent>
          {[...Array(10)].map((_, index) => (
            <CarouselItem key={index} className="md:basis-1/4 lg:basis-1/5">
              <div className="relative w-full h-55 rounded-sm overflow-hidden">
                <Skeleton className="w-full h-full" />
              </div>
              <div className="mt-2">
                <Skeleton className="h-4 w-3/4 mb-2 " />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    );
  }

  if (featuredProducts.length === 0) {
    return <p>No featured products available.</p>;
  }

  return (
    <Carousel>
      <CarouselContent>
        {featuredProducts.map((product, index) => (
          <CarouselItem
            key={index}
            className="basis:1 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 cursor-pointer pb-2"
            onClick={() =>
              product.product_id && handleProductClick(product.product_id)
            }
          >
            <div className="relative w-full h-60 rounded-md overflow-hidden bg-white shadow-sm border hover:shadow-md transition-transform transform hover:-translate-y-0.5">
              <Image
                src={
                  typeof product.image_url === "string"
                    ? product.image_url
                    : fallbackImage
                }
                alt="product image"
                width={400}
                height={300}
                className="w-full h-full object-cover"
                priority
              />
              <div className="absolute bottom-0 left-0 right-0 bgt-black/50 p-4">
                <h3 className="relative left-[-20] bottom-[-20] border pb-2 text-lg font-semibold text-gray-900 p-1 px-4 rounded-tr-2xl shadow-2xl bg-white w-fit ">
                  {product.name}
                </h3>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="ml-18" />
      <CarouselNext className="mr-18" />
    </Carousel>
  );
};

export default FeaturedProductCarousel;
