"use client";
import React from "react";
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
  Chip,
  User,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor,
  Tooltip,
} from "@nextui-org/react";
import { PlusIcon } from "../../../../public/images/icon/PlusIcon";
import { VerticalDotsIcon } from "../../../../public/images/icon/VerticalDotsIcon";
import { ChevronDownIcon } from "../../../../public/images/icon/ChevronDownIcon";
import { SearchIcon } from "../../../../public/images/icon/SearchIcon";
import { columns } from "./PatientData";
import { capitalize } from "./utils";

interface PetData {
  id: string;
  petId: string;
  petName: string;
  petSpecies: string;
  petSex: string;
  petBreed: string;
  petAge: number;
  petWeight: number;
  petAvatar?: string;
  owner?: {
    user?: {
      name?: string;
      image?: string;
    };
  };
}

const INITIAL_VISIBLE_COLUMNS = [
  "petName",
  "petSpecies",
  "petSex",
  "petBreed",
  "actions",
];

export default function App() {
  const [users, setUsers] = React.useState<PetData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [filterValue, setFilterValue] = React.useState("");
  const [petIdFilter, setPetIdFilter] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([]),
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });

  const [page, setPage] = React.useState(1);

  const copyPetData = (user: PetData) => {
    const dataToCopy = `
DB ID: ${user.id}
PET ID: ${user.petId}
NAME: ${user.petName}
SPECIES: ${user.petSpecies}
BREED: ${user.petBreed}
GENDER: ${user.petSex}
AGE: ${user.petAge}
WEIGHT: ${user.petWeight || "N/A"}
OWNER: ${user.owner?.user?.name || "N/A"}
    `.trim();

    navigator.clipboard.writeText(dataToCopy);
  };

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/pets");
        const data = await response.json();
        // Ensure data is an array, or default to an empty array
        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching pets:", error);
        setUsers([]); // Set users to an empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const hasSearchFilter = React.useMemo(() => {
    return filterValue !== "" || petIdFilter !== "";
  }, [filterValue, petIdFilter]);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = Array.isArray(users) ? [...users] : [];

    if (filterValue) {
      filteredUsers = filteredUsers.filter((user) =>
        user.petName.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    if (petIdFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.petId.toString().includes(petIdFilter),
      );
    }

    return filteredUsers;
  }, [users, filterValue, petIdFilter, hasSearchFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: PetData, b: PetData) => {
      const first = a[sortDescriptor.column as keyof PetData] as number;
      const second = b[sortDescriptor.column as keyof PetData] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((pet: PetData, columnKey: string) => {
    const cellValue = pet[columnKey as keyof PetData];

    switch (columnKey) {
      case "petName":
        return (
          <User
            avatarProps={{ radius: "lg", src: pet.petAvatar }}
            name={cellValue as string}
          ></User>
        );
      case "species":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{pet.petSpecies}</p>
          </div>
        );
      case "gender":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{pet.petSex}</p>
          </div>
        );
      case "breed":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{pet.petBreed}</p>
          </div>
        );
      case "age":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{pet.petAge}</p>
          </div>
        );
      case "weight":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{pet.petWeight}</p>
          </div>
        );
      case "ownerName":
        return (
          <User
            avatarProps={{ radius: "lg", src: pet.owner?.user?.image }}
            name={pet.owner?.user?.name || "N/A"}
          ></User>
        );
      case "actions":
        return (
          <div className="relative flex items-center justify-end gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <VerticalDotsIcon width={4} height={4} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem href={`dashboard/pet-info/${pet.id}`}>
                  View
                </DropdownItem>
                <DropdownItem href={`dashboard/pet-edit/${pet.id}`}>
                  Edit
                </DropdownItem>
                <DropdownItem onPress={() => copyPetData(pet)}>
                  Copy
                </DropdownItem>
                <DropdownItem className="text-danger" color="danger">
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return String(cellValue);
    }
  }, []);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [],
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onPetIdSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setPetIdFilter(value);
      setPage(1);
    } else {
      setPetIdFilter("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPetIdFilter("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <div className="flex w-full gap-3 sm:max-w-[70%]">
            <Input
              isClearable
              className="w-full sm:max-w-[44%]"
              placeholder="Search by name..."
              startContent={<SearchIcon />}
              value={filterValue}
              onClear={() => onClear()}
              onValueChange={onSearchChange}
            />
            <Input
              isClearable
              className="w-full sm:max-w-[44%]"
              placeholder="Search by Pet ID..."
              startContent={<SearchIcon />}
              value={petIdFilter}
              onClear={() => onClear()}
              onValueChange={onPetIdSearchChange}
            />
          </div>
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-small text-default-400">
            Total {users.length} Pet Patients
          </span>
          <label className="flex items-center text-small text-default-400">
            Rows per page:
            <select
              className="bg-transparent text-small text-default-400 outline-none"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    petIdFilter,
    visibleColumns,
    onSearchChange,
    onPetIdSearchChange,
    onRowsPerPageChange,
    users.length,
    onClear,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex items-center justify-between px-2 py-2">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden w-[30%] justify-end gap-2 sm:flex">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [
    selectedKeys,
    filteredItems.length,
    page,
    pages,
    onPreviousPage,
    onNextPage,
  ]);

  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[382px]",
      }}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No pet patients found"} items={sortedItems}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, String(columnKey))}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
