
export interface Employee{
  id ?: number;
  name ?: string;
  firstName ?: string;
  lastName ?: string;
  positionId ?: number;
  positionName ?: string;
  status ?: boolean;
  birthdate ?: Date;
  email ?: string;
  salary ?: number;
  departmentId ?: number;
  departmentName ?: string;
  managerId ?: number | null; // Number | Undefined ?? null
  managerName ?: string | null;
  userId ?: number;
}