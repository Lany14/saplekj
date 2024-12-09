// src/components/BackOffice/Tables/VetDoctorsTable.tsx

"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  User,
  Pagination,
} from "@nextui-org/react";
import { SearchIcon } from "../../../../public/images/icon/SearchIcon";
import { VerticalDotsIcon } from "../../../../public/images/icon/VerticalDotsIcon";
import { ChevronDownIcon } from "../../../../public/images/icon/ChevronDownIcon";

interface VetDoctor {
  id: string;
  name: string;
  email: string;
}

const INITIAL_VISIBLE_COLUMNS = ["name", "email", "actions"];

export default function VetDoctorsTable() {
  const [vetDoctors, setVetDoctors] = useState<VetDoctor[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchVetDoctors = async () => {
      try {
        const response = await fetch("/api/users/vet-docs");
        const data = await response.json();
        setVetDoctors(data);
      } catch (error) {
        console.error("Error fetching vet doctors:", error);
      }
    };

    fetchVetDoctors();
  }, []);

  const filteredItems = vetDoctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(filterValue.toLowerCase()),
  );

  const pages = Math.ceil(filteredItems.length / rowsPerPage);
  const items = filteredItems.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  const onSearchChange = (value: string) => {
    setFilterValue(value);
    setPage(1);
  };

  const renderCell = (doctor: VetDoctor, columnKey: string) => {
    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{
              radius: "lg",
              src: "/images/avatar-placeholder.png",
            }}
            name={doctor.name}
          ></User>
        );
      case "email":
        return doctor.email;
      case "actions":
        return (
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="light">
                <VerticalDotsIcon width={4} height={4} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem>View</DropdownItem>
              <DropdownItem>Edit</DropdownItem>
              <DropdownItem className="text-danger" color="danger">
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Input
          isClearable
          placeholder="Search by name..."
          startContent={<SearchIcon />}
          value={filterValue}
          onValueChange={onSearchChange}
        />
        <Pagination
          isCompact
          showControls
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
      </div>

      <Table
        aria-label="Vet Doctors Table"
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[382px]",
        }}
      >
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"No vet doctors found"} items={items}>
          {(doctor) => (
            <TableRow key={doctor.id}>
              {["name", "email", "actions"].map((columnKey) => (
                <TableCell key={columnKey}>
                  {renderCell(doctor, columnKey)}
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
