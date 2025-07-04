import { v4 as uuidv4 } from 'uuid';

export const generateRekeningData = () => {
  const banks = ['BCA', 'BRI', 'Mandiri', 'BNI', 'CIMB Niaga'];
  const names = [
    'Ahmad Rizky', 'Budi Santoso', 'Cindy Wijaya', 'Dewi Anggraini', 
    'Eko Prasetyo', 'Fitri Handayani', 'Gunawan Wibowo', 'Hana Purnama',
    'Indra Kusuma', 'Joko Widodo', 'Kartika Sari', 'Lina Mulyani',
    'Muhammad Ali', 'Nina Safitri', 'Oscar Darmawan'
  ];
  
  const accounts = [];
  
  for (let i = 0; i < 15; i++) {
    const name = names[i % names.length]; // Ensure we use all names evenly
    const bank = banks[i % banks.length]; // Ensure we use all banks evenly
    const accountNumber = generateRandomAccountNumber(bank);
    
    accounts.push({
      id: uuidv4(),
      name,
      accountNumber,
      bank,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    });
  }
  
  return accounts;
};

const generateRandomAccountNumber = (bank) => {
  let prefix = '';
  let length = 10;
  
  switch (bank) {
    case 'BCA':
      prefix = '2';
      length = 10;
      break;
    case 'BRI':
      prefix = '002';
      length = 15;
      break;
    case 'Mandiri':
      prefix = '008';
      length = 13;
      break;
    case 'BNI':
      prefix = '009';
      length = 10;
      break;
    case 'CIMB Niaga':
      prefix = '022';
      length = 13;
      break;
    default:
      prefix = '0';
      length = 12;
  }
  
  let number = prefix;
  for (let i = prefix.length; i < length; i++) {
    number += Math.floor(Math.random() * 10);
  }
  
  return number;
};

export const validateAccount = (account, existingAccounts = []) => {
  const errors = {};

  if (!account.name || account.name.trim() === '') {
    errors.name = 'Nama penerima harus diisi';
  } else if (account.name.length < 3) {
    errors.name = 'Nama terlalu pendek';
  }

  if (!account.accountNumber || account.accountNumber.trim() === '') {
    errors.accountNumber = 'Nomor rekening harus diisi';
  } else if (!/^\d+$/.test(account.accountNumber)) {
    errors.accountNumber = 'Nomor rekening harus berupa angka';
  } else if (account.accountNumber.length < 8) {
    errors.accountNumber = 'Nomor rekening tidak valid';
  }

  const isDuplicate = existingAccounts.some(
    acc => acc.accountNumber === account.accountNumber && acc.id !== account.id
  );
  
  if (isDuplicate) {
    errors.accountNumber = 'Nomor rekening sudah terdaftar';
  }

  if (!account.bank || account.bank.trim() === '') {
    errors.bank = 'Nama bank harus diisi';
  }

  return errors;
};