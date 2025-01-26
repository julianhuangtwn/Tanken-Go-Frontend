import { useAuth } from '../../Auth/AuthContext';
import { useRouter } from 'next/navigation';
import '../styles/signin.css';
import Link from 'next/link';

export default function Page(){
    const { login } = useAuth();


    const handleLogin = () => {
        login();
        window.location.href = '/account'; // Redirect to account after login
    };

    return (
      <div className="signin-container">
        <div className="welcome-section">
          <h1>WELCOME!</h1>
          <p>Lets start planning your trip.</p>
        </div>
        <div className="form-section">
          <form>
            <label htmlFor="email">Email or Phone number</label>
            <input type="text" id="email" name="email" placeholder="Enter your email or phone number" />
            
            <label htmlFor="password">Password</label>
            <div className="password-container">
              <input type="password" id="password" name="password" placeholder="Enter your password" />
              <span className="toggle-password">👁️</span>
            </div>
            
            <a href="/forgot-password" className="forgot-password">Forgot your password?</a>
            
            <button type="submit" className="login-button">Log In</button>
          </form>
          
          <p className="signup-text">
            Don not have an account yet? <Link href="/register">Create one now</Link>
          </p>
        </div>
      </div>
    );
  };
  

  