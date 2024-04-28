'use server';

import bcrypt from 'bcrypt';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { log } from 'console';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

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


// const FormSchema = z.object({
//   id: z.string({
//     invalid_type_error: 'Please Enter User Id.',
//   }),
//   name: z.string({
//     invalid_type_error: 'Please Enter User Name.',
//   }),
//   email: z.string({
//     invalid_type_error: 'Please Enter Email Address.',
//   }),
//   password: z.string().gt(6, { message: 'Please enter password greater than or equal 6 digit.' }),
// });

// export type State = {
//   errors?: {
//     id?: string[];
//     name?: string[];
//     email?: string[];
//     password?: string[];
//   };
//   message?: string | null;
// }

export async function createUser(formData) {


  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = await bcrypt.hash(formData.get('password'), salt);

  const validatedFields = {
    id: formData.get('id'),
    name: formData.get('name'),
    email: formData.get('email'),
    password: hashedPassword,
  };
  // If form validation fails, return errors early. Otherwise, continue.
//   if (!validatedFields.success) {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: 'Missing Fields. Failed to Create User.',
//     };
//   }
    // Prepare data for insertion into the database
//   console.log(formData)
//   console.log(validatedFields)
    // const { id, name, email, password } = validatedFields;
  // Test it out:
    try {
      console.log((validatedFields))
      const res = await fetch(`http://127.0.0.1:3001/user`, {
        method: 'POST', headers: {
            'Content-Type': 'application/json' // Specify that the body contains JSON data
        },
        body: JSON.stringify(validatedFields), // Stringify the object
      });

      console.log(res)
      // return JSON.stringify(res)
    } catch (error) {
        return {
        message: 'Database Error: Failed to Create User.',
        };
    }
  revalidatePath('/test');
  redirect('/test');
}

// export async function createUser() {
//     noStore();
//   try {
//     {
//       console.log('Fetching revenue data...');
//       await new Promise((resolve) => setTimeout(resolve, 3000));
//       console.log('Data fetch completed after 3 seconds.');
//     }
      
//     const res = await fetch(`http://127.0.0.1:3001/letest-invoices`,{method: 'GET',});
//     const data = await res.json();
//     // console.log(data);

//     return data;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch the latest invoices.');
//   }
// }