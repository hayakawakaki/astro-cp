import { createAccessControl } from "better-auth/plugins/access";

// Define your resources and actions
export const ac = createAccessControl({
  user: ["create", "list", "set-role", "impersonate ", "ban", "delete", "set-password"],
  account: ["create", "list", "update", "delete"],
  content: ["create", "edit", "delete", "hide"],
});

// Create roles with specific permissions
export const user = ac.newRole({
  content: ["create"],
  account: ["create", "list", "update", "delete"],
});

export const admin = ac.newRole({
  user: ["create", "list", "set-role", "impersonate ", "ban", "delete", "set-password"],
  account: ["create", "list", "update", "delete"],
  content: ["create", "edit", "delete", "hide"],
});

export const moderator = ac.newRole({
  user: ["list", "ban"],
  account: ["create", "list", "update", "delete"],
  content: ["create", "edit", "delete", "hide"],
});
