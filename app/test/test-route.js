'use server';

import bcrypt from 'bcrypt';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';

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

    try {
      // console.log((validatedFields))
      const res = await fetch(`http://127.0.0.1:3001/user`, {
        method: 'POST', headers: {
            'Content-Type': 'application/json' // Specify that the body contains JSON data
        },
        body: JSON.stringify(validatedFields), // Stringify the object
      });

      const responce = await res.json(); 
      console.log(responce)
      // console.log(responce.error)
      if (responce.error)
      {
        return responce
      }
    } catch (error) {
        return {
        message: 'Database Error: Failed to Create User.',
        };
    }
  revalidatePath('/login');
  redirect('/login');
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