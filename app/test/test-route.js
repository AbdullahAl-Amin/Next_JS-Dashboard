
import { PrismaClient } from '@prisma/client'
import { unstable_noStore as noStore } from 'next/cache';
const prisma = new PrismaClient();

export async function LatestInvoice() {
    noStore();
  try {
    {
      console.log('Fetching revenue data...');
      await new Promise((resolve) => setTimeout(resolve, 3000));
      console.log('Data fetch completed after 3 seconds.');
    }
      
    const res = await fetch(`http://127.0.0.1:3001/letest-invoices`,{method: 'GET',});
    const data = await res.json();
    // console.log(data);

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}