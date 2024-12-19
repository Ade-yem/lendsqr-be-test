export const generateAccountNumber = (): string => 
 "7" + Math.floor(100000000 + Math.random() * 900000000).toString();
