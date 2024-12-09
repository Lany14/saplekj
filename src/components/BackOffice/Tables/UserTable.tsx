"use client";
import React, { useEffect } from "react";
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
  User as NextUIUser,
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
import { columns, statusOptions } from "./UserData";
import { capitalize } from "./utils";
import { useSession } from "next-auth/react";

const statusColorMap: Record<string, ChipProps["color"]> = {
  ACTIVE: "success",
  PENDING: "warning",
  ONLINE: "success",
  OFFLINE: "danger",
};

const INITIAL_VISIBLE_COLUMNS = [
  "userId",
  "name",
  "email",
  "role",
  "status",
  "actions",
];

const roleOptions = [
  { name: "ADMIN", uid: "ADMIN" },
  { name: "VET_DOCTOR", uid: "VET_DOCTOR" },
  { name: "VET_NURSE", uid: "VET_NURSE" },
  { name: "VET_RECEPTIONIST", uid: "VET_RECEPTIONIST" },
  { name: "PET_OWNER", uid: "PET_OWNER" },
];

interface UserData {
  id: string;
  userId: string;
  name: string;
  email: string;
  status: string;
  role: string;
  avatar?: string;
}

export default function UserTable() {
  // Renamed from App to UserTable for clarity
  const [users, setUsers] = React.useState<UserData[]>([]);
  const [filterValue, setFilterValue] = React.useState("");
  const [userIdFilter, setUserIdFilter] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([]),
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [roleFilter, setRoleFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "name", // Changed from age to name since age isn't in UserData
    direction: "ascending",
  });

  const [page, setPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);

  const { data: session } = useSession();

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users];

    if (filterValue) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    if (userIdFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.userId.toString().includes(userIdFilter),
      );
    }

    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.status),
      );
    }

    if (
      roleFilter !== "all" &&
      Array.from(roleFilter).length !== roleOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(roleFilter).includes(user.role),
      );
    }

    return filteredUsers;
  }, [users, filterValue, userIdFilter, statusFilter, roleFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: UserData, b: UserData) => {
      const first = a[sortDescriptor.column as keyof UserData];
      const second = b[sortDescriptor.column as keyof UserData];

      if (typeof first === "string" && typeof second === "string") {
        return sortDescriptor.direction === "descending"
          ? second.localeCompare(first)
          : first.localeCompare(second);
      }

      return 0;
    });
  }, [sortDescriptor, items]);

  const copyUserData = async (user: UserData) => {
    const dataToCopy = `DB ID: ${user.id}\nUSER ID: ${user.userId}\nNAME: ${user.name}\nEMAIL: ${user.email}`;
    try {
      await navigator.clipboard.writeText(dataToCopy);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const renderCell = React.useCallback(
    (user: UserData, columnKey: React.Key) => {
      const cellValue = user[columnKey as keyof UserData];

      switch (columnKey) {
        case "name":
          return (
            <NextUIUser
              avatarProps={{ radius: "lg", src: user.avatar }}
              name={cellValue as string}
            />
          );
        case "role":
          return (
            <div className="flex flex-col">
              <Chip
                className="capitalize"
                color="primary"
                size="sm"
                variant="flat"
              >
                {cellValue as string}
              </Chip>
            </div>
          );
        case "status":
          return (
            <div className="flex flex-col">
              <Chip
                className="capitalize"
                color={statusColorMap[cellValue as string]}
                size="sm"
                variant="flat"
              >
                {cellValue as string}
              </Chip>
            </div>
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
                  <DropdownItem href={`/dashboard/user-info/${user.id}`}>
                    View
                  </DropdownItem>
                  <DropdownItem href={`/dashboard/user-edit/${user.id}`}>
                    Edit
                  </DropdownItem>
                  <DropdownItem onPress={() => copyUserData(user)}>
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
          return cellValue;
      }
    },
    [],
  );

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

  const onUserIdSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setUserIdFilter(value);
      setPage(1);
    } else {
      setUserIdFilter("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setUserIdFilter("");
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
              onClear={() => setFilterValue("")}
              onValueChange={onSearchChange}
            />
            <Input
              isClearable
              className="w-full sm:max-w-[44%]"
              placeholder="Search by User ID..."
              startContent={<SearchIcon />}
              value={userIdFilter}
              onClear={() => setUserIdFilter("")}
              onValueChange={onUserIdSearchChange}
            />
          </div>
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Role
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={roleFilter}
                selectionMode="multiple"
                onSelectionChange={setRoleFilter}
              >
                {roleOptions.map((role) => (
                  <DropdownItem key={role.uid} className="capitalize">
                    {capitalize(role.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
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
            Total {users.length} Users
          </span>
          <label className="flex items-center text-small text-default-400">
            Rows per page:
            <select
              className="ml-2 bg-transparent text-small text-default-400 outline-none"
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
    userIdFilter,
    statusFilter,
    roleFilter,
    visibleColumns,
    onSearchChange,
    onUserIdSearchChange,
    onRowsPerPageChange,
    users.length,
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
            isDisabled={pages === 1 || page === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1 || page === pages}
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
      aria-label="User management table with custom cells, pagination and sorting"
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
      <TableBody emptyContent={"No users found"} items={sortedItems}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
