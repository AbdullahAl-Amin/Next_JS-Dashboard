import { PrismaClient } from '@prisma/client';
import { unstable_noStore as noStore } from 'next/cache';

const prisma = new PrismaClient()

import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  User,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';
import { number } from 'zod';

export async function fetchRevenue() {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)
    {
      console.log('Fetching revenue data...');
      await new Promise((resolve) => setTimeout(resolve, 3000));
      console.log('Data fetch completed after 3 seconds.');
    }
    
    const data = await prisma.revenue.findMany();
    // const data = await sql<Revenue>`SELECT * FROM revenue`;

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
    noStore();
  try {
    // const data = await sql<LatestInvoiceRaw>`
    //   SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
    //   FROM invoices
    //   JOIN customers ON iunvoices.cstomer_id = customers.id
    //   ORDER BY invoices.date DESC
    //   LIMIT 5`;

    {
      console.log('Fetching revenue data...');
      await new Promise((resolve) => setTimeout(resolve, 3000));
      console.log('Data fetch completed after 3 seconds.');
    }

    const data = await prisma.invoice.findMany({
      select: {
        amount: true,
        customer: {
          select: {
            name: true,
            image_url: true,
            email: true,
          },
        },
        id: true,
      },
      orderBy: {
        date: 'desc',
      },
      take: 5,
    });

    // console.log(data);
    // console.log(data[0].customer.name);

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
    noStore();
  try {

    {
      console.log('Fetching revenue data...');
      await new Promise((resolve) => setTimeout(resolve, 3000));
      console.log('Data fetch completed after 3 seconds.');
    }
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    // const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    // const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    // const invoiceStatusPromise = sql`SELECT
    //      SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
    //      SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
    //      FROM invoices`;
    const invoiceCountPromise = await prisma.invoice.aggregate({
        _count: true
    });

    const customerCountPromise = await prisma.customer.aggregate({
        _count: true
    });

   
      const paidTotal = await prisma.invoice.aggregate({
        _sum: {
          amount: true
        },
        where: {
          status: 'paid'
        }
      });

      const pendingTotal = await prisma.invoice.aggregate({
        _sum: {
          amount: true
        },
        where: {
          status: 'pending'
        }
      });

      const invoiceStatusPromise = {
        paid: paidTotal. _sum.amount || 0,
        pending: pendingTotal. _sum.amount || 0
      };

    // const invoiceStatusPromise = await prisma.invoice.aggregate({
    //   _sum: {
    //     amount: true
    //   },
    //   where: {
    //     OR: [
    //       { status: 'paid' },
    //       { status: 'pending' }
    //     ]
    //   }
    // });

    // console.log(invoiceCountPromise);
    // console.log(customerCountPromise);
    // console.log(invoiceStatusPromise);
    
    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    // const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    // const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    // const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    // const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');


    const numberOfInvoices = Number(invoiceCountPromise. _count ?? '0');
    const numberOfCustomers = Number(customerCountPromise. _count ?? '0');
    const totalPaidInvoices = formatCurrency(invoiceStatusPromise.paid ?? '0');
    const totalPendingInvoices = formatCurrency(invoiceStatusPromise.pending ?? '0');


    // console.log(parseInt(numberOfInvoices));
    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  noStore();
  try {
    // const invoices = await prisma.$queryRaw`
    //   SELECT
    //     invoices.id,
    //     invoices.amount,
    //     invoices.date,
    //     invoices.status,
    //     customers.name,
    //     customers.email,
    //     customers.image_url
    //   FROM invoices
    //   JOIN customers ON invoices.customer_id = customers.id
    //   WHERE
    //     customers.name ILIKE ${`%${query}%`} OR
    //     customers.email ILIKE ${`%${query}%`} OR
    //     invoices.amount::text ILIKE ${`%${query}%`} OR
    //     invoices.date::text ILIKE ${`%${query}%`} OR
    //     invoices.status ILIKE ${`%${query}%`}
    //   ORDER BY invoices.date DESC
    //   LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    // `;

     const invoices = await prisma.invoice.findMany({
      select: {
        id: true,
        amount: true,
        date: true,
        status: true,
        customer: {
          select: {
            name: true,
            email: true,
            image_url: true,
          },
        },
      },
      where: {
        OR: [
          { customer: { name: { startsWith: query  } } },
          { customer: { name: { endsWith: '_'+query } } },
          { customer: { email: { startsWith: '_'+query } } },
          { customer: { email: { endsWith: '_'+query } } },
          // { amount: { startsWith: '_' } },
          // { amount: { endsWith: '_' } },
          { date: { startsWith: '_'+query } },
          { date: { endsWith: '_'+query } },
          { status: { startsWith: '_'+query } },
          { status: { endsWith: '_'+query } },
        ],
      },
      orderBy: {
        date: 'desc',
      },
      take: ITEMS_PER_PAGE,
      skip: offset,
    });
    
    // console.log(invoices[0]);
    // console.log(invoices[0].customer.name);
    return invoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  noStore();
  try {
  //   const count = await sql`SELECT COUNT(*)
  //   FROM invoices
  //   JOIN customers ON invoices.customer_id = customers.id
  //   WHERE
  //     customers.name ILIKE ${`%${query}%`} OR
  //     customers.email ILIKE ${`%${query}%`} OR
  //     invoices.amount::text ILIKE ${`%${query}%`} OR
  //     invoices.date::text ILIKE ${`%${query}%`} OR
  //     invoices.status ILIKE ${`%${query}%`}
    // `;
    
    const count = await prisma.invoice.findMany({
      select: {
        customer: true,
      },
      where: {
        OR: [
              { customer: { name: { startsWith: query  } } },
              { customer: { name: { endsWith: '_'+query } } },
              { customer: { email: { startsWith: '_'+query } } },
              { customer: { email: { endsWith: '_'+query } } },
              // { amount: { startsWith: '_' } },
              // { amount: { endsWith: '_' } },
              { date: { startsWith: '_'+query } },
              { date: { endsWith: '_'+query } },
              { status: { startsWith: '_'+query } },
              { status: { endsWith: '_'+query } },
            ],
      },
    });

    // console.log(count.length);
    const totalPages = Math.ceil(Number(count.length) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
    noStore();
  try {
    // const data = await sql<InvoiceForm>`
    //   SELECT
    //     invoices.id,
    //     invoices.customer_id,
    //     invoices.amount,
    //     invoices.status
    //   FROM invoices
    //   WHERE invoices.id = ${id};
    // `;
    const invoice = await prisma.invoice.findFirst({
      select: {
        id: true,
        customer_id: true,
        amount: true,
        status: true
      },
      where:{ id: parseInt(id)}
    })
    // console.log(invoice); // Invoice is an empty array []

    return invoice;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    // const data = await sql<CustomerField>`
    //   SELECT
    //     id,
    //     name
    //   FROM customers
    //   ORDER BY name ASC
    // `;

    const data = await prisma.customer.findMany({
      select: {
        id: true,
        name: true
      },
      orderBy:{ name: 'asc'}
    });

    const customers = data;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function getUser(email: string) {
  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
