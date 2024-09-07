import { SignProtocolClient } from "@ethsign/sp-sdk";

export type SignProtocolContextType = {
  signClient?: SignProtocolClient;
};

// export type SignObject = {
//   schemaId: string;
//   data: any;
//   indexingValue: string;
// };

// {
// schemaId: "0xc4",
// data: {
// 	name: "Hello world",
// },
// indexingValue: "-",
// }
