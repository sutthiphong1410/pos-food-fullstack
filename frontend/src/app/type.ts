export interface User {
  id: number;
  name: string;
  username: string;
  password: string;
  level: string;
  status: string;
  BillSales?: BillSale[];
}
export interface FoodType {
  id: number;
  name: string;
  remark: string;
  status: string;
}

export interface FoodSize {
  id: number;
  foodTypeId: number;
  foodType?: FoodType;
  name: string;
  moneyAdded: number;
  remark: string;
  status: string;
}

export interface Taste {
  id: number;
  foodTypeId: number;
  FoodType?: FoodType;
  name: string;
  remark: string;
  status: string;
}

export interface Food {
  id: number;
  name: string;
  img: string;
  remark: string;
  status: string;
  price: number;
  foodTypeId: number;
  foodType: string;
  FoodType?: FoodType;
}

export interface SaleTemp {
  id: number;
  userId: number;
  tableNo: number;
  foodId: number;
  qty: number;
  SaleTempdetails: SaleTempDetail[];
  Food: Food;
}

export interface SaleTempDetail {
  id: number;
  saleTempId: number;
  foodId: number;
  tasteId: number;
  foodSizeId: number;
  Food: Food;
  Taste: Taste;
  FoodSize: FoodSize;
  SaleTemp?: SaleTemp;
}

export interface BillSale {
  id: number;
  createDate: Date;
  payDate: Date;
  amount: number;
  payType: string;
  userId: number;
  inputMoney: number;
  returnMoney: number;
  tableNo: number;
  status: string;
  User?: User;
  billSaleDetails: BillSaleDetail[];
}

export interface BillSaleDetail {
  id: number;
  billSaleId: number;
  foodId: number;
  foodSizeId: number;
  tasteId: number;
  moneyAdded: number;
  price: number;
  Food: Food;
  FoodSize?: FoodSize;
  Taste?: Taste;
  BillSale?: BillSale;
}