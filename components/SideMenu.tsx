// components/SideMenu.tsx
import Link from 'next/link';
import React from 'react';
import styles from './SideMenu.module.css';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose }) => {
  return (
    <div className={`${styles.sideMenu} ${isOpen ? styles.open : ''}`}>
      <button className={styles.menuButton} onClick={onClose}>
        ✖
      </button>
      <div className={styles.menuContent}>
        <h2>Categories</h2>
        <ul>
          <li>
            <Link href="/category/tech">Tech</Link>
          </li>
          <li>
            <Link href="/category/lifestyle">Lifestyle</Link>
          </li>
          <li>
            <Link href="/category/travel">Travel</Link>
          </li>
          <li>
            <Link href="/category/food">Food</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideMenu;
