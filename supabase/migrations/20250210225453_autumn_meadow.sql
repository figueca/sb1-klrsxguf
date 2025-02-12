/*
  # Authentication Functions
  
  1. New Functions
    - `get_session`: Retrieves the current user session
    - `refresh_session`: Refreshes the user session
    - `login`: Handles user login
    - `register_user`: Handles user registration
    - `logout`: Handles user logout
  
  2. Security
    - All functions are SECURITY DEFINER to run with elevated privileges
    - Input validation and error handling
    - Session management with expiration
*/

-- Session management functions
CREATE OR REPLACE FUNCTION get_session()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
  FROM profiles
  WHERE id = v_user_id;

  -- Return session data
  RETURN jsonb_build_object(
    'user', v_user_data,
    'expires_at', EXTRACT(epoch FROM (now() + interval '1 hour')) * 1000
  );
END;
$$;

CREATE OR REPLACE FUNCTION refresh_session()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN get_session();
END;
$$;

-- Authentication functions
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
  -- Attempt to sign in
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = p_email
  AND encrypted_password = crypt(p_password, encrypted_password);

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Invalid credentials';
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
    RAISE EXCEPTION 'All fields are required';
  END IF;

  IF LENGTH(p_password) < 8 THEN
    RAISE EXCEPTION 'Password must be at least 8 characters long';
  END IF;

  -- Check if email already exists
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = p_email) THEN
    RAISE EXCEPTION 'Email already registered';
  END IF;

  -- Create user in auth schema
  INSERT INTO auth.users (
    email,
    encrypted_password,
    raw_user_meta_data
  )
  VALUES (
    p_email,
    crypt(p_password, gen_salt('bf')),
    jsonb_build_object('full_name', p_full_name)
  )
  RETURNING id INTO v_user_id;

  -- Profile will be created automatically via trigger
END;
$$;

CREATE OR REPLACE FUNCTION logout()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- In a real implementation, this would invalidate the session token
  -- For now, it's handled client-side
  RETURN;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_session() TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_session() TO authenticated;
GRANT EXECUTE ON FUNCTION login(text, text) TO anon;
GRANT EXECUTE ON FUNCTION register_user(text, text, text) TO anon;
GRANT EXECUTE ON FUNCTION logout() TO authenticated;