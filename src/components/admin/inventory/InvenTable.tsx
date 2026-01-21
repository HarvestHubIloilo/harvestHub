import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { InventoryType } from "@/lib/definitions";
import Image from "next/image";
import { formatPrice } from "@/utils/formatPrice";

interface InventoryTableProps {
  inventory: InventoryType[];
  onAddStock: (item: InventoryType) => void;
  onReduceStock: (item: InventoryType) => void;
  loading: boolean; // Indicates loading state
}

const InventoryTable: React.FC<InventoryTableProps> = ({
  inventory,
  onAddStock,
  onReduceStock,
  loading,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Image</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Stock Quantity</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading
          ? // Skeleton rows for loading state
            Array.from({ length: 10 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="h-4 bg-gray-300 rounded w-12 animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-8 bg-gray-300 rounded w-12 animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-8 bg-gray-300 rounded w-24 animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-8 bg-gray-300 rounded w-24 animate-pulse"></div>
                </TableCell>
              </TableRow>
            ))
          : inventory.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.id}</TableCell>
                <TableCell>
                  <div className="bg-white w-fit rounded">
                    <Image
                      src={item.image_url || "/placeholder.png"}
                      alt={item.name}
                      width={50}
                      height={50}
                      className="h-12 w-12 object-contain"
                    />
                  </div>
                </TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  <span className="font-bold ">{item.stocks}</span>
                </TableCell>
                <TableCell>{formatPrice(item.price)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="default"
                      className="cursor-pointer"
                      size="sm"
                      onClick={() => onAddStock(item)}
                    >
                      Add Stock
                    </Button>
                    <Button
                      variant="outline"
                      className="cursor-pointer"
                      size="sm"
                      onClick={() => onReduceStock(item)}
                    >
                      Reduce Stock
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
      </TableBody>
    </Table>
  );
};

export default InventoryTable;
