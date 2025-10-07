-- Fix profile creation issues by adding more permissive policies and RPC function

-- Create a more permissive policy for profile insertion
-- This allows the trigger to create profiles even if RLS is enabled
CREATE POLICY "Allow profile creation for new users" 
ON public.profiles 
FOR INSERT 
WITH CHECK (true);

-- Create an RPC function for profile creation that bypasses RLS
CREATE OR REPLACE FUNCTION public.create_user_profile(
  p_user_id UUID,
  p_email TEXT,
  p_full_name TEXT,
  p_role TEXT DEFAULT 'Staff'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  -- Insert the profile
  INSERT INTO public.profiles (user_id, email, full_name, role)
  VALUES (p_user_id, p_email, p_full_name, p_role)
  RETURNING to_json(profiles.*) INTO result;
  
  RETURN result;
EXCEPTION
  WHEN unique_violation THEN
    -- Profile already exists, return existing profile
    SELECT to_json(profiles.*) INTO result
    FROM public.profiles
    WHERE user_id = p_user_id;
    
    RETURN result;
  WHEN OTHERS THEN
    -- Return error information
    RETURN json_build_object(
      'error', true,
      'message', SQLERRM,
      'code', SQLSTATE
    );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_user_profile TO authenticated;

-- Update the existing trigger function to handle errors better
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Try to insert the profile, but don't fail if it already exists
  INSERT INTO public.profiles (user_id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'Staff')
  )
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;
