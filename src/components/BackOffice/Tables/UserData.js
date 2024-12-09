const columns = [
  { name: "DB ID", uid: "id", sortable: true },
  { name: "USER ID", uid: "userId", sortable: true },
  { name: "NAME", uid: "name", sortable: true },
  { name: "EMAIL", uid: "email", sortable: true },
  { name: "ROLE", uid: "role", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = [
  { name: "PENDING", uid: "PENDING" },
  { name: "ONLINE", uid: "ONLINE" },
  { name: "OFFLINE", uid: "OFFLINE" },
];

export { columns, statusOptions};
