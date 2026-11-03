
import styles from "./header.module.scss";
import {
  UserRound,
  Heart,
  ShoppingCart,
  Search,
} from "lucide-react";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <a href="/" className={styles.logo}>
          <span className={styles.logoIcon}>🌿</span>

          <span>
            <strong>Priya Store</strong>
            <small>Style for a Better You</small>
          </span>
        </a>

        <div className={styles.search}>
          <input
            type="search"
            placeholder="Search for products..."
          />
          <button type="button" aria-label="Search">
  <Search size={20} />
</button>
        </div>

        <div className={styles.actions}>
<button type="button" className={styles.iconButton}>
  <UserRound size={20} strokeWidth={1.7} />
  <span>Account</span>
</button>          <button type="button" className={styles.iconButton}>
            <Heart size={20} strokeWidth={1.7} />
            <span>Wishlist</span>
          </button>
          <button type="button" className={styles.iconButton}>
            <ShoppingCart size={20} strokeWidth={1.7} />
            <span>Cart</span>
          </button>
        </div>
      </div>

      <nav className={styles.nav}>
        <a href="/">Home</a>
        <a href="/products">Shop</a>
        <a href="/categories/men">Men</a>
        <a href="/categories/woman">Women</a>
        <a href="/categories/electronics">Electronics</a>
        <a href="/categories/home-living">Home & Living</a>
        <a href="/offers">Offers</a>
      </nav>
    </header>
  );
}
