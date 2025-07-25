/*
  # Enable pgcrypto Extension and Update Auth Functions
  
  1. Changes
    - Enable pgcrypto extension for password encryption
    - Update register_user function to use proper password hashing
    - Add proper error handling
  
  2. Security
    - Proper password hashing with bcrypt
    - Input validation
    - Error handling
*/

-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Update register_user function to use proper password hashing
CREATE OR REPLACE FUNCTION register_user(
  p_email text,
  p_password text,
  p_full_name text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
    crypt(p_password, gen_salt('bf', 10)), -- Using bcrypt with cost factor 10
    jsonb_build_object('full_name', p_full_name)
  )
  RETURNING id INTO v_user_id;

  -- Profile will be created automatically via trigger
END;
$$;

-- Update login function to use proper password comparison
CREATE OR REPLACE FUNCTION login(
  p_email text,
  p_password text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_user_data jsonb;
BEGIN
  -- Attempt to sign in with proper password comparison
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = p_email
  AND encrypted_password = crypt(p_password, encrypted_password);

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
  FROM profiles
  WHERE id = v_user_id;

  -- Return session data
  RETURN jsonb_build_object(
    'user', v_user_data,
    'expires_at', EXTRACT(epoch FROM (now() + interval '1 hour')) * 1000
  );
END;
$$;

-- Ensure proper permissions
GRANT EXECUTE ON FUNCTION login(text, text) TO anon;
GRANT EXECUTE ON FUNCTION register_user(text, text, text) TO anon;