import {Permission} from "./permission";

export interface PermissionGroupDto {
    groupId: string;
    name: string;
    permissions: string[];
}
