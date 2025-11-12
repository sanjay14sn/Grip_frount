import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loginApiProvider from "../services/login";

const SignInLayer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mobileNumber: "",
    pin: "",
    remember: false,
  });
  const [loading, setLoading] = useState(false);
  const [pinDigits, setPinDigits] = useState(["", "", "", ""]);
  const pinInputs = useRef([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePinChange = (e, index) => {
    const value = e.target.value;
    
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;
    
    // Update the pin digits
    const newPinDigits = [...pinDigits];
    newPinDigits[index] = value;
    setPinDigits(newPinDigits);
    
    // Combine all digits to update formData.pin
    const combinedPin = newPinDigits.join('');
    setFormData(prev => ({
      ...prev,
      pin: combinedPin
    }));
    
    // Auto focus to next input if a digit was entered
    if (value && index < 3) {
      pinInputs.current[index + 1].focus();
    }
  };

  const handlePinKeyDown = (e, index) => {
    // Handle backspace to move to previous input
    if (e.key === 'Backspace' && !pinDigits[index] && index > 0) {
      pinInputs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').slice(0, 4);
    if (/^\d+$/.test(pasteData)) {
      const newPinDigits = [...pinDigits];
      for (let i = 0; i < pasteData.length; i++) {
        if (i < 4) {
          newPinDigits[i] = pasteData[i];
        }
      }
      setPinDigits(newPinDigits);
      setFormData(prev => ({
        ...prev,
        pin: newPinDigits.join('')
      }));
      if (pasteData.length === 4) {
        pinInputs.current[3].focus();
      } else {
        pinInputs.current[pasteData.length].focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate inputs
    if (!/^\d{10}$/.test(formData.mobileNumber)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    if (formData.pin.length !== 4) {
      toast.error("PIN must be 4 digits");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await loginApiProvider.login({
        mobileNumber: formData.mobileNumber,
        pin: formData.pin
      });
  
      if (response?.status) {
        const token = response?.response?.token;
        const userData = response?.response?.member;
        
        if (token && userData) {
          localStorage.setItem("userToken", token);
          localStorage.setItem("userData", JSON.stringify(userData));
          toast.success('Login successful!', {
            onClose: () => {
             
              navigate('/dashboard', { replace: true });
              window.location.reload();
            }
          });
        }
      } else {
        throw new Error(response?.message || "Login failed");
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Auto-focus first pin input on mount
  useEffect(() => {
    if (pinInputs.current[0]) {
      pinInputs.current[0].focus();
    }
  }, []);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <section className='auth mainpage bg-base d-flex flex-wrap'>
        <div className='auth-left d-lg-block d-none'>
          <div className='d-flex d-none align-items-center flex-column h-100 justify-content-center'>
            <img src='assets/images/auth/auth-img.jpg' alt='' />
          </div>
        </div>
        <div className='auth-right py-32 px-24 d-flex flex-column justify-content-center'>
          <div className='insidebox max-w-464-px mx-auto w-100'>
            <div>
              <Link to='/' className='mb-40 max-w-150-px'>
                <img src='assets/images/logo.png' alt='' />
              </Link>
              <h4 className='mb-12'>Welcome back! GRIP Business Forum</h4>
            </div>
            <form onSubmit={handleSubmit}>
              <div className='icon-field mb-16'>
                <span className='icon top-50 translate-middle-y'>
                  <Icon icon='mdi:cellphone' />
                </span>
                <input
                  type='tel'
                  name='mobileNumber'
                  className='form-control h-56-px bg-neutral-50 radius-12'
                  placeholder='Mobile Number'
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  maxLength="10"
                  pattern="[0-9]{10}"
                  required
                />
              </div>
              <div className='position-relative mb-20'>
                <div className='d-flex align-items-center mb-2'>
                  <span className='icon me-2'>
                    {/* <Icon icon='mdi:lock' /> */}
                  </span>
                  <label className='text-secondary-light'>{""}</label>
                </div>
                <div className='d-flex gap-3'>
                  {[0, 1, 2, 3].map((index) => (
                    <input
                      key={index}
                      type='password'
                      className='form-control h-50-px bg-neutral-50 radius-12 text-center'
                      maxLength="1"
                      value={pinDigits[index]}
                      onChange={(e) => handlePinChange(e, index)}
                      onKeyDown={(e) => handlePinKeyDown(e, index)}
                      onPaste={handlePaste}
                      ref={(el) => (pinInputs.current[index] = el)}
                      required
                    />
                  ))}
                </div>
              </div>
              <div className=''>
                <div className='d-flex justify-content-between gap-2'>
                  <div className='form-check style-check d-flex align-items-center'>
                    <input
                      className='form-check-input border border-neutral-300'
                      type='checkbox'
                      name='remember'
                      id='remember'
                      checked={formData.remember}
                      onChange={handleChange}
                    />
                    <label className='form-check-label' htmlFor='remember'>
                      Remember me
                    </label>
                  </div>
                  <Link to='/forgot-pin' className='text-primary-600 fw-medium'>
                    Forgot PIN?
                  </Link>
                </div>
              </div>
              <button
                type='submit'
                className='btn btn-primary grip text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32 fw-semibold'
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <div className='mt-32 text-center text-sm'>
                <p className='mb-0'>
                  Let's grow together! Join the GRIP Business Forum{" "}
                  <Link to='/sign-up' className='text-primary-600 fw-semibold'>
                    Register today!
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignInLayer;