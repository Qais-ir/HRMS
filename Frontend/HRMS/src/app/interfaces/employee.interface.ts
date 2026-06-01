export interface Employee{
  id: number;
  name?: string;
  firstName?: string;
  lastName?: string;
  positionId?: number;
  positionName?: string;
  birthDate?: Date;
  isActive: boolean;
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
  image?: any;
  imagePath?: string;
}