"use client";

import { useEffect, useState } from "react";
import { toSentenceCase } from "@/utils/toSentenceCase";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/formatPrice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRelativeTime } from "@/utils/getRelativeTime";
import Image from "next/image";

interface ProductItem {
  id: number;
  name: string;
  image_url?: string;
  quantity: number;
  price: number;
}

interface PurchaseItem {
  productList: ProductItem[];
  id: number;
  name: string;
  status: string;
  total_amount: number;
  order_date: string;
}

const ItemList: React.FC = () => {
  const [filter, setFilter] = useState("All");
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPurchases = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== "All") params.append("status", filter);
      params.append("limit", "50");
      const res = await fetch(`/api/purchase?${params.toString()}`);
      const data = await res.json();
      console.log("Fetched purchases:", data.items);
      setPurchases(data.items || []);
      setLoading(false);
    };
    fetchPurchases();
  }, [filter]);

  return (
    <div className="myContainer mx-auto p-4 space-y-4">
      {/* Filter Section */}
      <div className="flex space-x-4 bg-white p-4 rounded-md shadow-sm mb-4 overflow-auto">
        {[
          "All",
          "Ready to Pickup",
          "Completed",
          "Canceled",
          "Return & Refund",
        ].map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            onClick={() => setFilter(status)}
          >
            {status}
          </Button>
        ))}
      </div>

      {/* Purchase List */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : purchases.length > 0 ? (
          purchases.map((purchase) => (
            <Card key={purchase.id} className="shadow-sm rounded-sm p-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold border-b-1 border-gray-200 pb-2">
                  {purchase.productList[0]?.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Status:{" "}
                  <span className="font-medium">
                    {toSentenceCase(purchase.status)}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Amount: {formatPrice(purchase.total_amount)}
                </p>
                <p className="text-sm text-gray-600">
                  Date:{" "}
                  {purchase.order_date
                    ? getRelativeTime(purchase.order_date)
                    : ""}
                </p>
                {/* Product List */}
                {purchase.productList && purchase.productList.length > 0 && (
                  <div className="mt-4">
                    <div className="font-semibold mb-2">Items:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {purchase.productList.map((item: ProductItem) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 bg-gray-50 rounded p-2 border"
                        >
                          {item.image_url ? (
                            <Image
                              width={48}
                              height={48}
                              src={item.image_url}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded shadow"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                              N/A
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="font-medium text-base">
                              {item.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              Qty:{" "}
                              <span className="font-semibold">
                                {item.quantity}
                              </span>
                              {" · "}
                              <span>{formatPrice(item.price)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500">No purchases found.</p>
        )}
      </div>
    </div>
  );
};

export default ItemList;
