import styles from "../styles/Card.module.css";

export default function Card({ left: Left, right: Right }) {
    return (
        <div className={styles['card']}>
            <div className={styles["card-left-info"]}>
              <Left/>
            </div>
            <div className="card-right-info">
              <Right/>
            </div>
        </div>
    )
}