import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/definitions";
import { toSentenceCase } from "@/utils/toSentenceCase";

type UserTableProps = {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  loading: boolean;
};

const UserTable: React.FC<UserTableProps> = ({
  users,
  onEdit,
  onDelete,
  loading,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Full Name</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Mobile Number</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading
          ? Array.from({ length: 10 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="h-4 bg-gray-300 rounded w-12 animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-300 rounded w-48 animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-8 bg-gray-300 rounded w-24 animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-8 bg-gray-300 rounded w-24 animate-pulse"></div>
                </TableCell>
              </TableRow>
            ))
          : users
              .filter((user) => !user.is_deleted) // 👈 filter out deleted users
              .map((user, index) => (
                <TableRow key={index + 1}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {toSentenceCase(
                      `${user.name?.first || "N/A"} ${
                        user.name?.middle || ""
                      } ${user.name?.last || ""}`.trim(),
                    )}
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.mobile_number}</TableCell>
                  <TableCell>
                    {typeof user.address === "string"
                      ? user.address
                      : user.address
                        ? JSON.stringify(user.address)
                        : "N/A"}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => onEdit(user)}>
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => onDelete(String(user.user_id))}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
      </TableBody>
    </Table>
  );
};

export default UserTable;
