'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
  const supabase = createClient()
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  const { error } = await supabase.auth.signUp(data)
  if (error) {
    return { success: false, message: error.message }
  }
  revalidatePath('/', 'layout')
  return { success: true, message: 'Signup successful! Check your email inbox to confirm your email.' }
}