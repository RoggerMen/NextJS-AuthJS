"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface User {
  id: string;
  name: string | null;
  username: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  phoneNumber: string | null;
  createdAt: Date;
  updatedAt: Date;
  role: "user" | "admin";
  profile: {
    id: string;
    career: string | null;
    education: string | null;
    englishLevel: string | null;
    salary: string | null;
    experience: string | null;
    linkedin: string | null;
    cvUrl: string | null;
  } | null;
}

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchUsers();
  }, []); // Removed currentPage from dependencies

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `/api/users?page=${currentPage}&pageSize=${pageSize}`
      );
      const data = await response.json();
      setUsers(data.users);
      setTotalPages(Math.ceil(data.total / pageSize));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Table>
        <TableCaption>
          Lista de usuarios registrados (excluyendo administradores)
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Carrera</TableHead>
            <TableHead>Educación</TableHead>
            <TableHead>Nivel de Inglés</TableHead>
            <TableHead>Salario Deseado</TableHead>
            <TableHead>Experiencia</TableHead>
            <TableHead>LinkedIn</TableHead>
            <TableHead>CV</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name || user.username || "N/A"}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.profile?.career || "N/A"}</TableCell>
              <TableCell>{user.profile?.education || "N/A"}</TableCell>
              <TableCell>{user.profile?.englishLevel || "N/A"}</TableCell>
              <TableCell>{user.profile?.salary || "N/A"}</TableCell>
              <TableCell>
                {user.profile?.experience + " Años" || "N/A"}
              </TableCell>
              <TableCell>
                {user.profile?.linkedin ? (
                  <a
                    href={user.profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Ver LinkedIn
                  </a>
                ) : (
                  "N/A"
                )}
              </TableCell>
              <TableCell>
                {user.profile?.cvUrl ? (
                  <Button asChild variant="outline" size="icon">
                    <a
                      href={user.profile.cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FileText className="h-4 w-4" />
                    </a>
                  </Button>
                ) : (
                  "N/A"
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              aria-disabled={currentPage === 1}
              className={
                currentPage === 1 ? "opacity-50 pointer-events-none" : ""
              }
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => setCurrentPage(i + 1)}
                isActive={currentPage === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              aria-disabled={currentPage === totalPages}
              className={
                currentPage === totalPages
                  ? "opacity-50 pointer-events-none"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
