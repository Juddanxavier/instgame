export interface Role {
  superAdmin: RoleDetails;
  customer: RoleDetails;
}
export interface RoleDetails {
  initials: string;
  rights: string[];
}

const allRoles: Role = {
  superAdmin: { initials: 'SA', rights: [] },
  customer: { initials: 'CU', rights: [] },
};

export const roles: string[] = Object.keys(allRoles).map((role) =>
  role.toLowerCase()
);

export const matchRole = (role) =>
  Object.keys(allRoles)
    .map((value) => {
      if (
        value.match(RegExp(`\\b${role}`, 'i') || value.match(RegExp(role, 'i')))
      ) {
        return value;
      }
      return null;
    })
    .filter((value) => value)
    .reduce((prev, value, index) => value, null);

export const getRoleInitials = (role: string) => {
  return allRoles[role].initials;
};

export const roleRights: Map<string, RoleDetails> = new Map(
  Object.entries(allRoles)
);
