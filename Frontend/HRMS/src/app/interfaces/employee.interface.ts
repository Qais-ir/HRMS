export interface Employee{
  id: number;
  name: string;
  positionId?: number;
  positionName?: string;
  birthdate?: Date;
  status: boolean;
  startDate?: Date;
  endDate?: Date;
  phone?: string;
  managerId?: number | null; // number | undefined | null
  managerName?: string | null;
  departmentId?: number;
  departmentName?: string;
  salary?: number;
  email?: string;
  userId?: number;
}