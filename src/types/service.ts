export interface IBankingService {
  id: string;
  name: string;
  code: string;
  description: string;
  category: string;
  fee: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
