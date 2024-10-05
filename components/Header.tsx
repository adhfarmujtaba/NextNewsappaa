import Link from 'next/link';

const Header = () => {
  return (
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white' }}>
      <Link href="/" style={{ textDecoration: 'none', color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
        Leak News
      </Link>
    </header>
  );
};

export default Header;
