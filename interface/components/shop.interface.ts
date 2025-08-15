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