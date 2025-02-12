/*
  # Fix Authentication Functions and Schema
  
  1. Changes
    - Enable pgcrypto extension in the correct schema
    - Update auth functions to use proper schema references
    - Add proper error handling in Portuguese
  
  2. Security
    - Proper password hashing with bcrypt
    - Input validation
    - Error handling
*/

-- Enable pgcrypto extension in the auth schema
CREATE EXTENSION IF NOT EXISTS pgcrypto SCHEMA auth;

-- Update register_user function to use proper schema references
CREATE OR REPLACE FUNCTION auth.register_user(
  p_email text,
  p_password text,
  p_full_name text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = auth, public
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Input validation
  IF p_email IS NULL OR p_password IS NULL OR p_full_name IS NULL THEN
    RAISE EXCEPTION 'Todos os campos são obrigatórios';
  END IF;

  IF LENGTH(p_password) < 8 THEN
    RAISE EXCEPTION 'A senha deve ter pelo menos 8 caracteres';
  END IF;

  -- Check if email already exists
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = p_email) THEN
    RAISE EXCEPTION 'Email já cadastrado';
  END IF;

  -- Create user in auth schema with proper password hashing
  INSERT INTO auth.users (
    email,
    encrypted_password,
    raw_user_meta_data
  )
  VALUES (
    p_email,
    auth.crypt(p_password, auth.gen_salt('bf', 10)), -- Using bcrypt with cost factor 10
    jsonb_build_object('full_name', p_full_name)
  )
  RETURNING id INTO v_user_id;

  -- Profile will be created automatically via trigger
END;
$$;

-- Update login function to use proper schema references
CREATE OR REPLACE FUNCTION auth.login(
  p_email text,
  p_password text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = auth, public
AS $$
DECLARE
  v_user_id uuid;
  v_user_data jsonb;
BEGIN
  -- Attempt to sign in with proper password comparison
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = p_email
  AND encrypted_password = auth.crypt(p_password, encrypted_password);

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Credenciais inválidas';
  END IF;

  -- Get user data
  SELECT jsonb_build_object(
    'id', id,
    'email', email,
    'full_name', full_name
  )
  INTO v_user_data
  FROM public.profiles
  WHERE id = v_user_id;

  -- Return session data
  RETURN jsonb_build_object(
    'user', v_user_data,
    'expires_at', EXTRACT(epoch FROM (now() + interval '1 hour')) * 1000
  );
END;
$$;

-- Update get_session function to use proper schema references
CREATE OR REPLACE FUNCTION auth.get_session()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = auth, public
AS $$
DECLARE
  v_user_id uuid;
  v_user_data jsonb;
BEGIN
  -- Get the current user ID
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN NULL;
  END IF;

  -- Get user data
  SELECT jsonb_build_object(
    'id', id,
    'email', email,
    'full_name', full_name
  )
  INTO v_user_data
  FROM public.profiles
  WHERE id = v_user_id;

  -- Return session data
  RETURN jsonb_build_object(
    'user', v_user_data,
    'expires_at', EXTRACT(epoch FROM (now() + interval '1 hour')) * 1000
  );
END;
$$;

-- Update refresh_session function
CREATE OR REPLACE FUNCTION auth.refresh_session()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = auth, public
AS $$
BEGIN
  RETURN auth.get_session();
END;
$$;

-- Ensure proper permissions
GRANT USAGE ON SCHEMA auth TO anon, authenticated;
GRANT EXECUTE ON FUNCTION auth.login(text, text) TO anon;
GRANT EXECUTE ON FUNCTION auth.register_user(text, text, text) TO anon;
GRANT EXECUTE ON FUNCTION auth.get_session() TO authenticated;
GRANT EXECUTE ON FUNCTION auth.refresh_session() TO authenticated;