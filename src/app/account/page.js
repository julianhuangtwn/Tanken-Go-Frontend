// app/account/page.js

export default function Page(){
    return (
      <div style={styles.container}>
        <h1>Account</h1>
        <p>Manage your account settings and personal information.</p>
      </div>
    );
  };
  
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      textAlign: 'center',
    },
  };
  
  