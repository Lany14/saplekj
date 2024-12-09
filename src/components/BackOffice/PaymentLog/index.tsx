"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  ChipProps,
} from "@nextui-org/react";
import { EyeOffIcon } from "lucide-react";

type Payment = {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  email: string;
};

const statusColorMap: Record<string, ChipProps["color"]> = {
  paid: "success",
  pending: "warning",
  failed: "danger",
};

const payments: Payment[] = [
  {
    id: "PAY-001",
    date: "2023-06-01",
    amount: 100.0,
    status: "paid",
    email: "user1@example.com",
  },
  {
    id: "PAY-002",
    date: "2023-06-02",
    amount: 75.5,
    status: "pending",
    email: "user2@example.com",
  },
  {
    id: "PAY-003",
    date: "2023-06-03",
    amount: 200.0,
    status: "failed",
    email: "user3@example.com",
  },
  {
    id: "PAY-004",
    date: "2023-06-04",
    amount: 50.0,
    status: "paid",
    email: "user4@example.com",
  },
  {
    id: "PAY-005",
    date: "2023-06-05",
    amount: 150.0,
    status: "pending",
    email: "user5@example.com",
  },
];

export default function PaymentsTable() {
  const columns = [
    { name: "ID", uid: "id" },
    { name: "DATE", uid: "date" },
    { name: "AMOUNT", uid: "amount" },
    { name: "STATUS", uid: "status" },
    { name: "USER", uid: "user" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const renderCell = React.useCallback(
    (payment: Payment, columnKey: React.Key) => {
      const cellValue = payment[columnKey as keyof Payment];

      switch (columnKey) {
        case "amount":
          return `$${payment.amount.toFixed(2)}`;
        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[payment.status]}
              size="sm"
              variant="flat"
            >
              {cellValue}
            </Chip>
          );
        case "user":
          return (
            <User
              avatarProps={{
                radius: "lg",
                src: `https://i.pravatar.cc/150?u=${payment.email}`,
              }}
              description={payment.email}
              name={payment.email.split("@")[0]}
            >
              {payment.email}
            </User>
          );
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip content="View payment details">
                <span className="cursor-pointer text-lg text-default-400 active:opacity-50">
                  <EyeOffIcon />
                </span>
              </Tooltip>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [],
  );

  return (
    <Table aria-label="Payments log and history table">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={payments}>
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

function EyeIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 20 20"
      width="1em"
    >
      <path
        d="M12.9833 10C12.9833 11.65 11.65 12.9833 10 12.9833C8.35 12.9833 7.01666 11.65 7.01666 10C7.01666 8.35 8.35 7.01666 10 7.01666C11.65 7.01666 12.9833 8.35 12.9833 10Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M9.99999 16.8916C12.9417 16.8916 15.6833 15.1583 17.5917 12.1583C18.3417 10.9833 18.3417 9.00831 17.5917 7.83331C15.6833 4.83331 12.9417 3.09998 9.99999 3.09998C7.05833 3.09998 4.31666 4.83331 2.40833 7.83331C1.65833 9.00831 1.65833 10.9833 2.40833 12.1583C4.31666 15.1583 7.05833 16.8916 9.99999 16.8916Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
}
