  export interface IPhone {
    id: string;
    brand: string;
    model: string;
    price: number;
    image: string;
    description: string;
    quantity: number;
    specs: ISpecs;
    createdAt: string;
  }
  
  export interface ISpecs {
    cpu: string;
    ram: string;
    rom: string;
    battery: string;
    cameraRear: string;
    cameraFront: string;
    displaySize: string;
  }
  
  export interface IProducts {
    id: string;
    brand: string;
    model: string;
    price: number;
    image: string;
  }

  export interface IOrder {
    id: string;
    createdAt: string;
    total: number;
    status: 'pending' | 'paid' | 'shipped' | 'cancelled';
    items: {
      phoneId: string;
      quantity: number;
      phone: {
        brand: string;
        model: string;
        image: string;
      };
    }[];
  }

  export interface ICartItem {
    id: string;
    quantity: number;
    phone: IPhone;
  }
  
  export interface ICart {
    items: ICartItem[];
    total: number;
  }