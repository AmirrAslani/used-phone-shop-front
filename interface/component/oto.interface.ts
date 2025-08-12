export interface ILoginState {
    username: string;
    password: string;
    error: string;
}

export interface ICountry {
    name: {
      common: string;
      official: string;
    };
    capital: string[];
    population: number;
    area: number;
    flags: {
      png: string;
      svg: string;
    };
  }