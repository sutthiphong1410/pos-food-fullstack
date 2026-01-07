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
